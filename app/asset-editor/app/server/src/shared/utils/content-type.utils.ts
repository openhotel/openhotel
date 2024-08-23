export const getContentType = (targetFile: string): string => {
  let contentType = "text/plain";
  if (targetFile.endsWith(".js")) {
    contentType = "application/javascript";
  } else if (targetFile.endsWith(".css")) {
    contentType = "text/css";
  } else if (targetFile.endsWith(".html")) {
    contentType = "text/html";
  } else if (targetFile.endsWith(".json")) {
    contentType = "application/json";
  } else if (targetFile.endsWith(".png")) {
    contentType = "image/png";
  } else if (targetFile.endsWith(".yml")) {
    contentType = "text/yaml";
  }
  return contentType;
};
