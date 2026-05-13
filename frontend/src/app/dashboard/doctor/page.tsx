"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import api from "@/lib/api";
import { Plus, User, ClipboardList, Send, Trash2, Calendar, Pill } from "lucide-react";

interface Patient {
  id: string;
  identificationNumber: string;
  user: { email: string };
}

interface PrescriptionItem {
  name: string;
  dosage: string;
  quantity: number;
}

export default function DoctorDashboard() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [prescriptions, setPrescriptions] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  
  // Form State
  const [selectedPatient, setSelectedPatient] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState<PrescriptionItem[]>([{ name: "", dosage: "", quantity: 1 }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userRaw = Cookies.get("user");
    if (!userRaw) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(userRaw);
    if (user.role !== "DOCTOR") {
      router.push(`/dashboard/${user.role.toLowerCase()}`);
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [patientsRes, prescriptionsRes] = await Promise.all([
        api.get("/users/patients"),
        api.get("/prescriptions/my-prescriptions"),
      ]);
      setPatients(patientsRes.data);
      setPrescriptions(prescriptionsRes.data);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const addItem = () => setItems([...items, { name: "", dosage: "", quantity: 1 }]);
  const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
  
  const updateItem = (index: number, field: keyof PrescriptionItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/prescriptions", {
        patientId: selectedPatient,
        notes,
        items,
      });
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (err) {
      alert("Error al crear la prescripción");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedPatient("");
    setNotes("");
    setItems([{ name: "", dosage: "", quantity: 1 }]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Panel del Médico</h1>
          <p className="text-slate-500 text-sm">Gestiona y emite prescripciones para tus pacientes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-blue-500/20 font-medium"
        >
          <Plus className="h-5 w-5" />
          Nueva Prescripción
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Listado de Prescripciones */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <div className="flex items-center gap-2 mb-6">
              <ClipboardList className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-bold">Prescripciones Emitidas</h2>
            </div>

            <div className="space-y-4">
              {prescriptions.length === 0 && (
                <p className="text-center py-8 text-slate-500 italic">No has emitido prescripciones aún.</p>
              )}
              {prescriptions.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 hover:border-blue-200 dark:hover:border-blue-900 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{p.patient.user.email}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(p.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      p.status === 'ACTIVE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.items.map((item: any, i: number) => (
                      <span key={i} className="text-[10px] bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 px-2 py-1 rounded-md text-slate-600 dark:text-slate-300">
                        {item.name} ({item.dosage})
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Info lateral / Pacientes */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
            <h3 className="font-bold text-lg mb-2">Resumen</h3>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <p className="text-xs opacity-70">Emitidas</p>
                <p className="text-2xl font-bold">{prescriptions.length}</p>
              </div>
              <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
                <p className="text-xs opacity-70">Pacientes</p>
                <p className="text-2xl font-bold">{patients.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Nueva Prescripción */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <h2 className="text-xl font-bold">Crear Nueva Prescripción</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium mb-1">Paciente</label>
                <select
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={selectedPatient}
                  onChange={(e) => setSelectedPatient(e.target.value)}
                >
                  <option value="">Selecciona un paciente</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.user.email} ({p.identificationNumber})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Medicamentos</label>
                  <button type="button" onClick={addItem} className="text-xs text-blue-600 font-bold flex items-center gap-1">
                    <Plus className="h-3 w-3" /> Añadir otro
                  </button>
                </div>
                {items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-end bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                    <div className="col-span-5">
                      <input
                        placeholder="Nombre del medicamento"
                        className="w-full text-sm p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        value={item.name}
                        onChange={(e) => updateItem(index, 'name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-span-4">
                      <input
                        placeholder="Dosis (ej: 500mg)"
                        className="w-full text-sm p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        value={item.dosage}
                        onChange={(e) => updateItem(index, 'dosage', e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        placeholder="Cant."
                        className="w-full text-sm p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value))}
                        required
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      {items.length > 1 && (
                        <button type="button" onClick={() => removeItem(index)} className="text-red-500 p-2">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Notas adicionales</label>
                <textarea
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none h-24"
                  placeholder="Instrucciones adicionales para el paciente..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-600 dark:text-slate-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-bold flex justify-center items-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Send className="h-5 w-5" />}
                  Emitir Receta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return <Pill className={className} />;
}
