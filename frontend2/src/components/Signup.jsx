import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../Context/alertContext";
import Loader from "./Loader";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    pic: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [picLoading, setPicLoading] = useState(false);
  const { setAlert } = useAlert();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setAlert({
        open: true,
        message: "password does not match",
      });
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post("/api/users", formData, config);
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats");
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const name = e.target.name;
    setFormData({ ...formData, [name]: e.target.value });
  };

  const handleImage = (e, img) => {
    if (!img) {
      setAlert({
        open: true,
        message: "Please Select An Image!",
      });
      return;
    }

    if (
      img.type === "image/jpg" ||
      img.type === "image/jpeg" ||
      img.type === "image/png"
    ) {
      setPicLoading(true);
      const data = new FormData();
      data.append("file", img);
      data.append("upload_preset", "chatapp");
      data.append("cloud_name", "dhfjmandp");

      fetch("https://api.cloudinary.com/v1_1/dhfjmandp/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.url.toString());
          setFormData({
            ...formData,
            [e.target.name]: data.url.toString(),
          });

          setAlert({
            open: true,
            message: "Image uploaded successfully",
          });
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      setAlert({
        open: true,
        message: "Please Select An Image!",
      });
      setPicLoading(false);
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1 mb-2">
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          className="outline-none p-1.5 border-2 border-gray-300 rounded"
          type="text"
          placeholder="Enter Your Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div className="flex flex-col gap-1 mb-2">
        <label htmlFor="email">Email Address:</label>
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
        <label htmlFor="password">Password:</label>
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
      <div className="relative flex flex-col gap-1 mb-3">
        <label htmlFor="confirmpassword">Confirm Password:</label>
        <input
          id="confirmpassword"
          className="outline-none p-1.5 border-2 border-gray-300 rounded"
          type={showPassword ? "text" : "password"}
          placeholder="Enter Your Password"
          name="confirmPassword"
          value={formData.confirmPassword}
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
      <div className="flex flex-col gap-1 mb-3">
        <label htmlFor="picture">Upload Your Picture:</label>
        <input
          id="picture"
          className="outline-none p-1.5 border-2 border-gray-300 rounded"
          type="file"
          name="pic"
          accept="image/*"
          onChange={(e) => handleImage(e, e.target.files[0])}
          placeholder="Enter Your Picture"
        />
      </div>
      <div className="flex flex-col gap-1">
        <button className="bg-sky-600 py-2 rounded text-white flex justify-center active:scale-[.98]">
          {picLoading ? <Loader /> : "Sign Up"}
        </button>
      </div>
    </form>
  );
};

export default Signup;
