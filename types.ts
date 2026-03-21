export type Priority = 'Alta' | 'Media' | 'Baja' | 'Urgente';

export interface SubInitiative {
  id: string; // unique identifier (e.g., timestamp or uuid)
  title: string;
  description: string;
  budget: number;
  timeline: string;
  priority: Priority;
  category: 'Infraestructura' | 'Social' | 'Gestión' | 'Seguridad';
  imageUrl?: string;
}

export type Responsable = "Administración" | "Presidente" | "Coordinador Etapa 1" | "Coordinador Etapa 2" | "Coordinador Etapa 3" | "Coordinador Etapa 4";

export interface Initiative {
  id: number;
  title: string;
  shortDescription: string;
  fullDescription: string;
  budget: number; // In USD
  timeline: string;
  priority: Priority;
  category: 'Infraestructura' | 'Social' | 'Gestión' | 'Seguridad';
  icon: string; // Lucide icon name mapping
  imageUrl: string;
  subInitiatives?: SubInitiative[];
  responsable: Responsable;
}

export interface StatProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}