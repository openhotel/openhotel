const HEADERS = [
  ["Access-Control-Allow-Origin", "*"],
  ["Access-Control-Allow-Methods", "GET, POST, PUT", "DELETE"],
  [
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  ],
  ["Access-Control-Allow-Credentials", "true"],
];

export const getCORSHeaders = (): Headers => {
  const headers = new Headers();
  for (const [key, value] of HEADERS) headers.append(key, value);
  return headers;
};
1;
export const appendCORSHeaders = (headers: Headers) => {
  for (const [key, value] of HEADERS) headers.append(key, value);
};
