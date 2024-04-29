import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../Context/alertContext";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { setAlert } = useAlert();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const name = e.target.name;
    setFormData({ ...formData, [name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const { data } = await axios.post("/api/users/login", formData, config);
      setAlert({
        open: true,
        message: `Welcome ${data.name}`,
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats");
    } catch (error) {
      console.error(error);
      setAlert({
        open: true,
        message: error.message,
      });
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1 mb-2">
        <label htmlFor="email">
          Email Address<sup>*</sup>
        </label>
        <input
          id="email"
          className="outline-none p-1.5 border-2 border-gray-300 rounded"
          type="email"
          placeholder="Enter Your Email Address"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="relative flex flex-col gap-1 mb-3">
        <label htmlFor="password">
          Password<sup>*</sup>
        </label>
        <input
          id="password"
          className="outline-none p-1.5 border-2 border-gray-300 rounded"
          type={showPassword ? "text" : "password"}
          placeholder="Enter Your Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
        <button
          className={`absolute right-2 bottom-2 text-gray-500 ${
            showPassword ? "line-through" : ""
          }`}
          disabled={formData.password === ""}
          onClick={() => setShowPassword((prev) => !prev)}
        >
          Show
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <button className="bg-sky-600 py-2 rounded text-white active:scale-[.98]">
          Login
        </button>
        <button
          className="bg-red-500 py-2 rounded text-white active:scale-[.98]"
          onClick={() => {
            setFormData({
              ...formData,
              email: "guest@gmail.com",
              password: "123456",
            });
          }}
        >
          Login Using Guest User Credentials
        </button>
      </div>
    </form>
  );
};

export default Login;
