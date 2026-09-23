"use client";


import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Menu,
  X,
  Home,
  BarChart3,
  UserCheck,
  Users,
  Megaphone,
  Database,
  Settings,
  User,
  LogOut,
  Package,
  BriefcaseBusiness,
  FolderKanban
} from "lucide-react";
import LogOutButton from "../../../actions/auth";

export default function DashboardLayout({ children, params }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSettingsOpen, setIsSettingsOpen] = useState(true);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const [activeTab, setActiveTab] = useState("home");

  const resolvedParams = params ? use(params) : null;
  const orgId = resolvedParams?.OrgId;

  const basePath = `/${orgId}/dashboard`;

  useEffect(() => {
    if (pathname.includes("/clients")) {
      setActiveTab("clients");
    } else if (pathname.includes("/reference-data")) {
      setActiveTab("reference-data");
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
    } else if (pathname.includes("/workspace")) {
      setActiveTab("employees");
    } else if (pathname.includes("/sales")) {
      setActiveTab("sales");
    } else if (pathname.includes("/product")) {
      setActiveTab("product");
    } else if (pathname.includes("/marketing")) {
      setActiveTab("marketing");
    } else if (pathname.includes("/projects")) {
      setActiveTab("projects");
    } else if (pathname === basePath || pathname === `${basePath}/`) {
      setActiveTab("home");
    } else {
      setActiveTab("");
    }
  }, [pathname, basePath]);

  const handleLogout = async () => {
    await LogOutButton();
  };

  const navItems = [
    { id: "home", label: "Home", href: basePath, icon: Home },
    { id: "sales", label: "Sales", href: `${basePath}/sales`, icon: BarChart3 },
    { id: "member", label: "Member", href: `${basePath}/member`, icon: UserCheck },
    { id: "product", label: "Product", href: `${basePath}/product`, icon: Package },
    { id: "marketing", label: "Marketing", href: `${basePath}/marketing`, icon: Megaphone },
    { id: "clients", label: "Clients", href: `${basePath}/clients`, icon: Users },
    { id: "employees", label: "Employees", href: `${basePath}/workspace`, icon: BriefcaseBusiness },
    { id: "reference-data", label: "Reference Data", href: `${basePath}/reference-data`, icon: Database },
      { id: "projects", label: "Projects", href: `${basePath}/projects`, icon: FolderKanban},
  ];

  return (
    <div className="flex h-screen w-full bg-zinc-50 text-zinc-900 font-sans antialiased overflow-hidden relative">
      {/* Sidebar */}
      <aside
        className={`
          relative h-full bg-zinc-100 flex flex-col  items-start justify-between border-r border-zinc-200 shadow-sm z-20 flex-shrink-0
          transition-all duration-800 ease-in-out 
         ${isSidebarExpanded? 'w-64':'w-16'}
        `}
      >
        <div className="p-2 flex-1 overflow-y-auto overflow-x-hidden">
          {/* Brand Header & Toggle Button */}
          <div className="flex items-center justify-between  mb-6">
             <div className="hidden lg:block mx-auto lg:mx-0">
              <button
                onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                className="text-zinc-500 hover:text-zinc-900 rounded-lg p-2 px-3 hover:bg-zinc-200 transition cursor-pointer flex items-center justify-center"
                aria-label="Toggle menu"
                title={isSidebarExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
              >
                {isSidebarExpanded ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 " />}
              </button>
            </div>
            {isSidebarExpanded && (
              <div className="hidden lg:flex items-center gap-2 overflow-hidden">
                <div className="h-3 w-3 rounded-full bg-blue-600 animate-pulse flex-shrink-0"></div>
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 truncate">
                  Optima Sync
                </h2>
              </div>
            )}

           
          </div>

          <nav className={`flex flex-col justify-start transition-all gap-1.5
            `}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex transition-all duration-300 ease-in-out items-center h-10 rounded-lg font-semibold text-sm transition-colors cursor-pointer ${
                    isSidebarExpanded ? "justify-start lg:justify-start px-3" : "justify-center px-3 "
                  } ${
                    isActive
                      ? "bg-zinc-900 text-white shadow-sm"
                      : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
                  }`}
                  title={item.label}
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                 
                    <span className={`lg:ml-3 truncate transition-all duration-300 ease-in
                       ${isSidebarExpanded ? 'inline':'hidden'}`}>{item.label}</span>
                </Link>
              );
            })}

            {/* Settings Parent */}
            <button
              onClick={() => {
                setActiveTab("settings");
                setIsSettingsOpen(!isSettingsOpen);
              }}
              className={`flex items-center h-10 w-full rounded-lg font-semibold text-sm transition-colors cursor-pointer ${
                isSidebarExpanded ? "justify-center lg:justify-start lg:px-3" : "justify-center px-0"
              } ${
                activeTab === "settings" || activeTab === "profile" || activeTab === "Logo"
                  ? "bg-zinc-900 text-white shadow-sm"
                  : "text-zinc-700 hover:bg-zinc-200 hover:text-zinc-900"
              }`}
              title="Settings"
            >
              <Settings className="w-4 h-4 flex-shrink-0" />
              {isSidebarExpanded && (
                <span className="hidden lg:inline ml-3 truncate">Settings</span>
              )}
            </button>

            {/* Sub-Settings */}
            {isSettingsOpen && (
              <div className="flex flex-col gap-1 mt-1">
                <Link
                  href={`${basePath}/settings/profile`}
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center h-9 rounded-lg text-xs font-semibold transition-colors ${
                    isSidebarExpanded ? "justify-center lg:justify-start lg:pl-8 lg:pr-3" : "justify-center px-0"
                  } ${
                    activeTab === "profile"
                      ? "bg-blue-100 text-blue-700 font-bold"
                      : "text-zinc-600 hover:bg-zinc-200 hover:text-blue-600"
                  }`}
                  title="Edit Organization"
                >
                  <User className="w-3.5 h-3.5 flex-shrink-0" />
                  {isSidebarExpanded && (
                    <span className="hidden lg:inline ml-2 truncate">Edit Organization</span>
                  )}
                </Link>
              </div>
            )}
          </nav>
        </div>

        {/* Bottom Sidebar Footer */}
        <div className="p-2  border-t border-zinc-200 w-full">
          <button
            onClick={handleLogout}
            className={`flex items-center h-10 w-full bg-red-50 hover:bg-red-600 text-red-600 hover:text-white font-semibold text-sm rounded-lg transition-all duration-200 cursor-pointer group shadow-sm ${
              isSidebarExpanded ? "justify-center lg:justify-start lg:px-3" : "justify-center px-0"
            }`}
            title="Log out"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-0.5 flex-shrink-0" />
            {isSidebarExpanded && (
              <span className="hidden lg:inline ml-3 truncate">Log out</span>
            )}
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