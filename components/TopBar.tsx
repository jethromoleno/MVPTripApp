import React from 'react';
import { Search, Bell, UserCircle } from 'lucide-react';

export const TopBar: React.FC = () => {
  return (
    <header className="h-16 bg-dark-900 border-b border-dark-800 flex items-center justify-between px-8 sticky top-0 z-10 ml-64">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search trips, drivers, or trucks..." 
            className="w-full bg-dark-950 border border-dark-800 rounded-full py-2 pl-10 pr-4 text-sm text-zinc-200 focus:outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-600 placeholder-zinc-600"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Role Toggle */}
        <div className="flex items-center bg-dark-950 rounded-lg p-1 border border-dark-800">
          <button className="px-3 py-1.5 text-xs font-medium bg-dark-800 text-white rounded shadow-sm">
            Manager
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-zinc-500 hover:text-zinc-300">
            Dispatcher
          </button>
        </div>

        <div className="h-6 w-px bg-dark-800"></div>

        {/* Notifications */}
        <button className="relative text-zinc-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-dark-900"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-white">Alex Morgan</p>
            <p className="text-xs text-zinc-500">Logistics Mgr.</p>
          </div>
          <UserCircle className="w-8 h-8 text-zinc-400" />
        </div>
      </div>
    </header>
  );
};