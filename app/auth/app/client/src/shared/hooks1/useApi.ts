import Cookies from "js-cookie";
import { redirectToFallbackRedirectUrl } from "shared/utils/urls.utils";

export const useApi = () => {
  const getTicketId = () => new URLSearchParams(location.hash).get("#ticketId");

  const clearSessionCookies = () => {
    Cookies.remove("sessionId");
    Cookies.remove("token");
    Cookies.remove("refreshToken");
  };

  const getSessionId = () => Cookies.get("sessionId");
  const getToken = () => Cookies.get("token");
  const getRefreshToken = () => Cookies.get("refreshToken");

  const setFallbackRedirectUrl = (redirectUrl: string) => {
    const { href, search } = new URL(redirectUrl);
    localStorage.setItem("fallbackRedirectUrl", href.replace(search, ""));
  };

  const login = (
    email: string,
    password: string,
    captchaId: string,
    ticketId?: string,
    otpToken?: string,
  ) =>
    new Promise((resolve, reject) => {
      fetch("/api/v2/account/login", {
        method: "POST",
        body: JSON.stringify({
          ticketId,

          email,
          password,
          captchaId,

          otpToken,
        }),
      })
        .then((data) => data.json())
        .then(({ status, data }) => {
          if (status === 410) return redirectToFallbackRedirectUrl();
          if (status !== 200) return reject({ status });
          Cookies.set("sessionId", data.sessionId, {
            expires: 7,
            sameSite: "strict",
            secure: true,
          });
          Cookies.set("refreshToken", data.refreshToken, {
            expires: 7,
            sameSite: "strict",
            secure: true,
          });
          if (data.redirectUrl) setFallbackRedirectUrl(data.redirectUrl);
          else
            Cookies.set("token", data.token, {
              expires: 1,
              sameSite: "strict",
              secure: true,
            });
          resolve(data);
        })
        .catch(() => reject({ status: 600 }));
    });

  const refreshSession = (
    ticketId?: string,
  ): Promise<{ redirectUrl: string }> =>
    new Promise((resolve, reject) => {
      const sessionId = getSessionId();
      const refreshToken = getRefreshToken();

      if (!sessionId || !refreshToken) return reject();

      fetch("/api/v2/account/refresh-session", {
        method: "POST",
        body: JSON.stringify({
          ticketId,

          sessionId,
          refreshToken,
        }),
      })
        .then((data) => data.json())
        .then(({ status, data }) => {
          if (status === 410) return redirectToFallbackRedirectUrl();
          if (status === 200) {
            Cookies.set("sessionId", sessionId, {
              expires: 7,
              sameSite: "strict",
              secure: true,
            });
            Cookies.set("refreshToken", data.refreshToken, {
              expires: 7,
              sameSite: "strict",
              secure: true,
            });
            if (data.redirectUrl) setFallbackRedirectUrl(data.redirectUrl);
            else
              Cookies.set("token", data.token, {
                expires: 1,
                sameSite: "strict",
                secure: true,
              });
            return resolve(data);
          }
          clearSessionCookies();
          reject({ status });
        })
        .catch(() => reject({ status: 600 }));
    });

  const register = (
    email: string,
    username: string,
    password: string,
    rePassword: string,
    captchaId: string,
  ) =>
    new Promise<void>((resolve, reject) => {
      fetch("/api/v2/account/register", {
        method: "POST",
        body: JSON.stringify({
          email,
          username,
          password,
          rePassword,
          captchaId,
        }),
      })
        .then((data) => data.json())
        .then(({ status }) => (status === 200 ? resolve() : reject({ status })))
        .catch(() => reject({ status: 600 }));
    });

  const logout = () =>
    new Promise((resolve) => {
      const sessionId = getSessionId();
      const refreshToken = getRefreshToken();

      clearSessionCookies();

      if (!sessionId || !refreshToken) return resolve({});

      fetch("/api/v2/account/logout", {
        method: "POST",
        body: JSON.stringify({
          sessionId,
          refreshToken,
        }),
      })
        .then((data) => data.json())
        .then(resolve)
        .catch(resolve);
    });

  const verify = (id: string, token: string) =>
    new Promise<void>((resolve, reject) => {
      if (!id || !token) return reject({ status: 700 });

      fetch(`/api/v2/account/verify?id=${id}&token=${token}`)
        .then((data) => data.json())
        .then(({ status }) => (status === 200 ? resolve() : reject({ status })))
        .catch(() => reject({ status: 600 }));
    });

  const getVersion = () => fetch(`/api/v2/version`).then((data) => data.json());

  return {
    getSessionId,
    getRefreshToken,
    getToken,
    getTicketId,

    login,
    refreshSession,
    register,
    logout,
    clearSessionCookies,
    verify,

    getVersion,
  };
};
