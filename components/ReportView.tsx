import React from 'react';
import { Initiative } from '../types';
import { X, Printer, Calendar, CheckCircle2 } from 'lucide-react';

interface Props {
    initiatives: Initiative[];
    onClose: () => void;
}

export const ReportView: React.FC<Props> = ({ initiatives, onClose }) => {
    const totalBudget = initiatives.reduce((acc, curr) => acc + curr.budget, 0);
    const date = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="fixed inset-0 z-[60] bg-white overflow-y-auto print:static print:overflow-visible print:bg-white report-container font-sans text-slate-900">
            {/* Controls - Hidden on Print */}
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md text-white p-4 flex justify-between items-center z-[70] print:hidden shadow-xl">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <div>
                        <h2 className="font-bold text-lg leading-tight">Reporte Ejecutivo</h2>
                        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest leading-none mt-0.5">Vista Previa e Impresión</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20 active:scale-95 text-sm"
                    >
                        <Printer size={18} />
                        Imprimir / Guardar PDF
                    </button>
                </div>
            </div>

            {/* Report Content */}
            <div className="max-w-5xl mx-auto p-12 md:p-20 print:p-0 print:max-w-none">
                {/* Executive Letterhead */}
                <header className="flex justify-between items-end border-b-2 border-slate-900 pb-10 mb-12">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center text-white font-extrabold text-3xl shrink-0">A</div>
                            <div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Alcázar de Salamanca</h1>
                                <p className="text-slate-500 font-bold tracking-[0.2em] text-[10px] mt-2 uppercase leading-none">Consejo de Administración 2026</p>
                            </div>
                        </div>
                        <div className="space-y-0.5 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                            <p>Distrito Metropolitano de Quito, Ecuador</p>
                            <p className="text-slate-900 font-black">{date}</p>
                        </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                        <div className="bg-slate-900 text-white px-3 py-1 text-[9px] font-black uppercase tracking-[0.3em] mb-4">Documento Oficial</div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-1 leading-none">REPORTE</h2>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Plan Maestro de Iniciativas</p>
                    </div>
                </header>

                {/* Executive Summary Block */}
                <div className="mb-12 break-inside-avoid">
                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                        <span className="w-8 h-[2px] bg-slate-900"></span>
                        Resumen Ejecutivo / Key Metrics
                    </h3>
                    <div className="grid grid-cols-4 gap-0 border-y border-slate-200 divide-x divide-slate-200 py-6">
                        <div className="px-6 text-center">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Total Proyectos</p>
                            <p className="text-2xl font-black text-slate-900">{initiatives.length}</p>
                        </div>
                        <div className="px-6 text-center">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Inversión Total</p>
                            <p className="text-2xl font-black text-slate-900">${totalBudget.toLocaleString()}</p>
                        </div>
                        <div className="px-6 text-center">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Prioridad Crítica</p>
                            <p className="text-2xl font-black text-red-600">{initiatives.filter(i => i.priority === 'Urgente').length}</p>
                        </div>
                        <div className="px-6 text-center">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">Estado de Plan</p>
                            <p className="text-2xl font-black text-emerald-600">APROBADO</p>
                        </div>
                    </div>
                </div>

                {/* Main Initiatives Table */}
                <div className="mb-12 overflow-visible">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b-2 border-slate-900">
                                <th className="text-left py-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest w-16">Item</th>
                                <th className="text-left py-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Iniciativa y Alcance Breve</th>
                                <th className="text-left py-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">Categoría</th>
                                <th className="text-center py-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32">Prioridad</th>
                                <th className="text-right py-4 px-2 text-[10px] font-black text-slate-400 uppercase tracking-widest w-32 text-slate-900 font-black">Presupuesto</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {initiatives.map((item, index) => (
                                <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors break-inside-avoid">
                                    <td className="py-5 px-2 text-xs font-black text-slate-300">
                                        {(index + 1).toString().padStart(2, '0')}
                                    </td>
                                    <td className="py-5 px-2">
                                        <h4 className="font-bold text-slate-900 text-sm mb-1">{item.title}</h4>
                                        <p className="text-slate-500 text-[11px] leading-relaxed max-w-md">{item.shortDescription}</p>
                                        <div className="mt-2 flex items-center gap-2 text-[9px] font-bold text-slate-400">
                                            <Calendar size={10} /> {item.timeline}
                                        </div>
                                    </td>
                                    <td className="py-5 px-2">
                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded leading-none">
                                            {item.category}
                                        </span>
                                    </td>
                                    <td className="py-5 px-2 text-center">
                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded leading-none
                                            ${item.priority === 'Urgente' ? 'bg-red-600 text-white' :
                                                item.priority === 'Alta' ? 'bg-slate-900 text-white' :
                                                    'bg-slate-100 text-slate-600'}
                                        `}>
                                            {item.priority}
                                        </span>
                                    </td>
                                    <td className="py-5 px-2 text-right">
                                        <span className="text-sm font-black text-slate-900">${item.budget.toLocaleString()}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr className="border-t-2 border-slate-900">
                                <td colSpan={4} className="py-6 px-2 text-slate-900 text-xs text-right font-black uppercase tracking-widest">Inversión Final Proyectada:</td>
                                <td className="py-6 px-2 text-right text-xl font-black text-slate-900">${totalBudget.toLocaleString()}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Verification/Legal footer */}
                <section className="mt-20 pt-10 border-t border-slate-100 break-inside-avoid">
                    <div className="bg-slate-50 p-8 rounded-2xl flex justify-between items-center border border-slate-200">
                        <div className="max-w-xl">
                            <h4 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-3 flex items-center gap-2 leading-none">
                                <CheckCircle2 size={14} className="text-emerald-600" />
                                Certificación de Planificación Técnica
                            </h4>
                            <p className="text-[9px] text-slate-500 leading-relaxed font-medium">
                                El presente reporte consolida las propuestas vecinales analizadas para el ciclo 2026. Este documento ha sido estructurado para facilitar la toma de decisiones por parte de la Asamblea General y la Administración del conjunto residencial Alcázar de Salamanca. Los valores reflejados son estimaciones oficiales consolidadas a la fecha de emisión del reporte.
                            </p>
                        </div>
                        <div className="text-center shrink-0 ml-12">
                            <div className="w-56 h-px bg-slate-900 mb-2 mx-auto"></div>
                            <p className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] leading-none">Administración Central</p>
                            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1 italic">Firma Electrónica Autorizada</p>
                        </div>
                    </div>
                    <p className="text-center text-[8px] text-slate-400 mt-12 font-black uppercase tracking-[0.6em]">Fin del Documento Maestro 2026</p>
                </section>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    @page { 
                        margin: 15mm; 
                        size: portrait;
                    }
                    body { 
                        overflow: visible !important;
                        -webkit-print-color-adjust: exact !important; 
                        print-color-adjust: exact !important; 
                        background: white !important;
                    }
                    .report-container {
                        position: static !important;
                        overflow: visible !important;
                        display: block !important;
                        width: 100% !important;
                    }
                    
                    /* Prevenir cortes feos */
                    .break-inside-avoid {
                        page-break-inside: avoid;
                        break-inside: avoid;
                    }

                    /* Gestión de Tablas */
                    table { 
                        page-break-inside: auto; 
                        width: 100% !important;
                    }
                    tr { 
                        page-break-inside: avoid; 
                        page-break-after: auto; 
                    }
                    thead { 
                        display: table-header-group; 
                    }
                    tfoot { 
                        display: table-footer-group; 
                    }
                }

                /* UI Scrolling Optimization for Screen */
                @media screen {
                    .report-container::-webkit-scrollbar {
                        width: 10px;
                    }
                    .report-container::-webkit-scrollbar-track {
                        background: #f8fafc;
                    }
                    .report-container::-webkit-scrollbar-thumb {
                        background: #334155;
                        border-radius: 10px;
                        border: 3px solid #f8fafc;
                    }
                    .report-container::-webkit-scrollbar-thumb:hover {
                        background: #0f172a;
                    }
                }
            `}</style>
        </div>
    );
};
