"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Download, CheckCircle, Clock, Pill, User, FileText, Check } from "lucide-react";

export default function PatientDashboard() {
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.get("/prescriptions/my-prescriptions");
      setPrescriptions(response.data);
    } catch (err) {
      console.error("Error fetching prescriptions", err);
    }
  };

  const handleConsume = async (id: string) => {
    if (!confirm("¿Confirmas que has consumido este medicamento?")) return;
    setLoadingId(id);
    try {
      await api.patch(`/prescriptions/${id}/consume`);
      fetchData();
    } catch (err) {
      alert("Error al actualizar el estado");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDownload = async (id: string) => {
    try {
      const response = await api.get(`/prescriptions/${id}/pdf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescripcion-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Error al descargar el PDF");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mis Prescripciones</h1>
        <p className="text-slate-500 text-sm">Gestiona tus recetas médicas y descarga tus PDFs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prescriptions.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">No tienes prescripciones registradas aún.</p>
          </div>
        )}

        {prescriptions.map((p) => (
          <div key={p.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <div className="p-5 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Pill className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  ID: {p.id.slice(0, 8)}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight ${
                p.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500'
              }`}>
                {p.status === 'ACTIVE' ? 'Activa' : 'Consumida'}
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Médico Responsable</p>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <User className="h-4 w-4 text-slate-500" />
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white text-sm">{p.doctor.user.email}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-slate-500">Medicamentos</p>
                <div className="flex flex-col gap-1.5">
                  {p.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-2 rounded-lg text-xs">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-slate-500">{item.dosage} × {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  onClick={() => handleDownload(p.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white py-2.5 rounded-xl text-sm font-bold transition-all"
                >
                  <Download className="h-4 w-4" />
                  PDF
                </button>
                
                {p.status === 'ACTIVE' ? (
                  <button
                    onClick={() => handleConsume(p.id)}
                    disabled={loadingId === p.id}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
                  >
                    {loadingId === p.id ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
                    ) : (
                      <CheckCircle className="h-4 w-4" />
                    )}
                    Consumir
                  </button>
                ) : (
                  <div className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-600 dark:bg-green-900/10 dark:text-green-500 py-2.5 rounded-xl text-sm font-bold">
                    <Check className="h-4 w-4" />
                    Listado
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
