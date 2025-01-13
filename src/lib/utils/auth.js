import axios from "../../api/axios";
const LoginURL = "api/auth/login";

export const AuthenticateUser = async (email, password) => {
  const result = {
    data: null,
    loading: true,
    message: "",
  };

  if (!email.trim() || !password) {
    result.message = "Please enter email and password";
    result.loading = false;
    return result;
  }

  try {
    const response = await axios.post(LoginURL, { email, password });
    result.data = response.data;
    result.message = response.data.message;
  } catch (error) {
    if (!error?.response) {
      result.message = "No server response. Check your connection";
    } else if (error?.response?.status == 400) {
      result.message = "Missing Email or Password";
    } else if (error?.response?.status == 401) {
      result.message = "Unauthorized";
    } else {
      result.message = error.response.data.message;
    }
  } finally {
    result.loading = false;
  }

  return result;
};
