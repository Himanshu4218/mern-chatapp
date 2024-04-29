import { useState } from "react";
import axios from "axios";
import { IoIosNotifications } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { useChat } from "../Context/chatContext";
import { useAlert } from "../Context/alertContext";
import ProfileModal from "../components/ProfileModal";
import { useNavigate } from "react-router-dom";
import ToolTip from "./ToolTip";
import UserList from "./UserList";
import Loader from "./Loader";

const Sidebar = ({ fetchNotificationAgain, setFetchNotificationAgain }) => {
  const [show, setShow] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const navigate = useNavigate();
  const { setAlert } = useAlert();
  const { user, setSelectedChat, notification } = useChat();

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setSelectedChat(null);
    navigate("/");
  };

  const handleProfile = () => {
    setShowModal(true);
  };

  const createChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);
      setSelectedChat(data);
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
      });
    } finally {
      setLoadingChat(false);
      setShowSidebar(false);
      setSearch("");
    }
  };

  const handleRemoveNotification = async (not) => {
    setShowNotif(false);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      await axios.delete("/api/notification/remove", {
        headers: config.headers,
        data: { chatId: not.to._id },
      });
      setFetchNotificationAgain(!fetchNotificationAgain);
      setSelectedChat(not.to);
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
      });
    }
  };
  const handleSearch = async () => {
    if (!search) {
      setAlert({
        open: true,
        message: "Please enter something in search box",
      });
      setSearchResult([]);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/users?search=${search}`, config);
      setSearchResult(data);
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex bg-white h-[60px] w-full justify-between items-center px-8 border-4 border-gray-300">
        <button
          className="relative px-3 py-1.5 rounded-full overflow-hidden group"
          onClick={() => setShowSidebar(true)}
        >
          <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
          <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-teal-500 opacity-100 group-hover:-translate-x-8"></span>
          <span className="flex gap-2 items-center relative w-full text-left text-black transition-colors duration-200 ease-in-out group-hover:text-white">
            <FaSearch className="text-[15px]" />
            Search User
          </span>
        </button>
        <div className="text-2xl text-gray-500">Chit-Chat-Connect</div>
        <div className="flex gap-2 items-center relative">
          {notification.length > 0 && (
            <div className="absolute top-0 left-4 w-4 h-4  bg-red-600 text-white rounded-full flex justify-center items-center text-xs">
              {notification.length}
            </div>
          )}
          <IoIosNotifications
            className="text-2xl cursor-pointer"
            onClick={() => setShowNotif((prev) => !prev)}
          />
          {showNotif && (
            <div className="absolute overflow-y-auto flex flex-col right-[88px] top-[28px] w-[200px] max-h-[85px] bg-white border-2 border-gray-300 shadow-xl rounded transition-all z-10">
              {!notification.length && (
                <span className="p-1">No New Messages</span>
              )}
              {notification.map((not) => {
                const now = new Date();
                const time = new Date(not.createdAt);
                const timeDifference = now - time;
                const seconds = Math.floor(timeDifference / 1000);
                const minutes = Math.floor(seconds / 60);
                const hours = Math.floor(minutes / 60);
                const days = Math.floor(hours / 24);
                let t;
                if (days > 0) {
                  t = `${days}d ago`;
                } else if (hours > 0) {
                  t = `${hours}h ago`;
                } else if (minutes > 0) {
                  t = `${minutes}m ago`;
                } else {
                  t = `${seconds}s ago`;
                }
                return (
                  <span
                    key={not._id}
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer border-b-[1px] border-gray-400"
                    onClick={() => handleRemoveNotification(not)}
                  >
                    <span>
                      {not.to.isGroupChat
                        ? `Message from ${not.to.chatName}`
                        : `Message from ${not.from.name}`}
                    </span>{" "}
                    <span className="text-gray-300">{t}</span>
                  </span>
                );
              })}
            </div>
          )}
          <div
            className={`tooltip relative flex items-center justify-between gap-1 ${
              show ? "bg-gray-300" : ""
            } px-2 py-1 cursor-pointer rounded-lg hover:bg-gray-200`}
            onClick={() => setShow((prev) => !prev)}
          >
            <div className="w-8 h-8 rounded-full overflow-hidden flex justify-center items-center bg-gray-300 select-none">
              <img src={user.pic} alt={user.email} />
            </div>
            <IoIosArrowDown />
            {show && (
              <ToolTip
                handleProfile={handleProfile}
                handleLogout={handleLogout}
              />
            )}
          </div>
        </div>
      </div>
      <div
        className={`${
          showSidebar ? "fixed top-0 left-0 right-0 bottom-0" : "hidden"
        } bg-black bg-opacity-50 z-30`}
        onClick={() => setShowSidebar(false)}
      ></div>
      <div
        className={`fixed top-0 left-0 z-30 h-full w-[300px] bg-white transition-all duration-300 ${
          showSidebar ? " p-5 translate-x-[0] " : "w-0 -translate-x-[300px] "
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <h1 className="text-2xl text-gray-600 mb-4">Search Chats</h1>
        <div className="flex gap-1">
          <input
            type="text"
            value={search}
            placeholder="Search Chats"
            onChange={(e) => setSearch(e.target.value)}
            className="outline-none rounded border border-gray-300 p-2"
          />
          <button
            className="relative py-2 px-3 rounded overflow-hidden group"
            onClick={handleSearch}
          >
            <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
            <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-teal-500 opacity-100 group-hover:-translate-x-8"></span>
            <span className="flex gap-2 items-center relative w-full text-left text-black transition-colors duration-200 ease-in-out group-hover:text-white">
              Go
            </span>
            <span className="gap-5 absolute inset-0 border-2 border-teal-500 rounded"></span>
          </button>
        </div>
        <ul className="w-full mt-5 flex flex-col items-center gap-3">
          {loading
            ? [...Array(12)].map((_, index) => (
                <li
                  key={index}
                  className="w-full h-9 animate-pulse bg-gray-200 rounded"
                ></li>
              ))
            : searchResult.map((user) => {
                return (
                  <UserList
                    key={user._id}
                    user={user}
                    handleFunction={createChat}
                  />
                );
              })}
          {loadingChat && <Loader />}
        </ul>
      </div>
      {showModal && <ProfileModal user={user} setShowModal={setShowModal} />}
    </>
  );
};

export default Sidebar;
