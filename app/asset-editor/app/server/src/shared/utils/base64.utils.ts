export const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject();

    reader.readAsDataURL(blob);
  });

export const base64ToBlob = (base64Data: string): Blob => {
  const [prefix, base64String] = base64Data.split(";base64,");
  if (!base64String) {
    throw new Error("Invalid base64 data URL.");
  }

  // Extract the content type from the prefix ("data:<type>")
  const contentType = prefix.split(":")[1];

  // Decode the base64 string back to binary data
  const byteString = atob(base64String);

  // Create an array for the decoded bytes
  const byteNumbers = new Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    byteNumbers[i] = byteString.charCodeAt(i);
  }

  // Convert the byte numbers to a Uint8Array
  const byteArray = new Uint8Array(byteNumbers);

  // Create a Blob from the byte array with the extracted content type
  return new Blob([byteArray], { type: contentType });
};
