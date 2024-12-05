import React from "react";
import { useUser } from "shared/hooks";
import { ButtonComponent, InputComponent } from "@oh/components";

type Props = {};

export const BskyComponent: React.FC<Props> = ({}) => {
  const { user } = useUser();

  if (!user) return null;
  // const { at } = useAccount();
  //
  // const onSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //
  //   const data = new FormData(event.target as unknown as HTMLFormElement);
  //   const did = data.get("did") as string;
  //
  //   if (!did || !new RegExp(PROTO_DID_REGEX).test(did)) return;
  //
  //   await at.create(did);
  // }, []);

  const onSubmit = () => {};

  const handler = `${user.username}.openhotel.club`;

  return (
    <div>
      <h2>Bluesky handler claimer</h2>
      <div
        style={{
          backgroundColor: "rgb(22, 30, 39)",
          color: "rgb(174, 187, 201)",
          padding: "2rem",
        }}
      >
        <form onSubmit={onSubmit}>
          <b>
            Go to{" "}
            <a href="https://bsky.app/settings/account" target="_blank">
              Settings
            </a>
            {" -> Handle -> I have my own domain "}
          </b>
          <br />
          <br />
          <label>
            1. Introduce{" "}
            <b
              style={{
                backgroundColor: "white",
                color: "rgb(22, 30, 39)",
                padding: "0 1rem",
              }}
            >
              {handler}
            </b>{" "}
            on the first input
          </label>
          <br />
          <br />
          <div>
            2. Copy the (did) red part only to the input <br />
            <b
              style={{
                backgroundColor: "rgba(206, 2, 2, 0.66)",
                color: "white",
              }}
            >
              did=did:plc:xxxxxxxxxxxxxxxxxxxxxxxx
            </b>
          </div>
          <br />
          <InputComponent placeholder="bluesky account did" name="did" />
          <br />
          <br />
          <ButtonComponent type="submit">3. Submit</ButtonComponent>
          <br />
          <br />
          <label>4. Click on 'Verify DNS Record'</label>
          <br />
          <br />
          <label>
            - 5A. Don't click on 'Update to {handler}' if you want to preserve
            your own handler. This will work as an additional one.
          </label>
          <br />
          <br />
          <label>
            - 5B. Click on 'Update to {handler}' if you want to change your main
            handler to this one.
          </label>
          <br />
          <br />
          <label
            style={{ backgroundColor: "rgba(206, 2, 2, 0.66)", color: "white" }}
          >
            If it doesn't work:
          </label>
          <label
            style={{ backgroundColor: "rgba(206, 2, 2, 0.66)", color: "white" }}
          >
            - Check if another of your accounts already have this handler and
            remove it. (it doesn't work on multiple accounts)
          </label>
          <label
            style={{ backgroundColor: "rgba(206, 2, 2, 0.66)", color: "white" }}
          >
            - Wait a few minutes/hours and try again. This process can be slow
            at times, be patient!
          </label>
        </form>
      </div>
    </div>
  );
};
