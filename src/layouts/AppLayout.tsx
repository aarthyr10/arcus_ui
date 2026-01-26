import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";

export default function AppLayout() {
    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-[#eaf6fb] to-[#dbeef7]">
            <div className="relative z-10">
                <Header />
            </div>
                  <main className="flex-1 overflow-y-auto px-6 py-6">
                  <Outlet />
            </main>
        </div>
    );
}