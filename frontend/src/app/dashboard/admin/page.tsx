"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Users, FileText, CheckCircle, Activity, TrendingUp, Users2, Calendar } from "lucide-react";

interface Stats {
  totalUsers: number;
  totalPrescriptions: number;
  statusStats: {
    ACTIVE?: number;
    CONSUMED?: number;
  };
  prescriptionsToday: number;
}

interface Log {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  user: { email: string; role: string };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userRaw = Cookies.get("user");
    if (!userRaw) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(userRaw);
    if (user.role !== "ADMIN") {
      router.push(`/dashboard/${user.role.toLowerCase()}`);
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, logsRes] = await Promise.all([
        api.get("/admin/stats"),
        api.get("/admin/logs")
      ]);
      setStats(statsRes.data);
      setLogs(logsRes.data);
    } catch (err: any) {
      console.error("Error fetching admin data", err);
      setError(err.response?.data?.message || "Error al cargar datos del servidor");
    }
  };

  if (error) return <div className="p-8 text-center text-red-500 font-bold">{error}</div>;
  if (!stats) return <div className="p-8 text-center text-slate-500">Cargando estadísticas...</div>;

  const cards = [
    { title: "Usuarios Totales", value: stats.totalUsers, icon: Users, color: "bg-blue-500", text: "text-blue-600" },
    { title: "Prescripciones", value: stats.totalPrescriptions, icon: FileText, color: "bg-purple-500", text: "text-purple-600" },
    { title: "Consumidas", value: stats.statusStats.CONSUMED || 0, icon: CheckCircle, color: "bg-green-500", text: "text-green-600" },
    { title: "Hoy", value: stats.prescriptionsToday, icon: Activity, color: "bg-orange-500", text: "text-orange-600" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Panel de Administración</h1>
        <p className="text-slate-500 text-sm">Monitoreo global del sistema de prescripciones</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex justify-between items-start">
              <div className={`${card.color} p-3 rounded-xl shadow-lg shadow-blue-500/10`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <TrendingUp className="h-4 w-4 text-slate-300" />
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">{card.title}</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Distribución de Estados */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            Estado de Prescripciones
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span>Activas</span>
                <span>{stats.statusStats.ACTIVE || 0}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full transition-all duration-1000" 
                  style={{ width: `${(stats.statusStats.ACTIVE || 0) / stats.totalPrescriptions * 100}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2 font-medium">
                <span>Consumidas</span>
                <span>{stats.statusStats.CONSUMED || 0}</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3">
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-1000" 
                  style={{ width: `${(stats.statusStats.CONSUMED || 0) / stats.totalPrescriptions * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Extra */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-950 p-8 rounded-3xl text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-4">Información del Sistema</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                <Calendar className="h-6 w-6 text-blue-400" />
                <div>
                  <p className="text-xs opacity-60">Última actualización</p>
                  <p className="font-medium">{new Date().toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl backdrop-blur-md border border-white/10">
                <Users2 className="h-6 w-6 text-purple-400" />
                <div>
                  <p className="text-xs opacity-60">Base de Datos</p>
                  <p className="font-medium text-green-400">Conectado (PostgreSQL)</p>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <ShieldCheck className="h-64 w-64" />
          </div>
        </div>
      </div>
      <div className="mt-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Users2 className="h-5 w-5 text-purple-500" />
            Trazabilidad del Sistema (Audit Logs)
          </h3>
          <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md uppercase tracking-widest text-slate-500">
            Últimas 100 acciones
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                <th className="px-6 py-4">Usuario</th>
                <th className="px-6 py-4">Acción</th>
                <th className="px-6 py-4">Detalles</th>
                <th className="px-6 py-4">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{log.user.email}</span>
                      <span className="text-[10px] text-slate-500 uppercase">{log.user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                      log.action.includes('CREATE') ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-mono text-slate-500">{log.details}</td>
                  <td className="px-6 py-4 text-xs text-slate-500">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ShieldCheck({ className }: { className?: string }) {
  return <div className={className}>🛡️</div>;
}
