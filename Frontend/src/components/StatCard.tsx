interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  highlighted?: boolean;
}

const StatCard = ({ label, value, subtitle, highlighted = false }: StatCardProps) => {
  return (
    <div 
      className={`stat-card-3d rounded-xl p-4 text-center ${
        highlighted ? 'stat-glow border-primary/40' : ''
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground font-display">{label}</p>
      <p className={`mt-2 text-3xl font-bold font-display ${highlighted ? 'text-gradient' : 'text-foreground'}`}>
        {value}
      </p>
      {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  );
};

export default StatCard;
