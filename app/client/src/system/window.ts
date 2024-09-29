export const $window = () => {
  const load = () => {
    //push the current state to history
    window.history.pushState(null, null, window.location.href);

    //listen for the popstate event (back button)
    window.onpopstate = () => {
      window.history.pushState(null, null, window.location.href);
    };
  };

  return {
    load,
  };
};
