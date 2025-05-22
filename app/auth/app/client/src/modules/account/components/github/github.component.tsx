import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAccount, useApi, useUser } from "shared/hooks";
import { RequestMethod } from "shared/enums";
import {
  ButtonComponent,
  GithubIconComponent,
} from "@openhotel/web-components";
import { RedirectComponent } from "shared/components";

//https://github.com/login/oauth/authorize?client_id=Ov23liP5bbBloeAyvY5h&redirect_uri=http://localhost:2024/account/github&state=akjsdaklsdjkl
export const GithubComponent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { getAccountHeaders, isLogged } = useAccount();
  const { fetch } = useApi();
  const navigate = useNavigate();
  const { user } = useUser();

  const [code, setCode] = useState(searchParams.get("code"));
  const [state, setstate] = useState(searchParams.get("state"));

  const [githubLogin, setGithubLogin] = useState(user?.githubLogin);

  const [enabled, setEnabled] = useState<boolean>(null);
  const [loaded, setLoaded] = useState<boolean>(true);

  useEffect(() => {
    if (enabled !== null) return;
    fetch({
      method: RequestMethod.GET,
      pathname: "/account/_/github?enabled=enabled",
      headers: getAccountHeaders(),
    }).then(({ enabled }) => {
      setEnabled(enabled);
    });
  }, [fetch, getAccountHeaders, setEnabled, enabled]);

  useEffect(() => {
    if (!user || !user?.githubLogin || !enabled) return;
    setGithubLogin(user?.githubLogin);
  }, [user, setGithubLogin, enabled]);

  useEffect(() => {
    if (!isLogged || !user || !searchParams.get("github") || !enabled) return;
    setLoaded(false);
    const url = new URL(window.location.href);
    url.searchParams.delete("github");
    url.searchParams.delete("code");
    url.searchParams.delete("state");
    setCode(null);
    setstate(null);

    window.history.replaceState({}, "", url);

    fetch({
      method: RequestMethod.POST,
      pathname: "/account/_/github",
      body: {
        code,
        state,
      },
      headers: getAccountHeaders(),
    }).then(({ login }) => {
      setGithubLogin(login);
      setLoaded(true);
    });
  }, [
    isLogged,
    user,
    getAccountHeaders,
    setstate,
    setCode,
    setLoaded,
    enabled,
  ]);

  const onClickLinkGithub = useCallback(async () => {
    const data = await fetch({
      method: RequestMethod.GET,
      pathname: "/account/_/github",
      headers: getAccountHeaders(),
    });
    window.location.href = data.url;
  }, [fetch, getAccountHeaders, navigate]);

  const onClickUnlinkGithub = useCallback(async () => {
    await fetch({
      method: RequestMethod.DELETE,
      pathname: "/account/_/github",
      headers: getAccountHeaders(),
    }).then(() => setGithubLogin(null));
  }, [fetch, getAccountHeaders, navigate, setGithubLogin]);

  if (!enabled) return null;

  if (code || state)
    return (
      <RedirectComponent
        to={`/account?github=link&state=${state}&code=${code}`}
      />
    );

  return (
    <div>
      {loaded ? (
        githubLogin ? (
          <ButtonComponent onClick={onClickUnlinkGithub} color="grey">
            <GithubIconComponent /> Unlink '{githubLogin}' Github account
          </ButtonComponent>
        ) : (
          <ButtonComponent onClick={onClickLinkGithub}>
            <GithubIconComponent /> Link Github account
          </ButtonComponent>
        )
      ) : (
        <label>loading...</label>
      )}
    </div>
  );
};
