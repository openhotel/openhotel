export const getPathFromUrl = (url: URL): string =>
  getSearchParams(url).get("path")!;

export const getSearchParams = ({ search }: URL): URLSearchParams =>
  new URLSearchParams(search);
