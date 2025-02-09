import { Home, MessageSquare, Bell, Plus, Slack } from 'lucide-react';
import { NavigationItem } from './NavigationItem';
import { useLocation } from 'react-router-dom';
import avatar from '../../../assets/images/avatar.png';

export function NavigationSidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-[75px] bg-[#431343] flex flex-col items-center py-3 pt-12">
      {/* KS Logo */}
      <div className="w-9 h-9 rounded flex items-center justify-center text-white mb-4">
        <Slack size={25} />
      </div>

      {/* Navigation Items */}
      <div className="flex-1 w-full flex flex-col items-center space-y-4">
        <NavigationItem
          to="/app/dashboard"
          icon={Home}
          label="Accueil"
          isActive={isActive('/app/dashboard')}
        />

        <NavigationItem
          to="/app/directs"
          icon={MessageSquare}
          label="Messages directs"
          isActive={isActive('/app/directs')}
          multilineLabel
        />

        <NavigationItem
          to="/app/activity"
          icon={Bell}
          label="Activité"
          isActive={isActive('/app/activity')}
        />

        {/* More Button */}
        <div className="w-full flex flex-col items-center">
          <button className="w-9 h-9 bg-[#rgb(69,17,70)] rounded-lg flex items-center justify-center text-white hover:bg-white/10 transition-transform duration-100 hover:scale-110">
            <span className="text-lg">•••</span>
          </button>
          <span className="text-[11px] text-white/70 mt-0.5">Plus</span>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-4 w-full flex flex-col items-center space-y-3">
        {/* Plus Button */}
        <button className="w-9 h-9 bg-[#542C56] rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-transform duration-100 hover:scale-110">
          <Plus size={20} />
        </button>
      </div>

      {/* Avatar */}
      <div className="w-full flex flex-col items-center mt-4 mb-4">
        <div className="w-8 h-8 rounded overflow-hidden">
          <img src={avatar} alt="User avatar" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
} 