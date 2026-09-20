"use client";
import { FolderKanban } from "lucide-react";

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
  LogOut,
  Package
} from "lucide-react";
import LogOutButton from "../../../actions/auth";

export default function DashboardLayout({ children, params }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

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
    } else if (pathname.includes("/product")) {
      setActiveTab("product");
    } else if (pathname.includes("/marketing")) {
      setActiveTab("marketing");
    } else if (pathname.includes("/projects")) {
      setActiveTab("projects");
    } else {
      setActiveTab("");
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
          relative h-full bg-zinc-100 flex flex-col justify-between border-r border-zinc-200 shadow-sm z-20 flex-shrink-0
          transition-all duration-300
          ${
            isSidebarExpanded
              ? "w-16 lg:w-64 lg:min-w-[256px]"
              : "w-16 min-w-[64px]"
          }
        `}
      >
        <div className="p-3 lg:p-4 flex-1 overflow-y-auto overflow-x-hidden">
          {/* Brand Header & Toggle Button */}
          <div
            className={`flex items-center mb-6 px-1 ${
              isSidebarExpanded ? "justify-center lg:justify-between" : "justify-center"
            }`}
          >
            {/* اسم الشركة يظهر فقط في الشاشات الكبيرة lg وعند فتح القائمة */}
            {isSidebarExpanded && (
              <div className="hidden lg:flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-blue-600 animate-pulse flex-shrink-0"></div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 truncate">
                  Optima Sync
                </h2>
              </div>
            )}

            {/* أزرار التبديل تظهر فقط في الشاشات الكبيرة lg */}
            <div className="hidden lg:block">
              {isSidebarExpanded ? (
                <button
                  onClick={() => setIsSidebarExpanded(false)}
                  className="text-zinc-500 hover:text-zinc-900 rounded-lg p-1.5 hover:bg-zinc-200 transition cursor-pointer"
                  aria-label="Collapse menu"
                  title="Collapse Sidebar"
                >
                  <X className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => setIsSidebarExpanded(true)}
                  className="text-zinc-500 hover:text-zinc-900 rounded-lg p-1.5 hover:bg-zinc-200 transition cursor-pointer"
                  aria-label="Expand menu"
                  title="Expand Sidebar"
                >
                  <Menu className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          <nav className="flex flex-col gap-1.5">
            <Link href={`${basePath}/sales`}>
              <button
                onClick={() => setActiveTab("sales")}
                className={`flex items-center ${
                  isSidebarExpanded ? "justify-center lg:justify-start lg:px-4" : "justify-center px-0"
                } gap-3 w-full py-2.5 rounded-lg font-semibold text-sm transition cursor-pointer ${
                  activeTab === "sales"
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                }`}
                title="Sales"
              >
                <BarChart3 className="w-4 h-4 flex-shrink-0" />
                {isSidebarExpanded && <span className="hidden lg:inline">Sales</span>}
              </button>
            </Link>

            <Link href={`${basePath}/member`}>
              <button
                onClick={() => setActiveTab("member")}
                className={`flex items-center ${
                  isSidebarExpanded ? "justify-center lg:justify-start lg:px-4" : "justify-center px-0"
                } gap-3 w-full py-2.5 rounded-lg font-semibold text-sm transition cursor-pointer ${
                  activeTab === "member"
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                }`}
                title="Member"
              >
                <Users className="w-4 h-4 flex-shrink-0" />
                {isSidebarExpanded && <span className="hidden lg:inline">Member</span>}
              </button>
            </Link>

            <Link href={`${basePath}/product`}>
              <button
                onClick={() => setActiveTab("product")}
                className={`flex items-center ${
                  isSidebarExpanded ? "justify-center lg:justify-start lg:px-4" : "justify-center px-0"
                } gap-3 w-full py-2.5 rounded-lg font-semibold text-sm transition cursor-pointer ${
                  activeTab === "product"
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                }`}
                title="Product"
              >
                <Package className="w-4 h-4 flex-shrink-0" />
                {isSidebarExpanded && <span className="hidden lg:inline">Product</span>}
              </button>
            </Link>

            <Link href={`${basePath}/marketing`}>
              <button
                onClick={() => setActiveTab("marketing")}
                className={`flex items-center ${
                  isSidebarExpanded ? "justify-center lg:justify-start lg:px-4" : "justify-center px-0"
                } gap-3 w-full py-2.5 rounded-lg font-semibold text-sm transition cursor-pointer ${
                  activeTab === "marketing"
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                }`}
                title="Marketing"
              >
                <Megaphone className="w-4 h-4 flex-shrink-0" />
                {isSidebarExpanded && <span className="hidden lg:inline">Marketing</span>}
              </button>
            </Link>

            <Link href={`${basePath}/clients`}>
              <button
                onClick={() => setActiveTab("clients")}
                className={`flex items-center ${
                  isSidebarExpanded ? "justify-center lg:justify-start lg:px-4" : "justify-center px-0"
                } gap-3 w-full py-2.5 rounded-lg font-semibold text-sm transition cursor-pointer ${
                  activeTab === "clients"
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                }`}
                title="Clients"
              >
                <Users className="w-4 h-4 flex-shrink-0" />
                {isSidebarExpanded && <span className="hidden lg:inline">Clients</span>}
              </button>
            </Link>

            <Link href={`${basePath}/industries`}>
              <button
                onClick={() => setActiveTab("industries")}
                className={`flex items-center ${
                  isSidebarExpanded ? "justify-center lg:justify-start lg:px-4" : "justify-center px-0"
                } gap-3 w-full py-2.5 rounded-lg font-semibold text-sm transition cursor-pointer ${
                  activeTab === "industries"
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                }`}
                title="Industries"
              >
                <Building2 className="w-4 h-4 flex-shrink-0" />
                {isSidebarExpanded && <span className="hidden lg:inline">Industries</span>}
              </button>
              
            </Link>
                
              <Link href={`${basePath}/projects`}>
                  <button
                onClick={() => setActiveTab("projects")}
                className={`flex items-center ${
                  isSidebarExpanded ? "justify-center lg:justify-start lg:px-4" : "justify-center px-0"
                } gap-3 w-full py-2.5 rounded-lg font-semibold text-sm transition cursor-pointer ${
                  activeTab === "Project-Management"
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                }`}
                title="Project Management"
              >
                <FolderKanban className="w-4 h-4 flex-shrink-0" />
                {isSidebarExpanded && <span className="hidden lg:inline">Project Management</span>}
              </button>
              </Link>

            <Link href={`${basePath}/cities`}>
              <button
                onClick={() => setActiveTab("cities")}
                className={`flex items-center ${
                  isSidebarExpanded ? "justify-center lg:justify-start lg:px-4" : "justify-center px-0"
                } gap-3 w-full py-2.5 rounded-lg font-semibold text-sm transition cursor-pointer ${
                  activeTab === "cities"
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                }`}
                title="Cities"
              >
                <MapPin className="w-4 h-4 flex-shrink-0" />
                {isSidebarExpanded && <span className="hidden lg:inline">Cities</span>}
              </button>
            </Link>

            <Link href={`${basePath}/channels`}>
              <button
                onClick={() => setActiveTab("channels")}
                className={`flex items-center ${
                  isSidebarExpanded ? "justify-center lg:justify-start lg:px-4" : "justify-center px-0"
                } gap-3 w-full py-2.5 rounded-lg font-semibold text-sm transition cursor-pointer ${
                  activeTab === "channels"
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                }`}
                title="Channels"
              >
                <MessageSquare className="w-4 h-4 flex-shrink-0" />
                {isSidebarExpanded && <span className="hidden lg:inline">Channels</span>}
              </button>
            </Link>

            <button
              onClick={() => {
                setActiveTab("settings");
                setIsSettingsOpen(!isSettingsOpen);
              }}
              className={`flex items-center ${
                isSidebarExpanded ? "justify-center lg:justify-start lg:px-4" : "justify-center px-0"
              } gap-3 w-full py-2.5 rounded-lg font-semibold text-sm transition cursor-pointer ${
                activeTab === "settings" ||
                activeTab === "profile" ||
                activeTab === "Logo"
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
              }`}
              title="Settings"
            >
              <Settings className="w-4 h-4 flex-shrink-0" />
              {isSidebarExpanded && <span className="hidden lg:inline">Settings</span>}
            </button>

            {isSettingsOpen && (
              <div
                className={`flex flex-col gap-1 transition-all duration-200 ${
                  isSidebarExpanded ? "items-center lg:items-stretch lg:pl-6 lg:pr-2" : "items-center"
                }`}
              >
                <Link
                  href={`${basePath}/settings/profile`}
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center ${
                    isSidebarExpanded ? "justify-center lg:justify-start lg:px-4" : "justify-center px-0"
                  } gap-2 w-full py-2 rounded-lg text-xs font-semibold transition ${
                    activeTab === "profile"
                      ? "bg-blue-100 text-blue-700 font-bold"
                      : "text-zinc-600 hover:bg-zinc-200 hover:text-blue-600"
                  }`}
                  title="Edit Organization"
                >
                  <User className="w-3.5 h-3.5 flex-shrink-0" />
                  {isSidebarExpanded && <span className="hidden lg:inline">Edit Organization</span>}
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Bottom Sidebar Footer */}
        <div className="p-2 lg:p-4 border-t border-zinc-200 space-y-3">
          <button
            onClick={handleLogout}
            className={`flex items-center justify-center gap-2 w-full ${
              isSidebarExpanded ? "px-0 lg:px-4" : "px-0"
            } py-2.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-semibold text-sm rounded-lg transition-all duration-200 cursor-pointer group shadow-sm`}
            title="Log out"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 flex-shrink-0" />
            {isSidebarExpanded && <span className="hidden lg:inline">Log out</span>}
          </button>

          {isSidebarExpanded && (
            <div className="hidden lg:block text-[11px] text-zinc-400 text-center tracking-wider font-mono">
              PANEL v1.0
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <main className="flex-1 bg-zinc-50 p-4 sm:p-8 pl-3 overflow-y-auto">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}