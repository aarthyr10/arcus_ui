import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { LuBookOpen } from "react-icons/lu";
import { BsFileText } from "react-icons/bs";
import { HiOutlineChatBubbleLeft } from "react-icons/hi2";
import { IoSearch } from "react-icons/io5";
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
      {/* overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40"
      />

      {/* modal */}
      <div
        className="
          fixed z-50
          top-18 sm:top-18
          right-7 sm:right-6 md:right-25 lg:right-25
          w-[50vw] sm:w-64
          max-w-xs
          bg-[#eaf7fb]
          rounded-2xl
          shadow-2xl
          p-3 sm:p-4
          animate-in fade-in slide-in-from-top-2 duration-200
        "
      >
        {menuItem("Compliance Form", "/compliance", <BsFileText />)}
        {menuItem("Knowledge base", "/knowledge", <LuBookOpen />)}
        {menuItem("Smart Assistant", "/assistant", <HiOutlineChatBubbleLeft />)}
        {menuItem("Search Docs", "/searchdocs", <IoSearch />)}

        <hr className="my-3 border-gray-300" />

        <button
          onClick={() => navigate("/")}
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
