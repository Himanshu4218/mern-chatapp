import { IoEye } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";
import { useChat } from "../Context/chatContext";
import { useEffect, useRef, useState } from "react";
import { getSender, getSenderFull } from "../utils/getSender";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import { useAlert } from "../Context/alertContext";
import axios from "axios";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;
let timerId;

const Chatbox = ({
  fetchAgain,
  setFetchAgain,
  fetchNotificationAgain,
  setFetchNotificationAgain,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const [showUpdateGroup, setShowUpdateGroup] = useState(false);
  const { selectedChat, user, setSelectedChat } = useChat();
  const { setAlert } = useAlert();

  const handleKeyDown = async (e) => {
    if (e.keyCode === 13 && message) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.post(
          "/api/message",
          { chatId: selectedChat._id, content: message },
          config
        );
        setMessage("");
        setMessages([...messages, data]);
        setFetchAgain(!fetchAgain);
        socket.emit("new message", data);
      } catch (error) {
        setAlert({
          open: true,
          message: error.message,
        });
      }
    }
  };

  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (timerId) clearTimeout(timerId);

        timerId = setTimeout(async () => {
          const config = {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };
          await axios.post(
            "/api/notification",
            {
              userId: newMessageRecieved.sender._id,
              chatId: newMessageRecieved.chat._id,
            },
            config
          );
          setFetchAgain(!fetchAgain);
          setFetchNotificationAgain(!fetchNotificationAgain);
        }, 500);
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  const handleTyping = (e) => {
    setMessage(e.target.value);
    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let last = new Date().getTime();
    const timer = 2000;

    setTimeout(() => {
      let now = new Date().getTime();
      let diff = now - last;
      if (diff >= timer && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timer);
  };
  return (
    <div
      className={`w-[100%] md:w-[70%] bg-white rounded ${
        selectedChat ? "flex" : "hidden"
      } md:flex flex-col gap-2 px-5 py-3`}
    >
      {!selectedChat ? (
        <div className="w-full h-full flex justify-center items-center text-3xl text-gray-400">
          Click on a user to start chatting
        </div>
      ) : (
        <>
          <div className="flex justify-between">
            <div
              className="md:hidden bg-gray-200 hover:bg-gray-500 cursor-pointer rounded p-2.5"
              onClick={() => setSelectedChat(null)}
            >
              <FaArrowLeft />
            </div>
            <h1 className="text-3xl font-light text-gray-600">
              {selectedChat?.isGroupChat
                ? selectedChat.chatName
                : getSender(user, selectedChat.users)}
            </h1>
            <div
              className="relative cursor-pointer rounded overflow-hidden group p-2.5"
              onClick={
                selectedChat.isGroupChat
                  ? () => setShowUpdateGroup(true)
                  : () => setShowModal(true)
              }
            >
              <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
              <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-teal-500 opacity-100 group-hover:-translate-x-8"></span>
              <span className="flex gap-2 items-center relative w-full text-left text-black transition-colors duration-200 ease-in-out group-hover:text-white">
                <IoEye className="text-lg" />
              </span>
            </div>
          </div>
          <div className="w-full grow bg-custom-150 rounded-lg flex flex-col justify-end p-2">
            <div
              className="flex flex-col grow h-[436px] overflow-y-auto my-2 gap-1 p-2"
              ref={messagesEndRef}
            >
              {messages.map((msg, i) => {
                return msg.sender._id === user._id ? (
                  <span
                    key={msg._id}
                    className="p-2 bg-pink-200 rounded-lg self-end"
                  >
                    {msg.content}
                  </span>
                ) : (
                  <span
                    key={msg._id}
                    className=" flex gap-1 p-2 bg-amber-200 rounded-lg self-start"
                  >
                    {(messages[i - 1]?.sender._id === user._id ||
                      messages[i].sender._id !== messages[i - 1]?.sender._id ||
                      i === 0) && (
                      <img
                        src={msg.sender.pic}
                        alt={msg.sender.name}
                        className="w-5 rounded-full"
                      />
                    )}
                    <span>{msg.content}</span>
                  </span>
                );
              })}
              {isTyping && (
                <span className="p-2 mb-1 bg-pink-200 rounded-lg self-start animate-pulse">
                  ...
                </span>
              )}
            </div>
            <input
              type="text"
              placeholder="Enter a message"
              value={message}
              onChange={(e) => handleTyping(e)}
              onKeyDown={handleKeyDown}
              className="w-full bg-gray-200 rounded p-2 outline-none focus:ring ring-indigo-500 ring-offset-1
            "
            />
          </div>{" "}
        </>
      )}
      {showModal && (
        <ProfileModal
          user={getSenderFull(user, selectedChat.users)}
          setShowModal={setShowModal}
        />
      )}
      {showUpdateGroup && (
        <UpdateGroupChatModal
          fetchAgain={fetchAgain}
          setFetchAgain={setFetchAgain}
          setShowUpdateGroup={setShowUpdateGroup}
        />
      )}
    </div>
  );
};

export default Chatbox;
