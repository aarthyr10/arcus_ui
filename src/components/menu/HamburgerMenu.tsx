import { useState } from "react";
import SideMenuModal from "./SideMenuModal";

const HamburgerMenu = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        title="Menu"
        className="
          w-11 h-11 fixed top-6 right-10 sm:right-12  rounded-xl
          bg-[#eef6f8]
          flex items-center justify-center
          hover:scale-105 transition cursor-pointer
        "
      >
        <div className="relative w-6 h-6 flex items-center justify-center">

          <span
            className={`
              absolute w-6 h-0.5 bg-gray-800
              transition-all duration-300
              ${open ? "rotate-45" : "-translate-y-2"}
            `}
          />

          <span
            className={`
              absolute w-6 h-0.5 bg-gray-800
              transition-all duration-300
              ${open ? "opacity-0 scale-0" : ""}
            `}
          />

          <span
            className={`
              absolute w-6 h-0.5 bg-gray-800
              transition-all duration-300
              ${open ? "-rotate-45" : "translate-y-2"}
            `}
          />
        </div>
      </button>

      {open && <SideMenuModal onClose={() => setOpen(false)} />}
    </>
  );
};

export default HamburgerMenu;
