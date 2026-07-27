"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Cookies from "js-cookie";

export default  function DashboardLayout({ children }) {
    const router = useRouter();
    const [orgName, setOrgName] = useState("optima sync");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);


    const [activeTab, setActiveTab] = useState("sales");

        const orgId=Cookies.get("organaisationId");

    const handleLogout = () => {
        router.push("/login"); 
    };

    return (
        <div className="flex h-screen w-full bg-zinc-50 text-zinc-900 font-sans antialiased overflow-hidden relative">


            <aside 
                className={`
                    ${isSidebarOpen ? "flex fixed inset-y-0  z-40 shadow-2xl" : "hidden"} 
                    lg:flex lg:static 
                    w-64 min-w-[256px] h-full bg-zinc-100 flex-col justify-between border-r border-zinc-200 lg:shadow-sm z-20 flex-shrink-0
                `}
            >
                <div className="p-6">

                    <div className="flex items-center justify-between mb-8 px-2">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-blue-600 animate-pulse"></div>
                            <h2 className="text-xl font-bold tracking-tight text-zinc-900">Optima Sync</h2>
                        </div>
                        <button 
                            onClick={() => setIsSidebarOpen(false)}
                            className="lg:hidden p-1 text-zinc-500 hover:text-zinc-900 rounded-lg hover:bg-zinc-200 transition"
                            aria-label="Close menu"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    
                    <nav className="flex flex-col gap-1.5">

                        <button 
                            onClick={() => setActiveTab("sales")}
                            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-semibold text-sm transition text-right cursor-pointer ${
                                activeTab === "sales" 
                                    ? "bg-zinc-900 text-white shadow-sm" 
                                    : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                            }`}
                        >
                            📊 المبيعات (Sales)
                        </button>

                        <button 
                            onClick={() => setActiveTab("marketing")}
                            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-semibold text-sm transition text-right cursor-pointer ${
                                activeTab === "marketing" 
                                    ? "bg-zinc-900 text-white shadow-sm" 
                                    : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                            }`}
                        >
                            📢 التسويق (Marketing)
                        </button>
                        <Link href={`/dashboard//industries`}>
                        <button 
                            onClick={() => setActiveTab("industries")}
                            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-semibold text-sm transition text-right cursor-pointer ${
                                activeTab === "industries" 
                                    ? "bg-zinc-900 text-white shadow-sm" 
                                    : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                            }`}
                        >
                            🏢 الصناعات (industries)
                        </button>                       
                        </Link>

                        <button 
                            onClick={() => {
                                setActiveTab("settings");
                                setIsSettingsOpen(!isSettingsOpen);
                            }} 
                            className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-semibold text-sm transition text-right cursor-pointer ${
                            activeTab === "settings" 
                                    ? "bg-zinc-900 text-white shadow-sm" 
                                    : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                            }`}
                        >
                            ⚙️ الإعدادات (Settings)
                        </button>
                        

                        {isSettingsOpen && (
                            <div className="flex flex-col gap-1 pr-6 pl-2 transition-all duration-200">
                                <div>
                                <Link 
                                    href={orgId ? `/dashboard/settings/profile?id=${orgId}` : "/dashboard/settings/profile"}
                                    onClick={() => {
                                        setActiveTab("profile");
                                        setIsSidebarOpen(false);
                                    }} 
                                    className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg text-xs font-semibold transition text-right ${
                                        activeTab === "profile" 
                                            ? "bg-blue-100 text-blue-700 font-bold" 
                                            : "text-zinc-600 hover:bg-zinc-200 hover:text-blue-600"
                                    }`}
                                >
                                    <span>👤</span>
                                    <span>Edit Profile </span>
                                </Link>
                                </div>
                                
                                <div>
                                <Link 
                                    href={orgId ? `/dashboard/settings/edit-logo?id=${orgId}` : "/dashboard/settings/edit-logo"}
                                    onClick={() => {
                                        setActiveTab("Logo");
                                        setIsSidebarOpen(false);
                                    }} 
                                    className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg text-xs font-semibold transition text-right ${
                                        activeTab === "Logo" 
                                            ? "bg-blue-100 text-blue-700 font-bold" 
                                            : "text-zinc-600 hover:bg-zinc-200 hover:text-blue-600"
                                    }`}
                                >
                                    <span>🖼️</span>
                                    <span>Edit Logo </span>
                                </Link>
                                </div>

                            </div>

                        )}
                    </nav>
                </div>

                <div className="p-4 border-t border-zinc-200 text-[11px] text-zinc-400 text-center tracking-wider font-mono">
                    PANEL v1.0
                </div>
            </aside>


            <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
                
                <header className="h-16 w-full bg-white border-b border-zinc-200 flex items-center justify-between px-4 sm:px-8 shadow-sm z-10 flex-shrink-0">
                    <div className="flex items-center gap-3 text-sm">
                        <button 
                            onClick={() => setIsSidebarOpen(prev => !prev)}
                            className="lg:hidden p-2 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition cursor-pointer"
                            aria-label="Toggle menu"
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <span className="bg-zinc-200 text-zinc-900 px-3 py-1 rounded-md font-bold text-xs border border-zinc-300/60 shadow-inner">
                            {orgName}
                        </span>
                    </div>

                    <button 
                        onClick={handleLogout}
                        className="text-xs bg-zinc-900 hover:bg-zinc-800 text-white font-medium px-4 py-2 rounded-lg transition-all duration-150 shadow-sm hover:shadow active:scale-[0.98]"
                    >
                        Log out
                    </button>
                </header>

                <main className="flex-1 bg-zinc-50 p-4 sm:p-8 overflow-y-auto">
                    <div className="max-w-6xl mx-auto">
                        {children} 
                    </div>
                </main>
            </div>
        </div>
    );
}