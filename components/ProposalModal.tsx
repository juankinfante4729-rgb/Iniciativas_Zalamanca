import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Initiative, Priority } from '../types';
import { Icon } from './Icon';
import { X, Calendar, DollarSign, AlertCircle, Trash2 } from 'lucide-react';

interface Props {
  initiative: Initiative | null;
  onClose: () => void;
  onUpdate: (initiative: Initiative) => void;
  onDelete: (id: number) => void;
}

export const ProposalModal: React.FC<Props> = ({ initiative, onClose, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [tempPriority, setTempPriority] = React.useState<Priority>('Media');
  const [tempTimeline, setTempTimeline] = React.useState('');
  const [tempBudget, setTempBudget] = React.useState(0);
  const [tempCategory, setTempCategory] = React.useState<Initiative['category']>('Infraestructura');
  const [tempDescription, setTempDescription] = React.useState('');
  const [tempTitle, setTempTitle] = React.useState('');

  React.useEffect(() => {
    if (initiative) {
      setTempPriority(initiative.priority);
      setTempTimeline(initiative.timeline);
      setTempBudget(initiative.budget);
      setTempCategory(initiative.category);
      setTempDescription(initiative.fullDescription);
      setTempTitle(initiative.title);
      setIsEditing(false);
    }
  }, [initiative]);

  if (!initiative) return null;

  const handleSave = () => {
    onUpdate({
      ...initiative,
      title: tempTitle,
      priority: tempPriority,
      timeline: tempTimeline,
      budget: tempBudget,
      category: tempCategory,
      fullDescription: tempDescription
    });
    setIsEditing(false);
  };

  return (
    <AnimatePresence>
      {initiative && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full md:max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header Image */}
            <div className="h-48 md:h-64 w-full relative shrink-0">
              <img
                src={initiative.imageUrl}
                alt={initiative.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors border border-white/10"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-md border border-white/30`}>
                    {isEditing ? tempCategory : initiative.category}
                  </span>
                  {!isEditing && (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${initiative.priority === 'Urgente' ? 'bg-red-500 text-white' :
                      initiative.priority === 'Alta' ? 'bg-orange-500 text-white' : 'bg-white/20 text-white backdrop-blur-md'
                      }`}>
                      <AlertCircle size={12} />
                      {initiative.priority}
                    </span>
                  )}
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    className="w-full bg-white/10 border border-white/30 rounded-lg px-3 py-1.5 text-2xl md:text-3xl font-bold leading-tight text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                    placeholder="Título de la iniciativa"
                  />
                ) : (
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight">{initiative.title}</h2>
                )}
              </div>
            </div>

            {/* Content Scrollable */}
            <div className="p-6 md:p-8 overflow-y-auto">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Descripción y Alcance</h3>
                  {isEditing ? (
                    <textarea
                      value={tempDescription}
                      onChange={(e) => setTempDescription(e.target.value)}
                      className="w-full bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-slate-700 leading-relaxed text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/20 min-h-[150px] resize-y"
                    />
                  ) : (
                    <p className="text-slate-700 leading-relaxed text-base md:text-lg">
                      {initiative.fullDescription}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`p-5 rounded-xl border flex flex-col justify-between transition-colors ${isEditing ? 'bg-yellow-50 border-yellow-200' : 'bg-emerald-50/50 border-emerald-100'}`}>
                    <div className={`flex items-center gap-2 mb-2 ${isEditing ? 'text-yellow-700' : 'text-emerald-600'}`}>
                      <DollarSign size={20} />
                      <span className="text-xs font-bold uppercase tracking-wider">Presupuesto Estimado</span>
                    </div>
                    <div>
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <span className="text-xl font-bold text-slate-900">$</span>
                          <input
                            type="number"
                            value={tempBudget}
                            onChange={(e) => setTempBudget(parseInt(e.target.value) || 0)}
                            className="w-full bg-white border border-yellow-300 rounded-lg px-3 py-1.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
                          />
                        </div>
                      ) : (
                        <p className="text-3xl font-bold text-emerald-900 tracking-tight">${initiative.budget.toLocaleString()}</p>
                      )}
                      <p className="text-xs text-emerald-600/80 mt-1 font-medium">Cotización local (Quito, EC)</p>
                    </div>
                  </div>

                  <div className={`p-5 rounded-xl border flex flex-col justify-between transition-colors ${isEditing ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50/50 border-blue-100'}`}>
                    <div className={`flex items-center gap-2 mb-2 ${isEditing ? 'text-yellow-700' : 'text-blue-600'}`}>
                      <Calendar size={20} />
                      <span className="text-xs font-bold uppercase tracking-wider">Implementación</span>
                    </div>
                    <div>
                      {isEditing ? (
                        <input
                          type="text"
                          value={tempTimeline}
                          onChange={(e) => setTempTimeline(e.target.value)}
                          className="w-full bg-white border border-yellow-300 rounded-lg px-3 py-1.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-yellow-500/20"
                        />
                      ) : (
                        <p className="text-2xl font-bold text-blue-900">{initiative.timeline}</p>
                      )}
                      <p className="text-xs text-blue-600/80 mt-1 font-medium">Fecha estimada</p>
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Categoría</h3>
                      <select
                        value={tempCategory}
                        onChange={(e) => setTempCategory(e.target.value as any)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500/20 shadow-sm"
                      >
                        {['Infraestructura', 'Social', 'Gestión', 'Seguridad'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Prioridad</h3>
                      <div className="flex flex-wrap gap-2">
                        {(['Baja', 'Media', 'Alta', 'Urgente'] as Priority[]).map((p) => (
                          <button
                            key={p}
                            onClick={() => setTempPriority(p)}
                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${tempPriority === p
                              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                              }`}
                          >
                            {p}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
              {isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2.5 bg-white border border-gray-300 text-slate-700 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20"
                  >
                    Guardar Cambios
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      if (confirm('¿Estás seguro de que deseas eliminar esta propuesta?')) {
                        onDelete(initiative.id);
                      }
                    }}
                    className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors mr-auto"
                    title="Eliminar Propuesta"
                  >
                    <Trash2 size={20} />
                  </button>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-2.5 bg-white border border-slate-900 text-slate-900 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors"
                  >
                    Editar Propuesta
                  </button>
                  <button
                    onClick={onClose}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
                  >
                    Entendido
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};