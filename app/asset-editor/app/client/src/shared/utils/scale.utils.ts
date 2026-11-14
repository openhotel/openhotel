export const getScale = () =>
  localStorage.getItem("scale") === null
    ? 6
    : parseInt(localStorage.getItem("scale"));

export const setScale = (scale: number) =>
  localStorage.setItem("scale", `${scale}`);
