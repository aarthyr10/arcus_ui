import { useNavigate } from "react-router-dom";
import logo from "../../../public/Images/daikin.png"

const Logo = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className="fixed p-5" onClick={() => navigate("/")}>
                <img src={logo} alt="Daikin logo" className="h-10 w-35"  />
            </div>
        </>
    )
}

export default Logo;