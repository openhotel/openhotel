export const getBase64FromBody = async (body: Body): Promise<string> => {
  const reader = new FileReader();
  reader.readAsDataURL(await body.blob());
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
  });
};
