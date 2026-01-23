import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";

export default function AppLayout() {
    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-[#eaf6fb] to-[#dbeef7] overflow-hidden">
            <div className="relative z-10">
                <Header />
            </div>
            {/* This takes remaining height after header */}
            {/* <main> */}
                  <main className="flex-1 overflow-hidden flex items-center justify-center px-4">

                  <Outlet />
                {/* {children} */}
            </main>
        </div>
    );
}