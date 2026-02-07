// import { Outlet } from "react-router-dom";
// import Header from "../components/Header/Header";
// import Footer from "../components/Footer/Footer";

// export default function AppLayout() {
//     return (
//         <div className="h-screen flex flex-col bg-gradient-to-br from-[#eaf6fb] to-[#dbeef7]">
//             <div className="relative z-10">
//                 <Header />
//             </div>
//             <main className="flex-1 overflow-y-auto px-6 py-6">
//                 <Outlet />
//             </main>
//             <Footer />
//         </div>
//     );
// }

import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

export default function AppLayout() {
  return (
    <div
      className="
      min-h-screen 
      flex flex-col 
      bg-gradient-to-br from-[#eaf6fb] to-[#dbeef7]
    "
    >
      {/* Header */}
      <div className="">
        <Header />
      </div>

      {/* Main Content */}
      <main
  className="
  flex-1 
  w-full 
  mx-auto
  px-4 sm:px-6 lg:px-10 
  py-4 sm:py-6
  pt-[70px]  
"
>

        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}