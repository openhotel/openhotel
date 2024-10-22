import React, { FormEvent, useCallback } from "react";
import { Account } from "shared/types";
import { useAccount } from "shared/hooks";

type Props = {
  account: Account;
};

export const BskyComponent: React.FC<Props> = ({ account }) => {
  const { at } = useAccount();

  const onSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.target as unknown as HTMLFormElement);
    const did = data.get("did") as string;

    console.log(did);
    if (!did || did.length !== 24) return;

    await at.create(did);
  }, []);

  const handler = `${account.username}.openhotel.club`;

  return (
    <div
      style={{
        backgroundColor: "rgb(22, 30, 39)",
        color: "rgb(174, 187, 201)",
        padding: "2rem",
      }}
    >
      <h2>Bluesky handler claimer</h2>
      <form onSubmit={onSubmit}>
        <b>{"Go to Settings -> Change Handle -> I have my own domain "}</b>
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
          2. Copy the (did) red part only (24 letters/numbers) to the input{" "}
          <br />
          <label style={{ backgroundColor: "black" }}>did=did:plc:</label>
          <b
            style={{ backgroundColor: "rgba(206, 2, 2, 0.66)", color: "white" }}
          >
            xxxxxxxxxxxxxxxxxxxxxxxx
          </b>
        </div>
        <br />
        <input placeholder="bluesky account did" name="did" maxLength={24} />
        <br />
        <br />
        <button type="submit" style={{ cursor: "pointer" }}>
          3. Submit
        </button>
        <br />
        <br />
        <label>4. Click on 'Verify DNS Record'</label>
        <br />
        <br />
        <label
          style={{ backgroundColor: "rgba(206, 2, 2, 0.66)", color: "white" }}
        >
          If it doesn't work, wait a few minutes/hours and try again. This
          process can be slow at times, be patient!
        </label>
      </form>
    </div>
  );
};
