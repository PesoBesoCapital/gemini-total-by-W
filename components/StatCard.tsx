import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  subValue?: string;
  onValueChange?: (newValue: number) => void;
  currentNumericValue?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subValue, onValueChange, currentNumericValue }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(currentNumericValue?.toString() || '');

  React.useEffect(() => {
    if (!isEditing) {
      setEditValue(currentNumericValue?.toString() || '');
    }
  }, [currentNumericValue, isEditing]);
  
  const handleSave = () => {
    if (onValueChange && editValue !== '' && !isNaN(Number(editValue))) {
      onValueChange(Number(editValue));
    }
    setIsEditing(false);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setIsEditing(false);
  }

  return (
    <div className="bg-tw-navy/40 p-6 rounded-xl shadow-lg border border-tw-teal/20 hover:border-tw-red transition-all duration-300 transform hover:-translate-y-1">
      <h3 className="text-sm font-medium text-tw-teal uppercase tracking-wider">{title}</h3>
      {isEditing && onValueChange ? (
          <input 
            type="number"
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            autoFocus
            className="mt-2 text-3xl font-bold text-white bg-tw-navy/60 border border-tw-red rounded-md w-full px-2 py-1 focus:outline-none focus:ring-2 focus:ring-tw-red"
          />
      ) : (
          <p 
            className={`mt-2 text-3xl font-bold text-white ${onValueChange ? 'cursor-pointer hover:bg-tw-teal/10 rounded-md px-2' : ''}`}
            onClick={() => onValueChange && setIsEditing(true)}
          >
            {value}
          </p>
      )}
      {subValue && <p className="mt-1 text-sm text-gray-400">{subValue}</p>}
    </div>
  );
};

export default StatCard;