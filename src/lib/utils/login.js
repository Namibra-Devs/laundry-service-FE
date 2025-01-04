// import axios from "../../api/axios";
// const LoginURL = "/login";

export const AuthenticateUser = async (email, password) => {
  if (!email.trim() || !password) {
    return { error: "Please enter email and password", state: "error" };
  }

  // try {
  //   const response = await axios.post(LoginURL, { email, password });
  // } catch (error) {
  //   console.log("error", error);
  // }

  return { data: { email, password, role: "staff" }, state: "success" };
};

// export const LogOut = () => {
//   localStorage.removeItem("current_user");
// };
