// import { useNavigate } from "react-router-dom";
// import logo from "../../../Images/daikin.png"

// const Logo = () => {
//     const navigate = useNavigate();
//     return (
//         <>
//             <div className="fixed p-5" onClick={() => navigate("/")}>
//                 <img src={logo} alt="Daikin logo" className="h-10 w-35"  />
//             </div>
//         </>
//     )
// }

// export default Logo;

import { useNavigate } from "react-router-dom";
import logo from "../../../Images/daikin.png";

const Logo = () => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate("/")}
      className="cursor-pointer"
      title="Go home"
    >
      <img src={logo} alt="Daikin logo" className="h-10 w-35 fixed top-7 left-6 sm:left-15" />
    </div>
  );
};

export default Logo;
