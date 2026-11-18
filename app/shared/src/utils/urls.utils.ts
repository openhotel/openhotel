export const getURL = (url: string): URL => {
  if (!url.startsWith("http")) url += `http://${url}`;
  return new URL(url);
};
