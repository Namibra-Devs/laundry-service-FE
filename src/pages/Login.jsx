import { useState } from "react";
import Logo from "../assets/images/logo.png";
import { LucideEyeClosed, LucideEye } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthenticateUser } from "@/lib/utils/auth";
import useAuth from "@/hooks/useAuth";

const Login = () => {
  const { setAuth } = useAuth();
  const [inputState, setInputState] = useState("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = location?.state?.from?.pathname;

  const Login = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    const { data, loading, message } = await AuthenticateUser(email, password);
    setMessage(message);
    setLoading(loading);

    if (!data) {
      return;
    } else {
      const accessToken = data?.data?.token;
      const user = data?.data?.user;
      setAuth((prev) => ({ ...prev, user, accessToken }));

      if (user?.role === "admin") {
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

        {message && (
          <p
            className={`bg-danger text-white px-5 py-3 rounded-md text-center`}
          >
            {message}
          </p>
        )}

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
          <label htmlFor="password" className="text-xl">
            Password
          </label>
          <div className="flex items-center space-x-5">
            <input
              type={inputState === "text" ? "text" : "password"}
              id="password"
              name="password"
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

        {loading ? (
          <p
            type="submit"
            className="bg-gray-200 text-dark w-full py-3 rounded-md text-center capitalize mt-10 active:scale-105 transition-all duration-300 cursor-wait"
          >
            Logging in ...
          </p>
        ) : (
          <button
            type="submit"
            className="bg-custom_yellow text-dark w-full py-3 rounded-md text-center capitalize mt-10 active:scale-105 transition-all duration-300"
          >
            Login
          </button>
        )}
      </form>
    </div>
  );
};
export default Login;
