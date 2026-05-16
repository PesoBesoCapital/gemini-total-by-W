import React from 'react';

interface BarChartProps {
  labels: string[];
  data: number[]; // as percentages
}

const BarChart: React.FC<BarChartProps> = ({ labels, data }) => {
  const maxValue = 100; // Since data is percentage

  return (
    <div className="w-full h-full flex flex-col p-4">
      <div className="flex-1 grid grid-cols-6 gap-4 items-end">
        {data.map((value, index) => {
          const height = `${Math.min(value, 100)}%`;
          const isLow = value < 50;
          return (
            <div key={index} className="relative flex flex-col items-center justify-end h-full group">
              <div className="absolute -top-6 text-xs text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                {value.toFixed(1)}%
              </div>
              <div
                className={`w-3/4 rounded-t-md transition-all duration-500 ease-out ${isLow ? 'bg-tw-red' : 'bg-tw-teal'}`}
                style={{ height }}
              ></div>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-6 gap-4 mt-2">
        {labels.map((label, index) => (
          <div key={index} className="text-center text-xs text-gray-400 truncate">
            {label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;