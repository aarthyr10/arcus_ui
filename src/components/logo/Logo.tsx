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
      <img src={logo} alt="Daikin logo" className="h-10 w-35 fixed top-7 left-6 sm:left-12" />
    </div>
  );
};

export default Logo;
