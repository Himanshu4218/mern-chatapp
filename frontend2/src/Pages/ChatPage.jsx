import { Suspense, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import MyChats from "../components/MyChats";
import Sidebar from "../components/Sidebar";
import { useChat } from "../Context/chatContext";
import { ErrorBoundary } from "react-error-boundary";
import Chatbox from "../components/Chatbox";
import Loader from "../components/Loader";
import ErrorFallback from "../components/ErrorBoundary";
import axios from "axios";
import { useAlert } from "../Context/alertContext";

const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const [fetchNotificationAgain, setFetchNotificationAgain] = useState(false);
  const { user, setNotification, setSelectedChat } = useChat();
  const { setAlert } = useAlert();

  const handleReset = () => {
    setFetchAgain(!fetchAgain);
    setSelectedChat(null);
  };

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get("/api/notification/all", config);
        setNotification(data);
      } catch (error) {
        setAlert({
          open: true,
          message: error.message,
        });
      }
    };
    fetchNotification();
  }, [fetchNotificationAgain]);
  return (
    <>
      <Helmet>
        <title>My Chats</title>
      </Helmet>
      {user && (
        <Sidebar
          fetchNotificationAgain={fetchNotificationAgain}
          setFetchNotificationAgain={setFetchNotificationAgain}
        />
      )}
      <div className="flex grow justify-between w-full p-3 gap-3">
        {user && (
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={handleReset}
          >
            <Suspense fallback={<Loader />}>
              <MyChats
                fetchAgain={fetchAgain}
                fetchNotificationAgain={fetchNotificationAgain}
                setFetchNotificationAgain={setFetchNotificationAgain}
              />
            </Suspense>
          </ErrorBoundary>
        )}
        {user && (
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={handleReset}
          >
            <Suspense fallback={<Loader />}>
              <Chatbox
                fetchAgain={fetchAgain}
                setFetchAgain={setFetchAgain}
                fetchNotificationAgain={fetchNotificationAgain}
                setFetchNotificationAgain={setFetchNotificationAgain}
              />
            </Suspense>
          </ErrorBoundary>
        )}
      </div>
    </>
  );
};

export default ChatPage;
