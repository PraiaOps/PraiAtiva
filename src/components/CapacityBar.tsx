import React from 'react';

interface CapacityBarProps {
  total: number;
  filled: number;
  className?: string;
}

// Barra de capacidade visual e moderna
const CapacityBar: React.FC<CapacityBarProps> = ({ total, filled, className = '' }) => {
  const percent = total === 0 ? 0 : Math.min(100, Math.round((filled / total) * 100));
  let barColor = 'bg-green-500';
  if (percent >= 90) barColor = 'bg-red-500';
  else if (percent >= 70) barColor = 'bg-yellow-400';
  else if (percent >= 40) barColor = 'bg-sky-500';

  return (
    <div className={`flex items-center gap-1 w-full ${className}`} title={`Capacidade: ${filled}/${total}`}>
      <span className="text-[10px] text-gray-500 font-semibold mr-1 min-w-[36px]">Vagas</span>
      <div className="relative flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden min-w-[40px] max-w-[70px]">
        <div
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>
      <span className="text-[10px] font-semibold text-gray-700 min-w-[28px] text-right">
        {filled}/{total}
      </span>
    </div>
  );
};

export default CapacityBar;
