import { useNavigate } from "react-router-dom";
import logo from "../../public/Images/daikin.png";

const Start = () => {
  const navigate = useNavigate();

  return (
<div className="h-screen w-full bg-[#eaf6fb] flex flex-col">

      <div className="absolute top-10 left-10">
        <img src={logo} alt="Daikin logo" className="h-7" />
      </div>

      <div className="h-full flex items-center justify-center px-4">

        <div
          className="
           max-w-2xl w-150 h-100
             bg-[#f3fbff]
            rounded-3xl
            shadow-[0_20px_40px_rgba(0,0,0,0.15)]
            p-8 sm:p-10 lg:p-12
            text-center
          "
        >
          {/* ICON */}
          <div className="flex justify-center">
            <div className="
              w-20 h-20
              rounded-full
              bg-gradient-to-br from-[#2f80ff] to-[#12c2e9]
              flex items-center justify-center
              shadow-lg
            ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 3l7 4v5c0 5-3.5 9-7 9s-7-4-7-9V7l7-4z"
                />
              </svg>
            </div>
          </div>

          {/* TITLE */}
          <h1 className="text-3xl font-bold text-gray-800 mb-1 mt-2.5">
            Smart
          </h1>

          <h2 className="
            text-3xl font-bold
            bg-gradient-to-r from-[#2f80ff] to-[#12c2e9]
            bg-clip-text text-transparent
            mb-8
          ">
            Compliance Assistant
          </h2>

          {/* BUTTON */}
          <button
            onClick={() => navigate("/compliance")}
            className="
              px-8 py-4
              rounded-full
              bg-gradient-to-r from-[#2f80ff] to-[#12c2e9]
              text-white
              font-medium
              shadow-[0_10px_25px_rgba(47,128,255,0.4)]
              hover:scale-105
              transition
              flex items-center justify-center gap-3
              mx-auto cursor-pointer mt-15
            "
          >
            Start Compliance Check <span className="text-xl">→</span>
          </button>
        </div>

      </div>
    <footer className="w-full">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-center items-center text-xs text-gray-500 gap-2">
          <a href="#" className="hover:text-gray-700 transition">Terms & conditions</a>
          <span>|</span>
          <a href="#" className="hover:text-gray-700 transition">Privacy Policy</a>
          <span>|</span>
          <span>Copyright</span>
        </div>
      </div>
    </footer>
    </div>
  );
};

export default Start;