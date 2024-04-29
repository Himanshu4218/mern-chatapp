import React, { useEffect, useState } from "react";
import axios from "axios";
import { useChat } from "../Context/chatContext";
import { useAlert } from "../Context/alertContext";
import { getSender } from "../utils/getSender";
import GroupChatModal from "./GroupChatModel";
import Loader from "./Loader";

const MyChats = ({
  fetchAgain,
  fetchNotificationAgain,
  setFetchNotificationAgain,
}) => {
  const [showGroupModal, setShowGroupModal] = useState(false);
  const { setAlert } = useAlert();
  const { user, chats, setChats, selectedChat, setSelectedChat } = useChat();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
      });
    }
  };

  const handleSelectedChat = async (chat) => {
    setSelectedChat(chat);
    try {
      await axios.delete("/api/notification/remove", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        data: { chatId: chat._id },
      });
      setFetchNotificationAgain(!fetchNotificationAgain);
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
      });
    }
  };

  useEffect(() => {
    fetchChats();
  }, [fetchAgain]);
  return (
    <div
      className={`md:w-[30%] w-[100%] ${
        selectedChat ? "hidden" : "block"
      } md:block bg-white rounded`}
    >
      <div className="flex justify-between px-5 py-3 mb-3">
        <h1 className="text-3xl font-light">My Chats</h1>
        <span
          className="relative z-10 inline-flex items-center justify-start rounded cursor-pointer px-2 overflow-hidden group"
          onClick={() => setShowGroupModal(true)}
        >
          <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
          <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-teal-500 opacity-100 group-hover:-translate-x-8"></span>
          <span className="flex gap-2 items-center relative w-full text-left text-black transition-colors duration-200 ease-in-out group-hover:text-white">
            New Group Chat +
          </span>
        </span>
      </div>
      <div className="flex flex-col gap-2 py-2 px-6">
        {chats ? (
          chats.map((chat) => {
            return (
              <span
                key={chat._id}
                className={`hover:bg-teal-500 hover:text-white transition-all duration-100 ${
                  selectedChat == chat
                    ? "bg-teal-500 text-white"
                    : "bg-teal-100"
                } rounded-lg cursor-pointer py-4 px-3`}
                onClick={() => handleSelectedChat(chat)}
              >
                {!chat.isGroupChat
                  ? getSender(user, chat.users)
                  : chat.chatName}
              </span>
            );
          })
        ) : (
          <Loader />
        )}
      </div>
      {showGroupModal && <GroupChatModal setShowModal={setShowGroupModal} />}
    </div>
  );
};

export default MyChats;
