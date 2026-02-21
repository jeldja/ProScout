interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  highlighted?: boolean;
}

const StatCard = ({ label, value, subtitle, highlighted = false }: StatCardProps) => {
  return (
    <div className={`glass-card rounded-lg p-4 text-center transition-all duration-300 hover:scale-105 ${highlighted ? 'stat-glow border-primary/30' : ''}`}>
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground font-display">{label}</p>
      <p className={`mt-1 text-3xl font-bold font-display ${highlighted ? 'text-gradient' : 'text-foreground'}`}>
        {value}
      </p>
      {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
};

export default StatCard;
