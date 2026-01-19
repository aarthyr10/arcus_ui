import logo from "../../../public/Images/daikin.png"

const Start = () => {
  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-[#eaf6fb] to-[#dbeef7]">
        <div className="p-5">
           <img src={logo} alt="Daikin logo" className=""/>
        </div>
         <div className="flex items-center align-middle justify-center px-4">
      
      <div className="
        w-full max-w-md sm:max-w-lg
        bg-[#f3fbff]
        rounded-3xl
        shadow-[0_20px_40px_rgba(0,0,0,0.15)]
        p-10 sm:p-14
        text-center
      ">
        
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

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Smart
        </h2>

        <h1 className="
          text-3xl sm:text-4xl
          font-bold
          bg-gradient-to-r from-[#2f80ff] to-[#12c2e9]
          bg-clip-text text-transparent
          mb-10
        ">
          Compliance Assistant
        </h1>

        {/* Button */}
        <button className="
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
        ">
          Start Compliance Check
          <span className="text-lg">→</span>
        </button>

      </div>
    </div>
    </div>
    </>
  )
}
 
export default Start