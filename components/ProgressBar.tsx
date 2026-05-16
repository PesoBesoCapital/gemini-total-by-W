
import React from 'react';

interface ProgressBarProps {
  percentage: number;
  color?: 'green' | 'red' | 'blue' | 'yellow' | 'orange';
  height?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, color = 'blue', height = 'h-2' }) => {
  const safePercentage = Math.min(100, Math.max(0, percentage));

  const colorClasses = {
    teal: 'bg-tw-teal shadow-[0_0_10px_rgba(45,212,191,0.4)]',
    red: 'bg-tw-red shadow-[0_0_10px_rgba(239,68,68,0.4)]',
    blue: 'bg-tw-blue shadow-[0_0_10px_rgba(59,130,246,0.4)]',
    yellow: 'bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.4)]',
    orange: 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.4)]',
    green: 'bg-tw-teal shadow-[0_0_10px_rgba(45,212,191,0.4)]',
  };

  const selectedColor = (colorClasses as any)[color] || colorClasses.blue;

  return (
    <div className={`w-full bg-tw-navy/40 rounded-full ${height} overflow-hidden border border-tw-teal/10`}>
      <div
        className={`${selectedColor} ${height} rounded-full transition-all duration-1000 ease-out relative`}
        style={{ width: `${safePercentage}%` }}
      >
          {/* Shine effect */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-white/10 rounded-t-full"></div>
      </div>
    </div>
  );
};

export default ProgressBar;
