import { RxCross1 } from "react-icons/rx";
import { useChat } from "../Context/chatContext";
import { useRef, useState } from "react";
import axios from "axios";
import { useAlert } from "../Context/alertContext";
import Loader from "./Loader";
import UserList from "./UserList";

const GroupChatModal = ({ setShowModal }) => {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUser, setSelectedUser] = useState([]);
  const { setAlert } = useAlert();
  const { user, chats, setChats } = useChat();
  const controller = useRef(null);
  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
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
      if (controller.current) controller.current.abort();
      controller.current = new AbortController();
      const { data } = await axios.get(`api/users/?search=${query}`, {
        signal: controller.current.signal,
        ...config,
      });
      setLoading(false);
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
    }
  };

  const handleDelete = (id) => {
    setSelectedUser(selectedUser.filter((user) => user._id !== id));
  };

  const handleSelectedUser = (u) => {
    if (selectedUser.includes(u)) return;
    setSelectedUser([...selectedUser, u]);
  };
  const handleSubmit = async () => {
    if (!groupName || !selectedUser.length) {
      setAlert({
        open: true,
        message: "Please Fill all the fields",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupName,
          users: JSON.stringify(selectedUser.map((u) => u._id)),
        },
        config
      );
      setAlert({
        open: true,
        message: "New Group Created",
      });
      setChats([...chats, data]);
      setSearch("");
      setSelectedUser([]);
      setGroupName("");
      setShowModal(false);
    } catch (error) {
      setAlert({
        open: true,
        message: error.message,
      });
    }
  };
  return (
    <div
      className={`fixed
      top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-10 flex justify-center items-center`}
    >
      <div className="relative w-[450px] bg-white flex flex-col items-center p-4 rounded">
        <RxCross1
          className="absolute top-3 right-3 text-xl cursor-pointer"
          onClick={() => setShowModal(false)}
        />
        <span className="text-[35px] capitalize mb-3 text-gray-600">
          Create Group Chat
        </span>
        <input
          type="text"
          className="w-full outline-none h-8 p-2 my-2 border border-gray-200 rounded"
          placeholder="Chat Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <input
          type="text"
          className="w-full outline-none h-8 p-2 mb-4 border border-gray-200 rounded"
          placeholder="Add User"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <div className="flex gap-1 flex-wrap mb-1">
          {selectedUser.map((u) => {
            return (
              <div
                key={u._id}
                className="flex items-center gap-2 px-2 py-1 bg-teal-600 text-white rounded-full"
              >
                <span key={u._id} className="text-sm">
                  {u.name}
                </span>
                <RxCross1
                  className="text-[12px] mt-1 cursor-pointer"
                  onClick={() => handleDelete(u._id)}
                />
              </div>
            );
          })}
        </div>
        {loading ? (
          <Loader />
        ) : (
          <ul className="w-full flex flex-col items-center gap-2">
            {searchResult.map((u) => {
              return (
                <UserList
                  key={u._id}
                  user={u}
                  handleFunction={() => handleSelectedUser(u)}
                />
              );
            })}
          </ul>
        )}
        <button
          className="relative px-4 py-1 inline-flex items-center justify-start rounded overflow-hidden self-end group"
          onClick={handleSubmit}
        >
          <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
          <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-blue-600 opacity-100 group-hover:-translate-x-8"></span>
          <span className="relative w-full text-left text-black transition-colors duration-200 ease-in-out group-hover:text-white">
            Create Chat
          </span>
          <span className="gap-5 absolute inset-0 border-2 border-blue-600 rounded"></span>
        </button>
      </div>
    </div>
  );
};

export default GroupChatModal;
