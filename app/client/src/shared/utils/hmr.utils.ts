export const hmr = (hot, key, init) => {
  let value;
  if (hot) {
    // Restore from previous state if available
    value = hot.data[key] || init();

    // Save state before unloading
    hot.dispose((data) => {
      data[key] = value;
      console.debug("[HMR] Preserved System state");
    });

    // Required for HMR to work with this module
    hot.accept();
  } else {
    // Regular initialization for production
    value = init();
  }
  return value;
};
