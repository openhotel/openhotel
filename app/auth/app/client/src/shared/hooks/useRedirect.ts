export const useRedirect = () => {
  const set = (redirectUrl: string) => {
    localStorage.setItem("lastRedirect", redirectUrl);
  };
  const navigate = () => {
    window.location.replace(localStorage.getItem("lastRedirect"));
  };

  return {
    set,
    navigate,
  };
};
