import { decodeToken } from "./decodeToken";

export const isTokenValid = (token) => {
  const userData = decodeToken(token);
  if (!userData || Date.now() / 1000 > userData.exp) {
    return false;
  }
  return true;
};
