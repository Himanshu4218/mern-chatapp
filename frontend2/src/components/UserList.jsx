import React from "react";

const UserList = ({ user, handleFunction }) => {
  return (
    <div
      className="flex gap-2 items-center w-full p-2 bg-teal-100 rounded-lg cursor-pointer hover:bg-teal-600 hover:text-white"
      onClick={() => handleFunction(user._id)}
    >
      <div className="h-7 w-7 rounded-full object-cover object-center overflow-hidden">
        <img src={user.pic} alt={user.email} />
      </div>
      <div className="flex flex-col">
        <span className="text-[15px]">{user.name}</span>
        <span className="text-sm">Email: {user.email}</span>
      </div>
    </div>
  );
};

export default UserList;
