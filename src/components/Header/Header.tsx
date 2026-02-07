// import Logo from "../logo/Logo"
// import HamburgerMenu from "../menu/HamburgerMenu"


// const Header = () => {
//     return (
//         <>
//             <div className="flex justify-between p-3">
//                 <HamburgerMenu />
//                 <Logo />
//             </div>
//         </>
//     )
// }

// export default Header

import Logo from "../logo/Logo";
import HamburgerMenu from "../menu/HamburgerMenu";

const Header = () => {
  return (
    <header
      className="
      fixed top-0 left-0 w-full z-50
      backdrop-blur-md h-[11vh] md:h-[9vh] lg:h-[80px]
    "
    >
      <div className="w-full mx-auto flex justify-between items-center px-4 py-4 mt-2 sm:mt-1">
        <Logo />
        <HamburgerMenu />
      </div>
    </header>
  );
};

export default Header;

