import { Outlet } from 'react-router-dom';
import {
  Hash,
  ChevronDown,
  Plus,
  Clock,
  Home,
  MessageCircle,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  User,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AuthenticatedLayout() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="h-screen flex">
      {/* Left Navigation */}
      <div className="w-[65px] bg-[#541554] flex flex-col items-center py-4 space-y-4">
        <button className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center text-white hover:bg-white/20">
          <Home size={20} />
        </button>
      </div>

      {/* Sidebar */}
      <div className="w-60 bg-[#541554] text-white flex flex-col">
        {/* Workspace Header */}
        <div className="h-12 px-4 flex items-center justify-between hover:bg-white/10 cursor-pointer">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-white">Koto SA</span>
            <ChevronDown size={18} className="text-white/70" />
          </div>
          <button className="w-7 h-7 bg-white/10 rounded flex items-center justify-center hover:bg-white/20">
            <Plus size={16} className="text-white/90" />
          </button>
        </div>

        {/* Trial Banner */}
        <div className="px-3 py-2">
          <button className="w-full text-left px-2 py-1.5 rounded flex items-center space-x-2 hover:bg-white/10">
            <Clock size={16} className="text-white/70" />
            <span className="text-sm text-white/90">29 jours restants dans le cadre de l'essai</span>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="px-3">
          <button className="w-full text-left px-2 py-1.5 rounded flex items-center space-x-2 hover:bg-white/10">
            <MessageCircle size={16} className="text-white/70" />
            <span className="text-sm text-white/90">Appels d'équipe</span>
          </button>
        </div>

        {/* Channels */}
        <div className="px-3 mt-4">
          <div className="flex items-center justify-between px-2 py-1 text-white/70 hover:text-white cursor-pointer">
            <span className="text-sm font-medium">Canaux</span>
          </div>
          <div className="mt-1">
            <div className="relative">
              <input
                type="text"
                placeholder="nouveau-canal"
                className="w-full bg-white/10 text-white placeholder-white/50 text-sm px-2 py-1 rounded border border-white/20 focus:outline-none focus:border-white/30"
              />
              <Hash size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white/50" />
            </div>
          </div>
        </div>

        {/* Messages directs */}
        <div className="px-3 mt-4">
          <div className="flex items-center justify-between px-2 py-1 text-white/70 hover:text-white cursor-pointer">
            <span className="text-sm font-medium">Messages directs</span>
            <Plus size={16} />
          </div>
          <button className="w-full text-left px-2 py-1.5 rounded flex items-center space-x-2 hover:bg-white/10">
            <div className="w-4 h-4 rounded bg-[#2EB67D] flex items-center justify-center text-[10px] text-white font-medium">
              A
            </div>
            <span className="text-sm text-white/90">Androuz</span>
          </button>
          <button className="w-full text-left px-2 py-1.5 rounded flex items-center space-x-2 hover:bg-white/10">
            <div className="w-4 h-4 rounded bg-[#ECB22E] flex items-center justify-center text-[10px] text-white font-medium">
              A
            </div>
            <span className="text-sm text-white/90">Andriniaina</span>
            <span className="text-sm text-white/50">vous</span>
          </button>
        </div>

        {/* Add Colleagues */}
        <div className="px-3 mt-2">
          <button className="w-full text-left px-2 py-1.5 rounded flex items-center space-x-2 hover:bg-white/10">
            <Plus size={16} className="text-white/70" />
            <span className="text-sm text-white/90">Ajouter des collègues</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <header className="h-12 border-b border-[#00000014] flex items-center justify-between px-4 bg-white">
          <div className="flex items-center space-x-3">
            <button className="w-6 h-6 flex items-center justify-center text-[#616061] hover:text-[#1d1c1d]">
              <ArrowLeft size={18} />
            </button>
            <button className="w-6 h-6 flex items-center justify-center text-[#616061] hover:text-[#1d1c1d]">
              <ArrowRight size={18} />
            </button>
            <button className="w-6 h-6 flex items-center justify-center text-[#616061] hover:text-[#1d1c1d]">
              <Clock size={18} />
            </button>
          </div>
          <div className="mx-auto relative">
            <input
              type="text"
              placeholder="Rechercher dans Koto SA"
              className="w-[725px] bg-[#f8f8f8] text-sm px-4 py-1 rounded border border-[#00000014] focus:outline-none focus:bg-white focus:border-[#0000004d] placeholder-[#616061]"
            />
            <HelpCircle size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#616061]" />
          </div>
          <div className="flex items-center space-x-3">
            <button className="w-6 h-6 flex items-center justify-center text-[#616061] hover:text-[#1d1c1d]">
              <User size={18} />
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center px-3 py-1 rounded text-[#616061] hover:text-[#1d1c1d] hover:bg-[#f8f8f8] transition-colors duration-150"
            >
              <LogOut size={18} className="mr-1" />
              <span className="text-sm">Déconnexion</span>
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-white">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
