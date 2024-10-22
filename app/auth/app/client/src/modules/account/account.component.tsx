import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { useAccount, useApi, useQR } from "shared/hooks";
import { useNavigate } from "react-router-dom";
import { LinkComponent } from "shared/components";
import { AdminComponent } from "modules/admin";
import { BskyComponent } from "./components";
import { Account } from "shared/types";

export const AccountComponent: React.FC = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [otpLoaded, setOTPLoaded] = useState<boolean>(false);

  const [account, setAccount] = useState<Account>();
  const [otpUrl, setOTPUrl] = useState<string>();
  let navigate = useNavigate();

  const { refreshSession } = useApi();
  const { getAccount, otp } = useAccount();
  const { getQR } = useQR();

  const $reloadOTP = () => {
    otp.get().then(async (uri) => {
      if (uri) setOTPUrl(await getQR(uri));
      setOTPLoaded(true);
    });
  };

  useEffect(() => {
    refreshSession()
      .then(async () => {
        setLoaded(true);

        setAccount(await getAccount());
        $reloadOTP();
      })
      .catch(() => {
        navigate("/login");
      });
  }, []);

  useEffect(() => {}, []);

  const onSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.target as unknown as HTMLFormElement);
    const token = data.get("token") as string;

    if (!token || token.length !== 6) return;

    const isVerified = await otp.verify(token);
    if (isVerified) setOTPUrl(null);
  }, []);

  const onDeleteOTP = async () => {
    setOTPLoaded(false);
    await otp.remove();
    $reloadOTP();
  };

  if (!loaded || !account) return <div>loading....</div>;

  return (
    <div>
      <div>
        <h2>Account</h2>
        <p>{account.username}</p>
        <p>{account.email}</p>
      </div>
      <div>
        <h2>2FA</h2>
        {otpLoaded &&
          (otpUrl ? (
            <form onSubmit={onSubmit}>
              <img src={otpUrl} />
              <input name="token" maxLength={6} />
              <button>Verify</button>
            </form>
          ) : (
            <div>
              OTP active <button onClick={onDeleteOTP}>Remove OTP</button>
            </div>
          ))}
      </div>
      <BskyComponent account={account} />
      <div>
        <h2>Actions</h2>
        <LinkComponent to="/">Go to hotel</LinkComponent>
        <p />
        <LinkComponent to="/logout">Logout</LinkComponent>
        <p />
      </div>
      {account?.isAdmin ? (
        <div>
          <hr />
          <AdminComponent />
        </div>
      ) : null}
    </div>
  );
};
