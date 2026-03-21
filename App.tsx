import React, { useState, useMemo } from 'react';
import { Menu, AlignLeft, Home, FileText, Users, User, Search, Bell, LayoutDashboard, ArrowUpRight, Calendar, Layers, LayoutGrid, List, Briefcase } from 'lucide-react';
import { initiatives } from './data';
import { Initiative, Priority } from './types';
import { Icon } from './components/Icon';
import { ProposalModal } from './components/ProposalModal';
import { ReportView } from './components/ReportView';
import { NewInitiativeModal } from './components/NewInitiativeModal';

const App: React.FC = () => {
    const [allInitiatives, setAllInitiatives] = useState<Initiative[]>([]);
    const [lastUpdated, setLastUpdated] = useState<string>('Cargando...');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todos');
    const [showReport, setShowReport] = useState(false);
    const [showNewModal, setShowNewModal] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Initial load from server
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/initiatives');
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.initiatives) {
                        setAllInitiatives(data.initiatives);
                        setLastUpdated(data.lastUpdated || 'Enero 2026');
                    } else {
                        console.error('Data format incorrect:', data);
                        setLastUpdated('Error de formato');
                    }
                } else {
                    const errorText = await response.text();
                    console.error('Server error:', response.status, errorText);
                    setLastUpdated(`Error ${response.status}`);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Helper to save to server
    // Helper to save single item to server
    const saveSingleToServer = async (initiative: Initiative, updatedDate: string) => {
        try {
            const res = await fetch(`/api/initiatives/${initiative.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ initiative, lastUpdated: updatedDate })
            });
            if (!res.ok) {
                const text = await res.text();
                console.error('Server save failed:', res.status, text);
                alert(`Error al guardar en el servidor: código ${res.status}. ${res.status === 413 ? 'La imagen es demasiado pesada.' : text}`);
            }
        } catch (error) {
            console.error('Error saving data:', error);
            alert(`Error de red al intentar guardar: ${error}`);
        }
    };

    // Helper to delete from server
    const deleteFromServer = async (id: number, updatedDate: string) => {
        try {
            const res = await fetch(`/api/initiatives/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lastUpdated: updatedDate })
            });
            if (!res.ok) {
                const text = await res.text();
                console.error('Server delete failed:', res.status, text);
            }
        } catch (error) {
            console.error('Error deleting data:', error);
        }
    };

    const updateInitiative = (updated: Initiative) => {
        const newInitiatives = allInitiatives.map(item => item.id === updated.id ? updated : item);
        setAllInitiatives(newInitiatives);
        setSelectedInitiative(updated);

        const now = new Date();
        const formattedDate = now.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
        setLastUpdated(formattedDate);
        saveSingleToServer(updated, formattedDate);
    };

    const addInitiative = (newInit: Omit<Initiative, 'id'>) => {
        // Find highest existing ID to avoid collisions
        const nextId = allInitiatives.length > 0 ? Math.max(...allInitiatives.map(i => i.id)) + 1 : 1;
        const initiative: Initiative = { ...newInit, id: nextId };
        const newInitiatives = [initiative, ...allInitiatives];
        setAllInitiatives(newInitiatives);
        setShowNewModal(false);

        const now = new Date();
        const formattedDate = now.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
        setLastUpdated(formattedDate);
        saveSingleToServer(initiative, formattedDate);
    };

    const deleteInitiative = (id: number) => {
        const newInitiatives = allInitiatives.filter(item => item.id !== id);
        setAllInitiatives(newInitiatives);
        setSelectedInitiative(null);

        const now = new Date();
        const formattedDate = now.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
        setLastUpdated(formattedDate);
        deleteFromServer(id, formattedDate);
    };

    // Priority weights (lower is more critical)
    const priorityWeights: Record<Priority, number> = {
        'Urgente': 0,
        'Alta': 1,
        'Media': 2,
        'Baja': 3
    };

    const sortedInitiatives = useMemo(() => {
        return [...allInitiatives].sort((a, b) =>
            priorityWeights[a.priority] - priorityWeights[b.priority]
        );
    }, [allInitiatives]);

    // Calculate global stats (based on all data)
    const totalBudget = allInitiatives.reduce((acc, curr) => acc + curr.budget, 0);
    const urgentCount = allInitiatives.filter(i => i.priority === 'Urgente').length;

    // Filter initiatives based on search and category
    const filteredInitiatives = useMemo(() => {
        return sortedInitiatives.filter(item => {
            const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
            const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, selectedCategory, sortedInitiatives]);

    return (
        <React.Fragment>
            <div className="min-h-screen bg-gray-50 font-sans text-slate-800 flex flex-col md:flex-row print:hidden">

                {/* Desktop Sidebar */}
                <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 fixed inset-y-0 z-30">
                    <div className="p-6 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-emerald-200">A</div>
                            <h1 className="font-bold text-lg text-slate-900 tracking-tight">Alcázar 2026</h1>
                        </div>
                    </div>
                    <nav className="flex-1 p-4 space-y-1">
                        <SidebarItem icon={<Home size={20} />} label="Inicio" active />
                    </nav>
                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 border border-slate-200">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Admin</p>
                                <p className="text-xs text-slate-500">Ver Perfil</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Wrapper */}
                <div className="flex-1 md:ml-64 relative min-h-screen flex flex-col">

                    {/* Header */}
                    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md px-6 py-4 flex items-center justify-between border-b border-gray-100">
                        <div className="flex items-center gap-4 md:hidden">
                            {/* Mobile Menu Button - Visual only for now as sidebar is hidden on mobile */}
                            <div className="p-2 -ml-2 rounded-full text-slate-700">
                                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">A</div>
                            </div>
                            <span className="font-bold text-slate-900 text-lg">Alcázar</span>
                        </div>

                        {/* Desktop Search/Actions */}
                        <div className="hidden md:flex items-center gap-4 w-full max-w-4xl mx-auto">
                            <div className="relative w-full max-w-md">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar iniciativa..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border-transparent focus:bg-white focus:border-emerald-500 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 md:gap-4">
                            <button
                                onClick={() => setShowNewModal(true)}
                                className="hidden md:flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                            >
                                <ArrowUpRight size={18} />
                                Nueva Iniciativa
                            </button>
                            <button
                                onClick={() => setShowReport(true)}
                                className="hidden md:flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
                            >
                                <FileText size={18} />
                                Reporte Completo
                            </button>
                            <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors hidden md:block">
                                <Bell size={20} />
                            </button>
                            <button className="md:hidden flex items-center gap-1 text-emerald-600 font-semibold text-sm bg-emerald-50 px-3 py-1.5 rounded-lg">
                                <AlignLeft size={16} />
                            </button>
                        </div>
                    </header>

                    {/* Content Scrollable Area */}
                    <main className="flex-1 p-5 md:p-8 lg:p-10 overflow-y-auto relative">
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/50 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-emerald-700 font-bold animate-pulse">Sincronizando datos...</p>
                                </div>
                            </div>
                        )}
                        <div className="max-w-7xl mx-auto space-y-10">

                            {/* Hero / Stats Section */}
                            <div>
                                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
                                    <div>
                                        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B1A28] mb-1.5 tracking-tight">
                                            Propuestas de Mejora
                                        </h2>
                                        <p className="text-slate-500 font-medium leading-relaxed max-w-2xl text-sm">
                                            Plan estratégico 2026-2027 para el conjunto Alcázar de Salamanca.
                                        </p>
                                    </div>
                                    <div className="hidden md:block">
                                        <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-bold bg-[#E6F5EC] text-[#52A37D]">
                                            <Calendar size={14} className="mr-2" />
                                            Actualizado: {lastUpdated}
                                        </span>
                                    </div>
                                </div>

                                {/* Mobile Search Input (Visible only on mobile) */}
                                <div className="md:hidden mb-5 relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Buscar iniciativa..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 focus:border-[#52A37D] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#52A37D]/20 transition-all shadow-sm"
                                    />
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                                    {/* Budget Card - Mockup Design */}
                                    <div className="lg:col-span-8 bg-[#52A37D] rounded-3xl p-5 lg:p-6 text-white shadow-lg relative overflow-hidden group flex flex-col justify-between">
                                        <div className="relative z-10 w-full">
                                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4 mt-1">
                                                <div>
                                                    <p className="text-emerald-50 text-[10px] font-bold uppercase tracking-widest mb-1 opacity-90">PRESUPUESTO TOTAL ESTIMADO</p>
                                                    <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-sm">
                                                        ${allInitiatives.reduce((acc, i) => acc + i.budget, 0).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/20 self-start">
                                                    <span className="text-white font-bold flex items-center gap-1.5 text-xs">
                                                        <FileText size={14} />
                                                        {allInitiatives.length} Proyectos Totales
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-5">
                                                <div className="w-full bg-black/10 h-2 rounded-full overflow-hidden mb-2">
                                                    <div className="bg-white h-full w-[35%] rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] relative"></div>
                                                </div>
                                                <div className="flex justify-between text-[11px] text-emerald-50 font-medium px-1">
                                                    <span>Ejecución proyectada 2026</span>
                                                    <span>35% Financiado</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Urgent Stats Card - Mockup Design */}
                                    <div className="lg:col-span-4 bg-white border border-gray-100 rounded-3xl p-5 lg:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-start relative">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-[#FFF4F4] rounded-lg flex items-center justify-center text-[#E46B6B] border border-red-50">
                                                <Briefcase className="w-5 h-5" />
                                            </div>
                                            <h3 className="text-3xl font-extrabold text-[#0B1A28]">{urgentCount}</h3>
                                        </div>
                                        <div className="mb-4">
                                            <p className="text-slate-500 font-medium text-sm leading-tight">Iniciativas Urgentes</p>
                                        </div>

                                        <div className="flex flex-wrap gap-2 mt-auto">
                                            {allInitiatives.filter(i => i.priority === 'Urgente').slice(0, 2).map(i => (
                                                <span key={i.id} className="text-[10px] font-bold bg-[#FFF4F4] text-[#E46B6B] px-2.5 py-1 rounded-md border border-red-50">
                                                    {i.title}
                                                </span>
                                            ))}
                                            {urgentCount > 2 && (
                                                <span className="text-[10px] font-bold bg-gray-50 text-slate-500 px-2.5 py-1 rounded-md border border-gray-100">
                                                    +{urgentCount - 2}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Grid/List Section */}
                            <div>
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pt-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white border border-gray-200 rounded-[1.2rem] flex items-center justify-center text-[#52A37D] shadow-sm">
                                            <LayoutGrid size={22} />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-[#0B1A28]">Listado de Iniciativas</h3>
                                            <p className="text-sm text-slate-500 font-medium mt-1">
                                                {filteredInitiatives.length} {filteredInitiatives.length === 1 ? 'propuesta en total' : 'propuestas en total'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <div className="flex items-center gap-1 bg-white border border-gray-200 p-1.5 rounded-xl shadow-sm">
                                            <button
                                                onClick={() => setViewMode('grid')}
                                                className={`p-2 rounded-lg flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-[#0B1A28] text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                                                title="Vista de cuadrícula"
                                            >
                                                <LayoutGrid size={18} />
                                            </button>
                                            <button
                                                onClick={() => setViewMode('list')}
                                                className={`p-2 rounded-lg flex items-center justify-center transition-colors ${viewMode === 'list' ? 'bg-[#0B1A28] text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                                                title="Vista de lista"
                                            >
                                                <List size={18} />
                                            </button>
                                        </div>
                                        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar w-full sm:w-auto">
                                            {['Todos', 'Infraestructura', 'Social', 'Gestión', 'Seguridad'].map((cat, idx) => (
                                                <button
                                                    key={cat}
                                                    onClick={() => setSelectedCategory(cat)}
                                                    className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat
                                                        ? 'bg-[#0B1A28] text-white shadow-md'
                                                        : 'bg-white text-slate-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                                        }`}>
                                                    {cat}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Responsive Layout */}
                                {filteredInitiatives.length > 0 ? (
                                    viewMode === 'grid' ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
                                            {filteredInitiatives.map((item) => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => setSelectedInitiative(item)}
                                                    className="group flex flex-col bg-white border border-gray-100 rounded-[1.5rem] shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-emerald-100 transition-all duration-300 cursor-pointer overflow-hidden h-full"
                                                >
                                                    <div className="relative h-48 sm:h-52 overflow-hidden">
                                                        <img
                                                            src={item.imageUrl}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                            loading="lazy"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-80 group-hover:opacity-70 transition-opacity" />

                                                        <div className="absolute top-4 right-4 z-10">
                                                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md border border-white/10
                                            ${item.priority === 'Urgente' ? 'bg-[#E46B6B]/90 text-white' :
                                                                    item.priority === 'Alta' ? 'bg-[#F2994A]/90 text-white' : 'bg-[#0B1A28]/60 text-white'}
                                        `}>
                                                                {item.priority}
                                                            </span>
                                                        </div>
                                                        <div className="absolute bottom-4 left-5 right-5 text-white z-10">
                                                            <div className="flex items-center gap-2 text-xs font-bold mb-2 opacity-90">
                                                                <Icon name={item.icon} className="w-4 h-4 text-[#A8DABC]" />
                                                                <span className="uppercase tracking-wider text-[#E6F5EC]">{item.category}</span>
                                                            </div>
                                                            <h4 className="font-bold text-white text-xl leading-tight group-hover:text-[#A8DABC] transition-colors line-clamp-2">
                                                                {item.title}
                                                            </h4>
                                                        </div>
                                                    </div>

                                                    <div className="p-6 flex flex-col flex-1">
                                                        <p className="text-sm text-slate-500 line-clamp-3 mb-5 leading-relaxed flex-1">
                                                            {item.shortDescription}
                                                        </p>

                                                        <div className="flex items-center gap-5 mb-5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                                            <div className="flex items-center gap-1.5" title="Sub-iniciativas">
                                                                <Layers size={14} className="text-[#52A37D]" />
                                                                {item.subInitiatives?.length || 0} Fases
                                                            </div>
                                                            <div className="flex items-center gap-1.5" title="Implementación Máxima">
                                                                <Calendar size={14} className="text-[#0B1A28]/50" />
                                                                {item.timeline}
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between pt-5 border-t border-gray-50 mt-auto">
                                                            <span className="text-lg font-extrabold text-[#0B1A28]">${item.budget.toLocaleString()}</span>
                                                            <span className="text-xs font-bold text-[#52A37D] flex items-center gap-1 group-hover:translate-x-1 transition-transform bg-[#E6F5EC] px-3 py-1.5 rounded-lg">
                                                                Detalles <ArrowUpRight size={14} />
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-5 pb-10">
                                            {filteredInitiatives.map((item) => (
                                                <div
                                                    key={item.id}
                                                    onClick={() => setSelectedInitiative(item)}
                                                    className="group flex flex-col sm:flex-row bg-white border border-gray-100 rounded-[1.5rem] shadow-sm hover:shadow-xl hover:border-emerald-100 transition-all duration-300 cursor-pointer overflow-hidden p-3"
                                                >
                                                    <div className="relative w-full sm:w-64 h-48 sm:h-auto overflow-hidden flex-shrink-0 rounded-[1rem]">
                                                        <img
                                                            src={item.imageUrl}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                            loading="lazy"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-slate-900/60 to-transparent"></div>
                                                        <div className="absolute top-3 left-3">
                                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md border border-white/10
                                            ${item.priority === 'Urgente' ? 'bg-[#E46B6B]/90 text-white' :
                                                                    item.priority === 'Alta' ? 'bg-[#F2994A]/90 text-white' : 'bg-[#0B1A28]/60 text-white'}
                                        `}>
                                                                {item.priority}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row flex-1 gap-6 items-center">
                                                        <div className="flex-1 flex flex-col justify-center">
                                                            <div className="flex items-center gap-2 text-xs font-bold mb-2">
                                                                <Icon name={item.icon} className="w-4 h-4 text-[#52A37D]" />
                                                                <span className="uppercase tracking-wider text-slate-500">{item.category}</span>
                                                            </div>
                                                            <h4 className="font-bold text-[#0B1A28] text-xl leading-tight mb-2 group-hover:text-[#52A37D] transition-colors">
                                                                {item.title}
                                                            </h4>
                                                            <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed max-w-2xl">
                                                                {item.shortDescription}
                                                            </p>
                                                        </div>
                                                        
                                                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4 sm:gap-2 sm:border-l sm:border-gray-100 sm:pl-6">
                                                            <div className="flex flex-row sm:flex-col gap-4 sm:gap-2">
                                                                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                                                    <Layers size={14} className="text-[#52A37D]" />
                                                                    {item.subInitiatives?.length || 0} Fases
                                                                </div>
                                                                <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                                                                    <Calendar size={14} className="text-[#0B1A28]/50" />
                                                                    {item.timeline}
                                                                </div>
                                                            </div>
                                                            
                                                            <div className="flex flex-col items-end gap-3 sm:mt-4">
                                                                <span className="text-2xl font-extrabold text-[#0B1A28]">${item.budget.toLocaleString()}</span>
                                                                <span className="hidden sm:flex text-xs font-bold text-[#52A37D] items-center gap-1 group-hover:translate-x-1 transition-transform bg-[#E6F5EC] px-4 py-2 rounded-xl">
                                                                    Ver Detalles <ArrowUpRight size={14} />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-2xl border-dashed">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                            <Search size={32} />
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900">No se encontraron resultados</h3>
                                        <p className="text-slate-500">Intenta con otra búsqueda o categoría</p>
                                    </div>
                                )}
                            </div>

                        </div>
                    </main>

                </div>
            </div>

            {/* Report View Overlay */}
            {showReport && (
                <ReportView
                    initiatives={sortedInitiatives}
                    onClose={() => setShowReport(false)}
                />
            )}

            {/* New Initiative Modal */}
            {showNewModal && (
                <NewInitiativeModal
                    onClose={() => setShowNewModal(false)}
                    onSave={addInitiative}
                />
            )}

            <ProposalModal
                initiative={selectedInitiative}
                onClose={() => setSelectedInitiative(null)}
                onUpdate={updateInitiative}
                onDelete={deleteInitiative}
            />
        </React.Fragment>
    );
};

// Helper Components
// NavItem removed as Bottom Nav is deleted

const SidebarItem = ({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) => (
    <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${active
        ? 'bg-emerald-50 text-emerald-700'
        : 'text-slate-500 hover:bg-gray-50 hover:text-slate-900'
        }`}>
        {icon}
        {label}
    </button>
);

export default App;