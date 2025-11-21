
import React from 'react';
import { ViewMode } from '../types';
import { LayoutDashboard, Map, Settings, LogOut, Code2, Cable } from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  onChangeView: (view: ViewMode) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onLogout }) => {
  const navItems = [
    { id: ViewMode.DASHBOARD, label: 'Genel Bakış', icon: LayoutDashboard },
    { id: ViewMode.MAPS, label: 'Canlı Harita', icon: Map },
    { id: ViewMode.INTEGRATION, label: 'Entegrasyon', icon: Code2 },
    { id: ViewMode.SETTINGS, label: 'Ayarlar', icon: Settings },
  ];

  return (
    <div className="w-20 lg:w-64 bg-slate-800 border-r border-slate-700 flex flex-col h-screen transition-all duration-300 shrink-0">
      <div className="p-6 flex items-center justify-center lg:justify-start border-b border-slate-700">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold mr-0 lg:mr-3 shadow-lg shadow-indigo-500/30">
          M
        </div>
        <span className="text-xl font-bold text-white hidden lg:block tracking-wide">MetriX AI</span>
      </div>

      <nav className="flex-1 py-6 space-y-2 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center justify-center lg:justify-start px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-white'
              }`}
            >
              <Icon size={22} className={isActive ? "text-white" : "text-slate-400 group-hover:text-white"} />
              <span className="ml-3 font-medium hidden lg:block">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center lg:justify-start px-3 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span className="ml-3 hidden lg:block">Çıkış Yap</span>
        </button>
      </div>
    </div>
  );
};
