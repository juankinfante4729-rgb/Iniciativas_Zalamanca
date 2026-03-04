import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Initiative, Priority } from '../types';
import { X, Save, Layout, DollarSign, Calendar, Tag, AlertCircle } from 'lucide-react';

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
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.shortDescription) {
            alert('Por favor completa los campos obligatorios.');
            return;
        }
        onSave(formData);
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
                    <form id="new-initiative-form" onSubmit={handleSubmit} className="p-6 md:p-8 overflow-y-auto space-y-6">
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

                            {/* Budget */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                    <DollarSign size={12} /> Presupuesto (USD)
                                </label>
                                <input
                                    type="number"
                                    value={formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold"
                                />
                            </div>

                            {/* Timeline */}
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                                    <Calendar size={12} /> Cronograma
                                </label>
                                <input
                                    type="text"
                                    value={formData.timeline}
                                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                                    placeholder="Ej: Q3 2026"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold"
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
