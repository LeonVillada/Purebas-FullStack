"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { LogOut, User, Stethoscope, Activity, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const userRaw = Cookies.get("user");
  const user = userRaw ? JSON.parse(userRaw) : null;

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    router.push("/login");
  };

  if (!user) return null;

  const getRoleIcon = () => {
    if (user.role === "ADMIN") return <ShieldCheck className="h-5 w-5 text-purple-500" />;
    if (user.role === "DOCTOR") return <Stethoscope className="h-5 w-5 text-blue-500" />;
    return <Activity className="h-5 w-5 text-green-500" />;
  };

  return (
    <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">
              MedPrescribe
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
              {getRoleIcon()}
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {user.role}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-slate-900 dark:text-white leading-none">
                  {user.email}
                </p>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider font-bold">
                  Conectado
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full text-slate-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 transition-all"
                title="Cerrar Sesión"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
