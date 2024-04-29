const ToolTip = ({ handleProfile, handleLogout }) => {
  return (
    <div className="absolute flex flex-col gap-2 -bottom-[85px] -left-[150px] w-[200px] bg-white border-2 border-gray-300 shadow-xl rounded py-1 transition-all z-10">
      <span className="px-2 py-1 hover:bg-gray-300" onClick={handleProfile}>
        My Profile
      </span>
      <span className="px-2 py-1 hover:bg-gray-300" onClick={handleLogout}>
        Logout
      </span>
    </div>
  );
};

export default ToolTip;
