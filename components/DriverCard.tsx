import React from 'react';
import { Star, Clock, CheckCircle, Circle } from 'lucide-react';
import { Employee, Truck } from '../types';

interface DriverCardProps {
  driver: Employee;
  assignedTruck?: Truck;
  isSelected: boolean;
  onSelect: () => void;
}

export const DriverCard: React.FC<DriverCardProps> = ({ driver, assignedTruck, isSelected, onSelect }) => {
  return (
    <div 
      onClick={onSelect}
      className={`relative p-4 rounded-xl border cursor-pointer transition-all duration-200 group ${
        isSelected 
          ? 'bg-brand-600/10 border-brand-500 shadow-lg shadow-brand-900/20' 
          : 'bg-dark-800 border-dark-800 hover:border-zinc-600'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <img 
            src={driver.image_url} 
            alt={driver.last_name} 
            className="w-10 h-10 rounded-full object-cover border border-zinc-700"
          />
          <div>
            <h4 className="text-sm font-semibold text-zinc-100">
              {driver.first_name} {driver.last_name}
            </h4>
            <div className="flex items-center gap-1 text-xs text-zinc-500">
              <span className="bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-400 font-mono">
                {assignedTruck ? assignedTruck.license_plate : 'NO TRUCK'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Selection Indicator */}
        <div className={`transition-colors ${isSelected ? 'text-brand-500' : 'text-zinc-600 group-hover:text-zinc-500'}`}>
          {isSelected ? <CheckCircle className="w-6 h-6 fill-current" /> : <Circle className="w-6 h-6" />}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="flex items-center gap-1.5 bg-dark-950/50 p-2 rounded-lg">
          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-medium text-zinc-300">{driver.rating}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-dark-950/50 p-2 rounded-lg">
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-xs font-medium text-zinc-300">{driver.weekly_hours_current}h / wk</span>
        </div>
      </div>

      {isSelected && (
        <div className="absolute inset-x-0 -bottom-px h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-50"></div>
      )}
    </div>
  );
};