import { useNavigate } from "react-router-dom";
import { Button } from "@mantine/core";
import logo from '../../public/Images/daikin.png';
import '../App.css'

const Start = () => {
  const navigate = useNavigate();
  const UploadDocuments = () => {
    navigate('/uploads');
  }
  return (
    <>
      <div className="p-5">
        <img src={logo} alt="Daikin logo" className="h-10 w-35" />
      </div>
<div className=" relative">
      {/* <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"> */}
      <div className="flex items-center justify-center mt-10 mb-20">

        {/* Absolute centering: positions at 50% top/left and translates back by 50% for perfect center */}
        <div
          className="
              w-full max-w-lg sm:max-w-2xl
              bg-[#f3fbff]
              rounded-3xl
              shadow-[0_20px_40px_rgba(0,0,0,0.15)]
              p-2 sm:p-8 md:p-10 lg:p-12
              text-center
            "
        >
          <div className="sm:mx-1 mx-5 ">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="
                  w-20 h-20
                  rounded-full
                  bg-gradient-to-br from-[#2f80ff] to-[#12c2e9]
                  flex items-center justify-center
                  shadow-lg
                ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-10 w-30 text-white"
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

            {/* Title */}
            <h1 className="text-xl sm:text-4xl font-bold text-gray-800 mb-2">
              Smart
            </h1>

            <h1 className="
                text-xl sm:text-4xl
                font-bold
                bg-gradient-to-r from-[#2f80ff] to-[#12c2e9]
                bg-clip-text text-transparent
                mb-2 sm:mb-3 md:mb-5 lg:mb-10
              ">
              Compliance Assistant
            </h1>

            {/* Button */}
            <div className="py-10 sm:py-10 lg:py-15">
              <Button className="
                  px-8 py-4
                  rounded-full
                  bg-gradient-to-r from-[#2f80ff] to-[#12c2e9]
                  text-white
                  font-medium
                  shadow-[0_10px_25px_rgba(47,128,255,0.4)]
                  hover:scale-105
                  transition-transform duration-300
                  flex items-center justify-center gap-2
                  mx-auto
                "
                onClick={UploadDocuments}
              >
                Start Compliance Check
                <span className="text-lg">→</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Start;