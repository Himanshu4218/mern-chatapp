import Alert from "./components/Alert";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import { lazy, Suspense } from "react";
import Loader from "./components/Loader";

const HomePage = lazy(() => import("./Pages/HomePage"));
const ChatPage = lazy(() => import("./Pages/ChatPage"));

const App = () => {
  return (
    <div className="w-full min-h-screen bg-login-back bg-center bg-cover flex flex-col font-sans font-semibold">
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/" element={<PrivateRoute />}>
            <Route path="chats" element={<ChatPage />} />
          </Route>
        </Routes>
      </Suspense>
      <Alert />
    </div>
  );
};

export default App;
