import { useState } from "react";
import Logo from "../assets/images/logo.png";
import { LucideEyeClosed, LucideEye } from "lucide-react";
import { AuthenticateUser } from "../lib/utils/login";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const [inputState, setInputState] = useState("text");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = location?.state?.from?.pathname;

  const Login = async (e) => {
    e.preventDefault();
    const response = await AuthenticateUser(email, password);
    if (response.state === "error") {
      alert(response.error);
      return;
    } else {
      setAuth(response.data);
      console.log(response.data);

      if (response?.data?.role === "admin") {
        const from = fromPath || "/dashboard";
        navigate(from, { replace: true });
      } else {
        const from = fromPath || "/dashboard/orders";
        navigate(from, { replace: true });
      }
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <form
        onSubmit={Login}
        className="w-full sm:w-[70%] lg:w-1/2 bg-white rounded-[2rem] relative text-dark p-10 sm:p-20"
      >
        <div className="w-20 h-20 bg-custom_yellow flex items-center justify-center border-[7px] border-solid border-dark rounded-[1.3rem] absolute -top-8 left-1/2 transform translate-x-[-50%]">
          <img src={Logo} alt="logo" />
        </div>

        <div className="border-b-2 border-gray-400">
          <label htmlFor="email-address" className="text-xl">
            Email
          </label>
          <input
            type="email"
            id="email-address"
            name="email-address"
            // required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="outline-none w-full p-3 text-xl"
          />
        </div>

        <div className="mt-10 border-b-2 border-gray-400">
          <label htmlFor="email-address" className="text-xl">
            Password
          </label>
          <div className="flex items-center space-x-5">
            <input
              type={inputState === "text" ? "text" : "password"}
              id="email-address"
              name="email-address"
              // required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="outline-none w-full p-3 text-xl"
            />
            <button
              type="button"
              onClick={() =>
                setInputState(inputState === "text" ? "password" : "text")
              }
              className=""
            >
              {inputState === "text" ? <LucideEye /> : <LucideEyeClosed />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="bg-custom_yellow text-dark w-full py-3 rounded-md text-center capitalize mt-10"
        >
          login
        </button>
      </form>
    </div>
  );
};
export default Login;
