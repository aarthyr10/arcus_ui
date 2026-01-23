import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { BsFileText } from "react-icons/bs";
import React from "react";

type Props = {
  onClose: () => void;
};

const SideMenuModal = ({ onClose }: Props) => {
  const navigate = useNavigate();

  const menuItem = (
    label: string,
    path: string,
    icon: React.ReactNode
  ) => (
    <button
      onClick={() => {
        navigate(path);
        onClose();
      }}
      className="
        w-full flex items-center gap-3
        px-4 py-3 rounded-lg
        text-left text-sm font-medium
        text-gray-700
        hover:bg-[#05b4e6]
        hover:text-white
        transition-colors duration-200 cursor-pointer
      "
    >
      <span className="text-lg">{icon}</span>
      {label}
    </button>
  );

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/20 z-40"
      />

      <div
        className="
          fixed top-20 right-30
          w-64
          bg-[#eaf7fb]
          rounded-2xl
          shadow-2xl
          p-4
          z-50
        "
      >
        {menuItem("Compliance Form", "/compliance", <BsFileText />)}
        {/* {menuItem("Knowledge base", "/knowledge", <LuBookOpen />)}
        {menuItem("Smart Assistant", "/assistant", <HiOutlineChatBubbleLeft />)} */}

        <hr className="my-3 border-gray-300" />

        <button
          onClick={() => alert("Logged out")}
          className="
            w-full flex items-center gap-3
            px-4 py-3 rounded-lg
            text-[#05b4e6]
            hover:bg-gray-100
            text-sm font-medium
            transition-colors cursor-pointer
          "
        >
          <span className="text-lg">
            <FiLogOut />
          </span>
          Logout
        </button>
      </div>
    </>
  );
};

export default SideMenuModal;
