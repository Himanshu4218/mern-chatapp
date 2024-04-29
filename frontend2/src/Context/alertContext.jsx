import { createContext, useContext, useState } from "react";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

function AlertProvider({ children }) {
  const [alert, setAlert] = useState({
    open: false,
    message: "",
  });
  return (
    <AlertContext.Provider value={{ alert, setAlert }}>
      {children}
    </AlertContext.Provider>
  );
}

export default AlertProvider;
