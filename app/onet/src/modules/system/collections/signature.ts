import { encodeBase64 } from "@std/encoding/base64";
import {
  CollectionManifest,
  getCollectionManifestPayload,
  verifyCollectionManifest,
} from "@oh/core";

const KEY_PATHNAME = "./collections-key";

export const signature = () => {
  let $privateKey: CryptoKey;
  let $publicKeyText: string;

  const $importKeys = async (jwk: JsonWebKey) => {
    $privateKey = await crypto.subtle.importKey("jwk", jwk, "Ed25519", false, [
      "sign",
    ]);

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

  const sign = async (manifest: CollectionManifest): Promise<string> =>
    encodeBase64(
      await crypto.subtle.sign(
        "Ed25519",
        $privateKey,
        getCollectionManifestPayload(manifest) as BufferSource,
      ),
    );

  const verify = (manifest: CollectionManifest): Promise<boolean> =>
    verifyCollectionManifest(manifest, [$publicKeyText]);

  const getPublicKey = () => $publicKeyText;

  return {
    load,
    sign,
    verify,
    getPublicKey,
  };
};
