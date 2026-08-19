"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  BarChart3,
  Users,
  Megaphone,
  Building2,
  MapPin,
  MessageSquare,
  Settings,
  User,
  Image,
  LogOut,
} from "lucide-react";
import LogOutButton from "../../../actions/auth";

export default function DashboardLayout({ children, params }) {
  const router = useRouter();
  const pathname = usePathname();
  const [orgName, setOrgName] = useState("optima sync");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("sales");

  const resolvedParams = params ? use(params) : null;
  const orgId = resolvedParams?.OrgId;

  const basePath = `/${orgId}/dashboard`;

  useEffect(() => {
    if (pathname.includes("/clients")) {
      setActiveTab("clients");
    } else if (pathname.includes("/industries")) {
      setActiveTab("industries");
    } else if (pathname.includes("/cities")) {
      setActiveTab("cities");
    } else if (pathname.includes("/channels")) {
      setActiveTab("channels");
    } else if (pathname.includes("/settings/profile")) {
      setActiveTab("profile");
      setIsSettingsOpen(true);
    } else if (pathname.includes("/settings/edit-logo")) {
      setActiveTab("Logo");
      setIsSettingsOpen(true);
    } else if (pathname.includes("/settings")) {
      setActiveTab("settings");
      setIsSettingsOpen(true);
    } else if (pathname.includes("/member")) {
      setActiveTab("member");
    } else if (pathname.includes("/sales")) {
      setActiveTab("sales");
    }else if (pathname.includes("/marketing")) {
      setActiveTab("marketing");
    }
  }, [pathname]);

  const handleLogout = async () => {
    await LogOutButton();
  };

  return (
    <div className="flex h-screen w-full bg-zinc-50 text-zinc-900 font-sans antialiased overflow-hidden relative">
      {/* Sidebar */}
      <aside
        className={`
          ${isSidebarOpen ? "flex fixed inset-y-0 z-40 shadow-2xl" : "hidden"} 
          lg:flex lg:static 
          w-64 min-w-[256px] h-full bg-zinc-100 flex-col justify-between border-r border-zinc-200 lg:shadow-sm z-20 flex-shrink-0
        `}
      >
        <div className="p-6 flex-1 overflow-y-auto">
          {/* Brand Header & Organization Info */}
          <div className="flex items-center justify-between mb-6 px-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-600 animate-pulse"></div>
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                Optima Sync
              </h2>
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
            <Link
              href={`${basePath}/sales`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <button
                onClick={() => {
                  setActiveTab("sales");
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-semibold text-sm transition text-left cursor-pointer ${
                  activeTab === "sales"
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Sales</span>
              </button>
            </Link>

            <Link
              href={`${basePath}/member`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <button
                onClick={() => setActiveTab("member")}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-semibold text-sm transition text-left cursor-pointer ${
                  activeTab === "member"
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Member</span>
              </button>
            </Link>

            <Link
              href={`${basePath}/marketing`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <button
                onClick={() => {
                  setActiveTab("marketing");
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-semibold text-sm transition text-left cursor-pointer ${
                  activeTab === "marketing"
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                }`}
              >
                <Megaphone className="w-4 h-4" />
                <span>Marketing</span>
              </button>
            </Link>

            <Link
              href={`${basePath}/clients`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <button
                onClick={() => setActiveTab("clients")}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-semibold text-sm transition text-left cursor-pointer ${
                  activeTab === "clients"
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Clients</span>
              </button>
            </Link>

            <Link
              href={`${basePath}/industries`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <button
                onClick={() => setActiveTab("industries")}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-semibold text-sm transition text-left cursor-pointer ${
                  activeTab === "industries"
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>Industries</span>
              </button>
            </Link>

            <Link
              href={`${basePath}/cities`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <button
                onClick={() => setActiveTab("cities")}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-semibold text-sm transition text-left cursor-pointer ${
                  activeTab === "cities"
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Cities</span>
              </button>
            </Link>

            <Link
              href={`${basePath}/channels`}
              onClick={() => setIsSidebarOpen(false)}
            >
              <button
                onClick={() => setActiveTab("channels")}
                className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-semibold text-sm transition text-left cursor-pointer ${
                  activeTab === "channels"
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Channels</span>
              </button>
            </Link>

            <button
              onClick={() => {
                setActiveTab("settings");
                setIsSettingsOpen(!isSettingsOpen);
              }}
              className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg font-semibold text-sm transition text-left cursor-pointer ${
                activeTab === "settings" ||
                activeTab === "profile" ||
                activeTab === "Logo"
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

            {isSettingsOpen && (
              <div className="flex flex-col gap-1 pl-6 pr-2 transition-all duration-200">
                <Link
                  href={`${basePath}/settings/profile`}
                  onClick={() => {
                    setActiveTab("profile");
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg text-xs font-semibold transition text-left ${
                    activeTab === "profile"
                      ? "bg-blue-100 text-blue-700 font-bold"
                      : "text-zinc-600 hover:bg-zinc-200 hover:text-blue-600"
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </Link>

                <Link
                  href={`${basePath}/settings/edit-logo`}
                  onClick={() => {
                    setActiveTab("Logo");
                    setIsSidebarOpen(false);
                  }}
                  className={`flex items-center gap-2 w-full px-4 py-2 rounded-lg text-xs font-semibold transition text-left ${
                    activeTab === "Logo"
                      ? "bg-blue-100 text-blue-700 font-bold"
                      : "text-zinc-600 hover:bg-zinc-200 hover:text-blue-600"
                  }`}
                >
                  <Image className="w-3.5 h-3.5" />
                  <span>Edit Logo</span>
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Bottom Sidebar Footer */}
        <div className="p-4 border-t border-zinc-200 space-y-3">
          {/* Red Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-semibold text-sm rounded-lg transition-all duration-200 cursor-pointer group shadow-sm"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Log out</span>
          </button>

          <div className="text-[11px] text-zinc-400 text-center tracking-wider font-mono">
            PANEL v1.0
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Mobile Toggle Button (Visible only on mobile devices) */}
        <div className="lg:hidden p-4 bg-white border-b border-zinc-200 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition cursor-pointer"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="bg-zinc-200 text-zinc-900 px-3 py-1 rounded-md font-bold text-xs">
            {orgName}
          </span>
        </div>

        <main className="flex-1 bg-zinc-50 p-4 sm:p-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
