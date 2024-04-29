import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";
import Login from "../components/Login";
import Signup from "../components/Signup";
import { useChat } from "../Context/chatContext";

const HomePage = () => {
  const [showLogin, setShowLogin] = useState(true);
  const navigate = useNavigate();
  const { user } = useChat();

  useEffect(() => {
    if (user) {
      navigate("/chats");
    }
  }, [user]);
  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="flex flex-col gap-4 w-1/3 mt-9 self-center">
        <h1 className="text-3xl bg-white w-full text-center rounded text-gray-500 py-3">
          Chit-Chat-Connect
        </h1>
        <div className="bg-white w-full p-3">
          <div className="grid grid-cols-2 text-center text-gray-600 mb-5">
            <div
              className={`${
                showLogin
                  ? "bg-gray-300 cursor-pointer rounded-full py-2"
                  : "cursor-pointer w-full rounded-full py-2"
              }`}
              onClick={() => setShowLogin(true)}
            >
              Login
            </div>
            <div
              className={`${
                !showLogin
                  ? "bg-gray-300 cursor-pointer rounded-full py-2"
                  : "cursor-pointer w-full rounded-full py-2"
              }`}
              onClick={() => setShowLogin(false)}
            >
              Sign Up
            </div>
          </div>
          {showLogin ? <Login /> : <Signup />}
        </div>
      </div>
    </>
  );
};

export default HomePage;
