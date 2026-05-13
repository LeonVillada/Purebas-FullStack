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

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("/admin/stats");
      setStats(response.data);
    } catch (err) {
      console.error("Error fetching stats", err);
    }
  };

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
    </div>
  );
}

function ShieldCheck({ className }: { className?: string }) {
  return <div className={className}>🛡️</div>;
}
