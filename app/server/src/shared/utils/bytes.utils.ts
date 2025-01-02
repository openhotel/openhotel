export const getBase64FromUint8Array = (uint8Array: Uint8Array): string => {
  let binary = "";
  for (let i = 0; i < uint8Array.length; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return btoa(binary);
};
