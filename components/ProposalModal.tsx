import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Initiative, Priority } from '../types';
import { Icon } from './Icon';
import { X, Calendar, DollarSign, AlertCircle, Trash2, Layout, Plus, Upload, Image as ImageIcon, Tag } from 'lucide-react';

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
  const [tempShortDescription, setTempShortDescription] = React.useState('');
  const [tempImageUrl, setTempImageUrl] = React.useState('');
  const [tempSubInitiatives, setTempSubInitiatives] = React.useState<any[]>([]);
  const [tempResponsable, setTempResponsable] = React.useState<Initiative['responsable']>('Administración');

  React.useEffect(() => {
    if (initiative) {
      setTempPriority(initiative.priority);
      setTempTimeline(initiative.timeline);
      setTempBudget(initiative.budget);
      setTempCategory(initiative.category);
      setTempDescription(initiative.fullDescription);
      setTempShortDescription(initiative.shortDescription);
      setTempTitle(initiative.title);
      setTempImageUrl(initiative.imageUrl);
      setTempSubInitiatives(initiative.subInitiatives || []);
      setTempResponsable(initiative.responsable || 'Administración');
      setIsEditing(false);
    }
  }, [initiative]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addSubInitiative = () => {
    const newSub = {
      id: Date.now().toString(),
      title: '',
      description: '',
      budget: 0,
      timeline: '',
      priority: 'Media' as Priority,
      category: 'Infraestructura' as Initiative['category'],
      imageUrl: 'https://images.unsplash.com/photo-1541888081622-1d5e5b3b1238?auto=format&fit=crop&w=800&q=80'
    };
    setTempSubInitiatives([...tempSubInitiatives, newSub]);
  };

  const handleSubInitiativeImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSubInitiative(id, 'imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateSubInitiative = (id: string, field: string, value: any) => {
    setTempSubInitiatives(tempSubInitiatives.map(sub => 
      sub.id === id ? { ...sub, [field]: value } : sub
    ));
  };

  const removeSubInitiative = (id: string) => {
    setTempSubInitiatives(tempSubInitiatives.filter(sub => sub.id !== id));
  };

  if (!initiative) return null;

  const hasSubInitiatives = tempSubInitiatives && tempSubInitiatives.length > 0;
  const derivedBudget = hasSubInitiatives
    ? tempSubInitiatives.reduce((acc, sub) => acc + (Number(sub.budget) || 0), 0)
    : tempBudget;
  const derivedTimeline = hasSubInitiatives
    ? tempSubInitiatives[tempSubInitiatives.length - 1].timeline
    : tempTimeline;

  const handleSave = () => {
    onUpdate({
      ...initiative,
      title: tempTitle,
      shortDescription: tempShortDescription,
      priority: tempPriority,
      timeline: derivedTimeline,
      budget: derivedBudget,
      category: tempCategory,
      fullDescription: tempDescription,
      imageUrl: tempImageUrl,
      subInitiatives: tempSubInitiatives,
      responsable: tempResponsable
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
                src={isEditing ? tempImageUrl : initiative.imageUrl}
                alt={initiative.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {isEditing && (
                 <div className="absolute top-4 left-4">
                    <label className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-lg">
                        <Upload size={14} />
                        Cambiar Portada
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                    </label>
                 </div>
              )}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors border border-white/10"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex flex-wrap items-center gap-2 mb-2">
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
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/80 text-white backdrop-blur-md border border-white/30`}>
                    <Layout size={12} />
                    {isEditing ? tempResponsable : (initiative.responsable || 'Administración')}
                  </span>
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
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Resumen Ejecutivo *</h3>
                  {isEditing ? (
                    <input
                      type="text"
                      value={tempShortDescription}
                      onChange={(e) => setTempShortDescription(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                      placeholder="Una frase corta que resuma el proyecto"
                    />
                  ) : (
                    <p className="text-slate-600 font-medium text-lg leading-relaxed">
                      {initiative.shortDescription}
                    </p>
                  )}
                </div>

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

                    <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 sm:col-span-2">
                      <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Responsable</h3>
                      <select
                        value={tempResponsable}
                        onChange={(e) => setTempResponsable(e.target.value as any)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500/20 shadow-sm"
                      >
                        {['Administración', 'Presidente', 'Coordinador Etapa 1', 'Coordinador Etapa 2', 'Coordinador Etapa 3', 'Coordinador Etapa 4'].map(r => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Sub-initiatives Section */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Layout size={14} /> Sub-iniciativas
                      {isEditing && (
                        <button
                          type="button"
                          onClick={addSubInitiative}
                          className="ml-auto inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
                        >
                          <Plus size={14} /> Añadir Sub-iniciativa
                        </button>
                      )}
                  </h3>

                  {isEditing ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {tempSubInitiatives.length === 0 && (
                            <div className="md:col-span-2 text-sm text-slate-400 text-center py-8 border-2 border-dashed rounded-xl">No hay fases o sub-iniciativas asociadas.</div>
                        )}
                        {tempSubInitiatives.map((sub, index) => (
                          <div key={sub.id} className="bg-yellow-50/50 rounded-2xl border border-yellow-200 shadow-sm overflow-hidden relative group hover:shadow-md transition-shadow flex flex-col">
                              <button
                                  type="button"
                                  onClick={() => removeSubInitiative(sub.id)}
                                  className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-slate-700 hover:text-red-500 hover:bg-white transition-all p-2 rounded-full z-10 shadow-sm"
                                  title="Eliminar Sub-iniciativa"
                              >
                                  <Trash2 size={16} />
                              </button>
                              <div className="h-32 w-full relative bg-yellow-100 group">
                                  <img src={sub.imageUrl || 'https://images.unsplash.com/photo-1541888081622-1d5e5b3b1238?auto=format&fit=crop&w=800&q=80'} alt={sub.title} className="w-full h-full object-cover" />
                                  <label className="absolute inset-0 bg-slate-900/0 hover:bg-slate-900/40 transition-colors flex items-center justify-center cursor-pointer group-hover:opacity-100">
                                      <span className="opacity-0 group-hover:opacity-100 bg-white/90 text-slate-900 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all">
                                          <ImageIcon size={14} /> Cambiar Foto
                                      </span>
                                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleSubInitiativeImageUpload(sub.id, e)} />
                                  </label>
                              </div>
                              <div className="p-5 flex-1 flex flex-col gap-4">
                                  <input
                                      type="text"
                                      placeholder={`Fase ${index + 1}: Título`}
                                      value={sub.title}
                                      onChange={(e) => updateSubInitiative(sub.id, 'title', e.target.value)}
                                      className="w-full px-3 py-2 bg-white border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500/20 text-sm font-bold"
                                  />
                                  <textarea
                                      rows={2}
                                      placeholder="Breve descripción de la sub-iniciativa"
                                      value={sub.description}
                                      onChange={(e) => updateSubInitiative(sub.id, 'description', e.target.value)}
                                      className="w-full px-3 py-2 bg-white border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500/20 text-sm resize-none"
                                  />
                                  <div className="grid grid-cols-2 gap-3 mt-auto">
                                      <div>
                                          <label className="block text-[10px] font-bold text-yellow-700 uppercase mb-1 flex items-center gap-1"><DollarSign size={10}/> Presupuesto ($)</label>
                                          <input
                                              type="number"
                                              value={sub.budget}
                                              onChange={(e) => updateSubInitiative(sub.id, 'budget', parseInt(e.target.value) || 0)}
                                              className="w-full px-3 py-2 bg-white border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500/20 text-sm font-bold"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-[10px] font-bold text-yellow-700 uppercase mb-1 flex items-center gap-1"><Calendar size={10}/> Cronograma</label>
                                          <input
                                              type="text"
                                              placeholder="Ej: Q2 2026"
                                              value={sub.timeline}
                                              onChange={(e) => updateSubInitiative(sub.id, 'timeline', e.target.value)}
                                              className="w-full px-3 py-2 bg-white border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500/20 text-sm font-bold"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-[10px] font-bold text-yellow-700 uppercase mb-1 flex items-center gap-1"><Tag size={10}/> Categoría</label>
                                          <select
                                              value={sub.category}
                                              onChange={(e) => updateSubInitiative(sub.id, 'category', e.target.value)}
                                              className="w-full px-3 py-2 bg-white border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500/20 text-sm font-bold"
                                          >
                                              {['Infraestructura', 'Social', 'Gestión', 'Seguridad'].map(c => (
                                                  <option key={c} value={c}>{c}</option>
                                              ))}
                                          </select>
                                      </div>
                                      <div>
                                          <label className="block text-[10px] font-bold text-yellow-700 uppercase mb-1 flex items-center gap-1"><AlertCircle size={10}/> Prioridad</label>
                                          <select
                                              value={sub.priority}
                                              onChange={(e) => updateSubInitiative(sub.id, 'priority', e.target.value)}
                                              className="w-full px-3 py-2 bg-white border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500/20 text-sm font-bold"
                                          >
                                              {['Baja', 'Media', 'Alta', 'Urgente'].map(p => (
                                                  <option key={p} value={p}>{p}</option>
                                              ))}
                                          </select>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      ))}
                    </div>
                  ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(!initiative.subInitiatives || initiative.subInitiatives.length === 0) ? (
                          <div className="md:col-span-2 text-sm text-slate-400 text-center py-8 border-2 border-dashed rounded-xl">Esta iniciativa no tiene fases ni sub-proyectos detallados.</div>
                        ) : (
                          initiative.subInitiatives.map((sub, idx) => (
                             <div key={sub.id || idx} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                                <div className="h-32 w-full bg-slate-100">
                                    <img src={sub.imageUrl || 'https://images.unsplash.com/photo-1541888081622-1d5e5b3b1238?auto=format&fit=crop&w=800&q=80'} alt={sub.title} className="w-full h-full object-cover" />
                                </div>
                                <div className="p-5 flex-1 flex flex-col border-t border-slate-100">
                                   <div className="flex items-center gap-2 mb-3 flex-wrap">
                                       <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600`}>
                                           {sub.category}
                                       </span>
                                       <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold ${sub.priority === 'Urgente' ? 'bg-red-50 text-red-600 border border-red-100' :
                                         sub.priority === 'Alta' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-slate-100 text-slate-600'
                                         }`}>
                                         {sub.priority}
                                       </span>
                                   </div>
                                   <h4 className="font-bold text-slate-800 text-sm mb-1">{sub.title}</h4>
                                   <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-1">{sub.description}</p>
                                   <div className="flex justify-between items-center border-t border-slate-50 pt-3 mt-auto">
                                      <div>
                                        <span className="text-[10px] block uppercase font-bold text-slate-400 tracking-wider">Presupuesto</span>
                                        <span className="block text-sm font-bold text-emerald-600">${(sub.budget || 0).toLocaleString()}</span>
                                      </div>
                                      <div className="text-right">
                                        <span className="text-[10px] flex items-center justify-end gap-1 uppercase font-bold text-slate-400 tracking-wider"><Calendar size={10} /> Plazo</span>
                                        <span className="block text-sm font-bold text-blue-600">{sub.timeline}</span>
                                      </div>
                                   </div>
                                </div>
                             </div>
                          ))
                        )}
                      </div>
                  )}
                </div>

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