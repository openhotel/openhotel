import React, { FormEvent, useCallback, useEffect, useState } from "react";
import { useAccount, useApi, useQR } from "shared/hooks";
import { Navigate, useNavigate } from "react-router-dom";
import { LinkComponent } from "shared/components";
import { AdminComponent } from "modules/admin";

export const AccountComponent: React.FC = () => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [otpLoaded, setOTPLoaded] = useState<boolean>(false);

  const [account, setAccount] = useState<{
    username: string;
    email: string;
    isAdmin?: boolean;
  }>();
  const [otpUrl, setOTPUrl] = useState<string>();
  let navigate = useNavigate();

  const { refreshSession } = useApi();
  const { getAccount, getOTP, verifyOTP, deleteOTP } = useAccount();
  const { getQR } = useQR();

  const $reloadOTP = () => {
    getOTP().then(async (uri) => {
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

    const isVerified = await verifyOTP(token);
    if (isVerified) setOTPUrl(null);
  }, []);

  const onDeleteOTP = async () => {
    setOTPLoaded(false);
    await deleteOTP();
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
        <h2>OTP</h2>
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
      <div>
        <h2>Actions</h2>
        <LinkComponent to="/">Go to hotel</LinkComponent>
        <p />
        <LinkComponent to="/logout">Logout</LinkComponent>
        <p />
      </div>
      {account.isAdmin ? (
        <div>
          <hr />
          <AdminComponent />
        </div>
      ) : null}
    </div>
  );
};
