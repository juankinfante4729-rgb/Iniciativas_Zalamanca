import React from 'react';
import {
  Dog, Users, BriefcaseMedical, Gift, Coffee, Flower2, Bone, Gamepad2,
  Waves, Zap, Tv, Refrigerator, Projector, Mic2, Signpost, PaintBucket,
  Dumbbell, Droplets, Trees, Mail, Flame, ShieldOff
} from 'lucide-react';

export const Icon = ({ name, className }: { name: string; className?: string }) => {
  const icons: Record<string, React.ElementType> = {
    Dog, Users, BriefcaseMedical, Gift, Coffee, Flower2, Bone, Gamepad2,
    Waves, Zap, Tv, Refrigerator, Projector, Mic2, Signpost, PaintBucket,
    Dumbbell, Droplets, Trees, Mail, Flame, ShieldOff
  };

  // Map old FirstAidKit reference if it still exists in data to BriefcaseMedical for safety
  const IconComponent = icons[name] || (name === 'FirstAidKit' ? BriefcaseMedical : Users);
  return <IconComponent className={className} />;
};