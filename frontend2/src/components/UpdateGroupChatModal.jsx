import { RxCross1 } from "react-icons/rx";
import { useChat } from "../Context/chatContext";
import axios from "axios";
import { useRef, useState } from "react";
import { useAlert } from "../Context/alertContext";
import Loader from "./Loader";
import UserList from "./UserList";

const UpdateGroupChatModal = ({
  fetchAgain,
  setFetchAgain,
  setShowUpdateGroup,
}) => {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [updatedChatName, setUpdatedChatName] = useState("");
  const { user, selectedChat, setSelectedChat } = useChat();
  const { setAlert } = useAlert();
  const controller = useRef(null);

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) return;

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      if (controller.current) controller.current.abort();
      controller.current = new AbortController();
      const { data } = await axios.get(`api/users/?search=${query}`, {
        signal: controller.current.signal,
        ...config,
      });
      setSearchResult(data);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled:", error.message);
      } else {
        setAlert({
          open: true,
          message: error.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (user1) => {
    if (!user1._id || !selectedChat._id) return;

    if (selectedChat.users.find((u) => u._id === user1._id)) {
      setAlert({
        open: true,
        message: "User already added",
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      setAlert({
        open: true,
        message: "Only admin can add user",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "api/chat/group/add",
        { chatId: selectedChat._id, userId: user1._id },
        config
      );
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setSearch("");
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
      });
    }
  };

  const handleRemoveUser = async (userId) => {
    if (!userId || !selectedChat._id) return;

    if (selectedChat.groupAdmin._id !== user._id && userId !== user._id) {
      setAlert({
        open: true,
        message: "Only admin can remove user",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "api/chat/group/remove",
        { chatId: selectedChat._id, userId },
        config
      );
      userId === user._id ? setSelectedChat(null) : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setSearch("");
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
      });
    }
    setUpdatedChatName("");
  };
  const updateGroupName = async () => {
    if (!updatedChatName) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/group/rename",
        { chatId: selectedChat._id, chatName: updatedChatName },
        config
      );
      setSelectedChat(data);
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
      });
    }
    setUpdatedChatName("");
  };
  return (
    <div
      className={`fixed
      top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-10 flex justify-center items-center`}
    >
      <div className="relative w-[450px] bg-white flex flex-col items-center p-4 rounded">
        <RxCross1
          className="absolute top-3 right-3 text-xl cursor-pointer"
          onClick={() => setShowUpdateGroup(false)}
        />
        <span className="text-[35px] capitalize mb-3 text-gray-600">
          {selectedChat.chatName}
        </span>
        <div className="flex gap-1 flex-wrap mb-3">
          {selectedChat.users.map((u) => {
            return (
              <div
                key={u._id}
                className="flex items-center gap-2 px-2 py-1 bg-indigo-600 text-white rounded-lg"
              >
                <span key={u._id} className="text-sm">
                  {u.name}
                </span>
                <RxCross1
                  className="text-[12px] mt-1 cursor-pointer"
                  onClick={() => handleRemoveUser(u._id)}
                />
              </div>
            );
          })}
        </div>
        <div className="w-full flex gap-1 mb-2">
          <input
            type="text"
            placeholder="Chat Name"
            value={updatedChatName}
            onChange={(e) => setUpdatedChatName(e.target.value)}
            className="grow px-2 py-1 outline-none rounded-lg border border-gray-200"
          />
          <button
            className="relative px-3 py-1 inline-flex items-center justify-start rounded overflow-hidden self-end group"
            onClick={updateGroupName}
          >
            <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
            <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-teal-600 opacity-100 group-hover:-translate-x-8"></span>
            <span className="relative w-full text-left text-black transition-colors duration-200 ease-in-out group-hover:text-white">
              Update
            </span>
            <span className="gap-5 absolute inset-0 border-2 border-teal-600 rounded"></span>
          </button>
        </div>
        <input
          type="text"
          placeholder="Add User"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full mb-3 px-2 py-1 outline-none rounded-lg border border-gray-200"
        />
        {loading ? (
          <Loader />
        ) : (
          <ul className="w-full flex flex-col items-center gap-2">
            {searchResult.map((u) => {
              return (
                <UserList
                  key={u._id}
                  user={u}
                  handleFunction={() => handleAddUser(u)}
                />
              );
            })}
          </ul>
        )}
        <button
          className="relative px-4 py-1 inline-flex items-center justify-start rounded overflow-hidden self-end group"
          onClick={() => handleRemoveUser(user._id)}
        >
          <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
          <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-red-600 opacity-100 group-hover:-translate-x-8"></span>
          <span className="relative w-full text-left text-black transition-colors duration-200 ease-in-out group-hover:text-white">
            Leave Group
          </span>
          <span className="gap-5 absolute inset-0 border-2 border-red-600 rounded"></span>
        </button>
      </div>
    </div>
  );
};

export default UpdateGroupChatModal;
