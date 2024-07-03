export const getContentType = (targetFile: string): string => {
  let contentType = "text/plain";
  if (targetFile.endsWith(".js")) {
    contentType = "application/javascript";
  } else if (targetFile.endsWith(".css")) {
    contentType = "text/css";
  } else if (targetFile.endsWith(".html")) {
    contentType = "text/html";
  }
  return contentType;
};
