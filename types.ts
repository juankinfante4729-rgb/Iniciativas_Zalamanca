export type Priority = 'Alta' | 'Media' | 'Baja' | 'Urgente';

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
}

export interface StatProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
}