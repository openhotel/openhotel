export const getBase64FromBody = async (body: Response): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    if (body.status !== 200) return reject();
    const reader = new FileReader();
    reader.readAsDataURL(await body.blob());
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
  });
};
