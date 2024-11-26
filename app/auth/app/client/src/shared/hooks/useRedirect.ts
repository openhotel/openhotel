export const useRedirect = () => {
  const set = (redirectUrl: string) => {
    localStorage.setItem("lastRedirect", redirectUrl);
  };
  const navigate = () => {
    window.location.href = localStorage.getItem("lastRedirect");
  };

  return {
    set,
    navigate,
  };
};
