import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Initiative, Priority } from '../types';
import { X, Save, Layout, DollarSign, Calendar, Tag, AlertCircle, Upload, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { compressImage } from '../utils';

interface Props {
    onClose: () => void;
    onSave: (initiative: Omit<Initiative, 'id'>) => void;
}

export const NewInitiativeModal: React.FC<Props> = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState<Omit<Initiative, 'id'>>({
        title: '',
        shortDescription: '',
        fullDescription: '',
        budget: 0,
        timeline: 'Q1 2026',
        priority: 'Media',
        category: 'Infraestructura',
        icon: 'Package',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
        subInitiatives: [],
        responsable: 'Administración'
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const compressedImage = await compressImage(file);
                setFormData({ ...formData, imageUrl: compressedImage });
            } catch (error) {
                console.error("Error compressing image:", error);
            }
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
        setFormData({ ...formData, subInitiatives: [...(formData.subInitiatives || []), newSub] });
    };

    const updateSubInitiative = (id: string, field: string, value: any) => {
        setFormData({
            ...formData,
            subInitiatives: formData.subInitiatives?.map(sub => 
                sub.id === id ? { ...sub, [field]: value } : sub
            )
        });
    };

    const removeSubInitiative = (id: string) => {
        setFormData({
            ...formData,
            subInitiatives: formData.subInitiatives?.filter(sub => sub.id !== id)
        });
    };

    const handleSubInitiativeImageUpload = async (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            try {
                const compressedImage = await compressImage(file);
                updateSubInitiative(id, 'imageUrl', compressedImage);
            } catch (error) {
                console.error("Error compressing image:", error);
            }
        }
    };

    const hasSubInitiatives = formData.subInitiatives && formData.subInitiatives.length > 0;
    const derivedBudget = hasSubInitiatives 
        ? formData.subInitiatives!.reduce((acc, sub) => acc + (Number(sub.budget) || 0), 0)
        : formData.budget;
        
    const derivedTimeline = hasSubInitiatives
        ? formData.subInitiatives![formData.subInitiatives!.length - 1].timeline
        : formData.timeline;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.shortDescription) {
            alert('Por favor completa los campos obligatorios.');
            return;
        }
        onSave({
            ...formData,
            budget: derivedBudget,
            timeline: derivedTimeline
        });
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 text-slate-800">
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
                    className="relative w-full md:max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Nueva Iniciativa</h2>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Plan Estratégico 2026</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Form Content */}
                    <form id="new-initiative-form" onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Title */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Título de la Propuesta *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Ej: Renovación de Luminarias"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold text-slate-900"
                                />
                            </div>

                            {/* Short Description */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Resumen Ejecutivo *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.shortDescription}
                                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                    placeholder="Una frase corta que resuma el proyecto"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                                />
                            </div>

                            {/* Full Description */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Descripción Detallada</label>
                                <textarea
                                    rows={4}
                                    value={formData.fullDescription}
                                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                                    placeholder="Explica el alcance, beneficios y detalles del proyecto..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-sm leading-relaxed"
                                />
                            </div>



                            {/* Category */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                    <Tag size={12} /> Categoría
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold"
                                >
                                    {['Infraestructura', 'Social', 'Gestión', 'Seguridad'].map(c => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Priority */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                    <AlertCircle size={12} /> Prioridad
                                </label>
                                <select
                                    value={formData.priority}
                                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold"
                                >
                                    {['Baja', 'Media', 'Alta', 'Urgente'].map(p => (
                                        <option key={p} value={p}>{p}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Budget */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                    <DollarSign size={12} /> Presupuesto ($)
                                </label>
                                <input
                                    type="number"
                                    value={formData.budget === 0 ? '' : formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
                                    placeholder="Ej: 5000"
                                    className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold ${hasSubInitiatives ? 'opacity-50 cursor-not-allowed' : 'text-slate-900'}`}
                                    disabled={hasSubInitiatives}
                                    title={hasSubInitiatives ? "El presupuesto se calcula con base en las sub-iniciativas." : "Presupuesto del proyecto principal"}
                                />
                            </div>

                            {/* Responsable */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                    <Layout size={12} /> Responsable
                                </label>
                                <select
                                    value={formData.responsable}
                                    onChange={(e) => setFormData({ ...formData, responsable: e.target.value as any })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold"
                                >
                                    {['Administración', 'Presidente', 'Directiva', 'Copropietarios', 'Coordinador Etapa 1', 'Coordinador Etapa 2', 'Coordinador Etapa 3', 'Coordinador Etapa 4'].map(r => (
                                        <option key={r} value={r}>{r}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Image Upload */}
                            <div className="md:col-span-2 mt-4 pt-6 border-t border-slate-100">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <ImageIcon size={14} /> Imagen de Portada
                                </label>
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <div className="w-full sm:w-48 h-32 rounded-xl overflow-hidden bg-slate-100 border-2 border-dashed border-slate-300 shrink-0">
                                        <img src={formData.imageUrl} alt="Vista previa" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 w-full space-y-2">
                                        <p className="text-sm text-slate-500 mb-2">Sube una imagen representativa. Si no subes ninguna, se usará una imagen por defecto en alta resolución.</p>
                                        <label className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors cursor-pointer w-full sm:w-auto">
                                            <Upload size={16} />
                                            Subir Imagen (JPG/PNG)
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Sub-initiatives */}
                            <div className="md:col-span-2 mt-2 pt-6 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-4">
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <Layout size={14} /> Sub-iniciativas ({formData.subInitiatives?.length || 0})
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addSubInitiative}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors"
                                    >
                                        <Plus size={14} /> Añadir Sub-iniciativa
                                    </button>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                                    {formData.subInitiatives?.length === 0 && (
                                        <div className="md:col-span-2 text-sm text-slate-400 text-center py-8 border-2 border-dashed rounded-xl">No hay iniciativas asociadas.</div>
                                    )}
                                    {formData.subInitiatives?.map((sub, index) => (
                                        <div key={sub.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative group hover:shadow-md transition-shadow flex flex-col">
                                            <button
                                                type="button"
                                                onClick={() => removeSubInitiative(sub.id)}
                                                className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm text-slate-700 hover:text-red-500 hover:bg-white transition-all p-2 rounded-full z-10 shadow-sm"
                                                title="Eliminar Sub-iniciativa"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <div className="h-32 w-full relative bg-slate-100 group">
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
                                                    placeholder={`Iniciativa ${index + 1}: Título`}
                                                    value={sub.title}
                                                    onChange={(e) => updateSubInitiative(sub.id, 'title', e.target.value)}
                                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold"
                                                    required
                                                />
                                                <textarea
                                                    rows={2}
                                                    placeholder="Breve descripción de la sub-iniciativa"
                                                    value={sub.description}
                                                    onChange={(e) => updateSubInitiative(sub.id, 'description', e.target.value)}
                                                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 text-sm resize-none"
                                                    required
                                                />
                                                <div className="grid grid-cols-2 gap-3 mt-auto">
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><DollarSign size={10}/> Presupuesto ($)</label>
                                                        <input
                                                            type="number"
                                                            value={sub.budget}
                                                            onChange={(e) => updateSubInitiative(sub.id, 'budget', parseInt(e.target.value) || 0)}
                                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><Calendar size={10}/> Cronograma</label>
                                                        <input
                                                            type="text"
                                                            placeholder="Ej: Q2 2026"
                                                            value={sub.timeline}
                                                            onChange={(e) => updateSubInitiative(sub.id, 'timeline', e.target.value)}
                                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><Tag size={10}/> Categoría</label>
                                                        <select
                                                            value={sub.category}
                                                            onChange={(e) => updateSubInitiative(sub.id, 'category', e.target.value)}
                                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold"
                                                        >
                                                            {['Infraestructura', 'Social', 'Gestión', 'Seguridad'].map(c => (
                                                                <option key={c} value={c}>{c}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1 flex items-center gap-1"><AlertCircle size={10}/> Prioridad</label>
                                                        <select
                                                            value={sub.priority}
                                                            onChange={(e) => updateSubInitiative(sub.id, 'priority', e.target.value)}
                                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold"
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
                            </div>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-100 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            form="new-initiative-form"
                            className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                        >
                            <Save size={18} />
                            Guardar Propuesta
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
