"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { LogOut, User, Stethoscope, Activity, ShieldCheck, LayoutDashboard } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const userRaw = Cookies.get("user");
    if (userRaw) {
      setUser(JSON.parse(userRaw));
    }
    setMounted(true);
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    router.push("/login");
    router.refresh();
  };

  if (!mounted || !user) return null;

  const getRoleBadge = () => {
    const roles: any = {
      ADMIN: { label: "Administrador", color: "bg-purple-100 text-purple-700 border-purple-200" },
      DOCTOR: { label: "Médico", color: "bg-blue-100 text-blue-700 border-blue-200" },
      PATIENT: { label: "Paciente", color: "bg-green-100 text-green-700 border-green-200" },
    };
    const role = roles[user.role] || roles.PATIENT;
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${role.color}`}>
        {role.label}
      </span>
    );
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo y Nombre */}
          <Link href="/" className="flex items-center gap-3 group transition-all">
            <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
              Med<span className="text-blue-600">Prescribe</span>
            </span>
          </Link>

          {/* Info de Usuario y Acciones */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 px-4 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{user.email}</p>
                {getRoleBadge()}
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 active:scale-95 transition-all shadow-lg shadow-red-500/20"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
