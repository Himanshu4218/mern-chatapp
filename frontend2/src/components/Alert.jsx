import React, { useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { AiOutlineExclamationCircle } from "react-icons/ai";
import { useAlert } from "../Context/alertContext";

const Alert = () => {
  const { alert, setAlert } = useAlert();
  useEffect(() => {
    if (alert.open) {
      const timeoutId = setTimeout(() => {
        setAlert({ open: false, message: "" });
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [alert, setAlert]);

  return (
    <>
      {alert.open && (
        <div className="fixed left-[40px] bottom-12 min-w-[230px] h-[50px] flex justify-between items-center bg-red-500 text-white p-2 gap-2 transition-all z-50">
          <span>
            <AiOutlineExclamationCircle />
          </span>
          <span>{alert.message}</span>
          <span onClick={() => setAlert({ open: false, message: "" })}>
            <RxCross2 className="cursor-pointer" />
          </span>
        </div>
      )}
    </>
  );
};

export default Alert;
