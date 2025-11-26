import React from 'react';
import { 
  LayoutDashboard, 
  Map, 
  Truck, 
  Users, 
  CreditCard, 
  Settings,
  LogOut
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: false },
    { icon: Map, label: 'Trips', active: true },
    { icon: Truck, label: 'Trucks', active: false },
    { icon: Users, label: 'Personnel', active: false },
    { icon: CreditCard, label: 'Billing', active: false },
  ];

  return (
    <div className="w-64 h-screen bg-dark-900 border-r border-dark-800 flex flex-col fixed left-0 top-0">
      {/* Brand */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
          <Truck className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">FleetFlow</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              item.active 
                ? 'bg-brand-600/10 text-brand-500 border border-brand-600/20' 
                : 'text-zinc-400 hover:bg-dark-800 hover:text-zinc-100'
            }`}
          >
            <item.icon className={`w-5 h-5 ${item.active ? 'text-brand-500' : ''}`} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-dark-800">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-zinc-400 hover:text-red-400 transition-colors">
          <Settings className="w-5 h-5" />
          <span className="text-sm font-medium">Settings</span>
        </button>
        <button className="flex items-center gap-3 px-4 py-3 w-full text-zinc-400 hover:text-red-400 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </div>
  );
};