import QRCode from "qrcode";

export const useQR = () => {
  const getQR = (uri: string): Promise<string> =>
    new Promise<string>((resolve) => {
      QRCode.toDataURL(uri, { errorCorrectionLevel: "L" }, (err, url) =>
        resolve(url),
      );
    });

  return {
    getQR,
  };
};
