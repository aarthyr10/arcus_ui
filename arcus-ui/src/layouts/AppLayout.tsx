// import Header from "../components/Header/Header";

// export default function AppLayout({ children }: { children: React.ReactNode }) {
//     return (
//         <div className="min-h-screen bg-gradient-to-br from-[#eaf6fb] to-[#dbeef7] flex flex-col">
//             <div className="relative z-10">
//                 <Header />
//             </div>
//             {/* This takes remaining height after header */}
//             <main className="">
//                 {children}
//             </main>
//         </div>
//     );
// }




import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-[#eaf6fb] to-[#dbeef7]">
            <div className="relative z-10">
                <Header />
            </div>
            {/* This takes remaining height after header */}
            <main>
                  <Outlet />
                {/* {children} */}
            </main>
        </div>
    );
}