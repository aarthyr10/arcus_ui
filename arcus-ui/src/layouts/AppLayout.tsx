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