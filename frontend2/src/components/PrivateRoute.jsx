import { Navigate, Outlet } from "react-router-dom";
import { useChat } from "../Context/chatContext";
const PrivateRoute = () => {
  const { user } = useChat();
  return <>{user ? <Outlet /> : <Navigate to={"/"} />}</>;
};

export default PrivateRoute;
