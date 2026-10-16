'use client';

import {
  Wallet,
  Users,
  BarChart3,
  Shield,
  Bell,
  FileText,
  Layers,
  Sparkles,
  Gavel,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  wallet: Wallet,
  users: Users,
  chart: BarChart3,
  shield: Shield,
  bell: Bell,
  file: FileText,
  layers: Layers,
  sparkles: Sparkles,
  gavel: Gavel,
};

export default function Icon({
  name,
  size = 20,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const Cmp = ICONS[name] ?? Sparkles;
  return <Cmp size={size} className={className} />;
}
