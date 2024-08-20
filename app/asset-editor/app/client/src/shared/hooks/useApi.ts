import Cookies from "js-cookie";
import { redirectToFallbackRedirectUrl } from "shared/utils/urls.utils";

export const useApi = () => {
  // const getTicketId = () => new URLSearchParams(location.hash).get("#ticketId");
  //
  // const clearSessionCookies = () => {
  //   Cookies.remove("sessionId");
  //   Cookies.remove("refreshToken");
  // };
  //
  // const setFallbackRedirectUrl = (redirectUrl: string) => {
  //   const { href, search } = new URL(redirectUrl);
  //   localStorage.setItem("fallbackRedirectUrl", href.replace(search, ""));
  // };
  //
  // const login = (email: string, password: string, captchaId: string) =>
  //   new Promise((resolve, reject) => {
  //     fetch("/api/v2/account/login", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         ticketId: getTicketId(),
  //
  //         email,
  //         password,
  //         captchaId,
  //       }),
  //     })
  //       .then((data) => data.json())
  //       .then(({ status, data }) => {
  //         if (status === 410) return redirectToFallbackRedirectUrl();
  //         if (status !== 200) return reject({ status });
  //         Cookies.set("sessionId", data.sessionId, {
  //           expires: 7,
  //           sameSite: "strict",
  //         });
  //         Cookies.set("refreshToken", data.refreshToken, {
  //           expires: 7,
  //           sameSite: "strict",
  //         });
  //         setFallbackRedirectUrl(data.redirectUrl);
  //         resolve(data);
  //       })
  //       .catch(() => reject({ status: 600 }));
  //   });
  //
  // const refreshSession = () =>
  //   new Promise((resolve, reject) => {
  //     const sessionId = Cookies.get("sessionId");
  //     const refreshToken = Cookies.get("refreshToken");
  //
  //     if (!sessionId || !refreshToken) return reject();
  //
  //     fetch("/api/v2/account/refresh-session", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         ticketId: getTicketId(),
  //
  //         sessionId,
  //         refreshToken,
  //       }),
  //     })
  //       .then((data) => data.json())
  //       .then(({ status, data }) => {
  //         if (status === 410) return redirectToFallbackRedirectUrl();
  //         if (status === 200) {
  //           Cookies.set("sessionId", sessionId, {
  //             expires: 7,
  //             sameSite: "strict",
  //           });
  //           Cookies.set("refreshToken", data.refreshToken, {
  //             expires: 7,
  //             sameSite: "strict",
  //           });
  //           setFallbackRedirectUrl(data.redirectUrl);
  //           return resolve(data);
  //         }
  //         clearSessionCookies();
  //         reject({ status });
  //       })
  //       .catch(() => reject({ status: 600 }));
  //   });
  //
  // const register = (
  //   email: string,
  //   username: string,
  //   password: string,
  //   rePassword: string,
  //   captchaId: string,
  // ) =>
  //   new Promise<void>((resolve, reject) => {
  //     fetch("/api/v2/account/register", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         email,
  //         username,
  //         password,
  //         rePassword,
  //         captchaId,
  //       }),
  //     })
  //       .then((data) => data.json())
  //       .then(({ status }) => (status === 200 ? resolve() : reject({ status })))
  //       .catch(() => reject({ status: 600 }));
  //   });
  //
  // const logout = () =>
  //   new Promise((resolve) => {
  //     const sessionId = Cookies.get("sessionId");
  //     const refreshToken = Cookies.get("refreshToken");
  //
  //     clearSessionCookies();
  //
  //     if (!sessionId || !refreshToken) return resolve({});
  //
  //     fetch("/api/v2/account/logout", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         sessionId,
  //         refreshToken,
  //       }),
  //     })
  //       .then((data) => data.json())
  //       .then(resolve)
  //       .catch(resolve);
  //   });
  //
  // const verify = (id: string, token: string) =>
  //   new Promise<void>((resolve, reject) => {
  //     if (!id || !token) return reject({ status: 700 });
  //
  //     fetch(`/api/v2/account/verify?id=${id}&token=${token}`)
  //       .then((data) => data.json())
  //       .then(({ status }) => (status === 200 ? resolve() : reject({ status })))
  //       .catch(() => reject({ status: 600 }));
  //   });

  return {
    // login,
    // refreshSession,
    // register,
    // logout,
    // clearSessionCookies,
    // getTicketId,
    // verify,
  };
};
