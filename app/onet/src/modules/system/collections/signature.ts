import { decodeBase64, encodeBase64 } from "@std/encoding/base64";
import { CollectionManifest } from "shared/types/main.ts";
import { getStableJson } from "shared/utils/main.ts";

const KEY_PATHNAME = "./collections-key";

export const signature = () => {
  let $privateKey: CryptoKey;
  let $publicKey: CryptoKey;
  let $publicKeyText: string;

  const $importKeys = async (jwk: JsonWebKey) => {
    $privateKey = await crypto.subtle.importKey("jwk", jwk, "Ed25519", false, [
      "sign",
    ]);

    $publicKey = await crypto.subtle.importKey(
      "jwk",
      { kty: jwk.kty, crv: jwk.crv, x: jwk.x },
      "Ed25519",
      true,
      ["verify"],
    );

    $publicKeyText = jwk.x!;
  };

  const load = async () => {
    try {
      return await $importKeys(
        JSON.parse(await Deno.readTextFile(KEY_PATHNAME)),
      );
    } catch (e) {
      if (!(e instanceof Deno.errors.NotFound)) throw e;
    }

    const { privateKey } = await crypto.subtle.generateKey("Ed25519", true, [
      "sign",
      "verify",
    ]);
    const jwk = await crypto.subtle.exportKey("jwk", privateKey);

    await Deno.writeTextFile(KEY_PATHNAME, JSON.stringify(jwk), {
      mode: 0o600,
    });

    await $importKeys(jwk);
    console.log("Collections signing key generated!");
  };

  const $getPayload = ({ signature, ...manifest }: CollectionManifest) =>
    new TextEncoder().encode(getStableJson(manifest));

  const sign = async (manifest: CollectionManifest): Promise<string> =>
    encodeBase64(
      await crypto.subtle.sign("Ed25519", $privateKey, $getPayload(manifest)),
    );

  const verify = (manifest: CollectionManifest): Promise<boolean> => {
    if (!manifest.signature) return Promise.resolve(false);

    return crypto.subtle.verify(
      "Ed25519",
      $publicKey,
      decodeBase64(manifest.signature),
      $getPayload(manifest),
    );
  };

  const getPublicKey = () => $publicKeyText;

  return {
    load,
    sign,
    verify,
    getPublicKey,
  };
};
