import { RxCross1 } from "react-icons/rx";

const ProfileModal = ({ user, setShowModal }) => {
  return (
    <div
      className={`fixed
      top-0 left-0 w-full h-screen bg-black bg-opacity-50 z-10 flex justify-center items-center`}
    >
      <div className="relative w-[420px] h-[420px] bg-white flex flex-col items-center rounded">
        <RxCross1
          className="absolute top-3 right-3 text-xl cursor-pointer"
          onClick={() => setShowModal(false)}
        />
        <span className="text-[35px] capitalize my-5 text-gray-600">
          {user.name}
        </span>
        <img
          src={user.pic}
          alt={user.email}
          className="w-[50%] h-[50%] rounded-[50%] object-center object-cover"
        />
        <span className="text-[30px] capitalize my-4 text-gray-400">
          {user.email}
        </span>
        <button
          className="relative px-7 py-1 mb-2 mr-2 inline-flex items-center justify-start rounded overflow-hidden self-end group"
          onClick={() => setShowModal(false)}
        >
          <span className="w-32 h-32 rotate-45 translate-x-12 -translate-y-2 absolute left-0 top-0 bg-white opacity-[3%]"></span>
          <span className="absolute top-0 left-0 w-48 h-48 -mt-1 transition-all duration-500 ease-in-out rotate-45 -translate-x-56 -translate-y-24 bg-blue-600 opacity-100 group-hover:-translate-x-8"></span>
          <span className="relative w-full text-left text-black transition-colors duration-200 ease-in-out group-hover:text-white">
            Close
          </span>
          <span className="gap-5 absolute inset-0 border-2 border-blue-600 rounded"></span>
        </button>
      </div>
    </div>
  );
};

export default ProfileModal;
