export const decodeToken = (token) => {
  if (!token) return null;

  try {
    const payloadBase64 = token.split(".")[1];
    const decodedPayload = atob(payloadBase64);
    const userData = JSON.parse(decodedPayload);

    return userData;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};
