import React from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { LogOut, Sun, Moon, Home, Wallet, PieChart, User, Activity } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { getInitials } from "@/lib/utils";

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const navLinks = [
    { name: "Overview", path: "/dashboard", icon: Home },
    { name: "Transactions", path: "/transactions", icon: Wallet },
    { name: "Analytics", path: "/dashboard?tab=analytics", icon: PieChart },
  ];

  const isActive = (path: string) => {
    if (path.includes("?")) {
      const searchParams = new URLSearchParams(path.split("?")[1]);
      const currentParams = new URLSearchParams(location.search);
      return location.pathname === path.split("?")[0] && currentParams.get("tab") === searchParams.get("tab");
    }
    // Exact match for base path, and ignore search params if path doesn't specify them
    return location.pathname === path && !location.search.includes("tab=");
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-brand-bg text-brand-text">
      {/* Top Command Bar */}
      <header className="flex h-14 shrink-0 items-center justify-between px-4 md:px-8 border-b border-brand-border bg-brand-bg/80 backdrop-blur-xl z-50">
        
        {/* Left: Brand Logo & Name */}
        <div className="flex items-center gap-3 md:w-64">
          <Link to="/dashboard" className="flex items-center gap-2 group transition-opacity hover:opacity-80">
            <div className="flex items-center justify-center text-brand-text">
              <Activity size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-sm font-bold tracking-tight text-brand-text hidden sm:block">FlowLedger</h1>
          </Link>
        </div>

        {/* Center: Navigation Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all duration-200 ${
                  active 
                    ? "text-brand-text bg-brand-muted/10" 
                    : "text-brand-muted hover:text-brand-text hover:bg-brand-muted/5"
                }`}
              >
                <Icon size={14} className={active ? "text-brand-text" : "text-brand-muted"} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions & Profile */}
        <div className="flex items-center justify-end gap-2 md:w-64">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md text-brand-muted hover:text-brand-text hover:bg-brand-card/50 transition-colors"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          <div className="h-4 w-px bg-brand-muted/10 mx-1 hidden sm:block" />

          {/* Profile — clickable link on desktop */}
          <Link
            to="/dashboard?tab=profile"
            className={`hidden sm:flex items-center gap-2 px-2 py-1 rounded-md transition-colors duration-200 ${
              isActive("/dashboard?tab=profile")
                ? "bg-brand-muted/10"
                : "hover:bg-brand-muted/5"
            }`}
            title="View Profile"
          >
            <span className="text-xs font-medium text-brand-muted">
              {user?.name}
            </span>
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-muted/10 text-[10px] font-bold text-brand-text">
              {user ? getInitials(user.name) : "?"}
            </div>
          </Link>

          {/* Mobile: avatar only (no name) */}
          <div className="sm:hidden flex h-7 w-7 items-center justify-center rounded-full bg-brand-muted/10 text-[10px] font-bold text-brand-text">
            {user ? getInitials(user.name) : "?"}
          </div>

          {/* Logout button */}
          <button
            onClick={logout}
            className="p-1.5 rounded-md text-brand-muted hover:text-brand-expense hover:bg-brand-card/50 transition-colors"
            title="Logout"
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto relative bg-brand-bg">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/4 w-[40vw] h-[40vw] rounded-full bg-brand-accent/[0.02] blur-[100px] pointer-events-none z-0" />
        <div className="absolute bottom-0 right-1/4 w-[30vw] h-[30vw] rounded-full bg-brand-success/[0.02] blur-[80px] pointer-events-none z-0" />
        
        <div className="relative z-10 w-full max-w-7xl mx-auto p-4 md:p-8 md:pt-6">
          <Outlet />
        </div>
      </main>

      {/* Mobile Navigation (Bottom) */}
      <div className="md:hidden flex items-center justify-around border-t border-brand-border bg-brand-bg/90 backdrop-blur-md pb-safe h-14 shrink-0 px-2">
        {navLinks.map((link) => {
          const active = isActive(link.path);
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                active ? "text-brand-accent" : "text-brand-muted hover:text-brand-text"
              }`}
            >
              <Icon size={18} />
              <span className="text-[9px] font-medium">{link.name}</span>
            </Link>
          );
        })}
        {/* Profile Link for Mobile */}
        <Link
          to="/dashboard?tab=profile"
          className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
            isActive("/dashboard?tab=profile") ? "text-brand-accent" : "text-brand-muted hover:text-brand-text"
          }`}
        >
          <User size={18} />
          <span className="text-[9px] font-medium">Profile</span>
        </Link>
      </div>
    </div>
  );
}

