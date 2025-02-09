import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
    Plus,
    Clock,
    Home,
    ArrowLeft,
    ArrowRight,
    MessageSquare,
    Search,
    Bell,
    LogOut,
    Slack
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import avatar from '../../assets/images/avatar.png';

export default function AuthenticatedLayout() {
    const { logout } = useAuth();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const getButtonClass = (path: string) => {
        const baseClass = "w-9 h-9 rounded-lg flex items-center justify-center text-white transition-colors";
        return `${baseClass} ${isActive(path) ? 'bg-[#754A77] hover:bg-[#754A77]' : 'bg-[#rgb(69,17,70)] hover:bg-white/10'}`;
    };

    return (
        <div className="h-screen flex">
            {/* Left Sidebar */}
            <div className="w-[75px] bg-[#431343] flex flex-col items-center py-3 pt-12">
                {/* KS Logo */}
                <div className="w-9 h-9 rounded flex items-center justify-center text-white mb-4">
                    <Slack size={25} />
                </div>

                {/* Navigation Items */}
                <div className="flex-1 w-full flex flex-col items-center space-y-4">
                    {/* Home */}
                    <div className="w-full flex flex-col items-center">
                        <NavLink to="/app/dashboard" className="w-full flex flex-col items-center">
                            <button className={`${getButtonClass('/app/dashboard')} transition-transform duration-100 hover:scale-110`}>
                                <Home size={20} />
                            </button>
                            <span className={`text-[11px] ${isActive('/app/dashboard') ? 'text-white' : 'text-white/70'} mt-0.5`}>Accueil</span>
                        </NavLink>
                    </div>

                    {/* Messages */}
                    <div className="w-full flex flex-col items-center">
                        <NavLink to="/app/directs" className="w-full flex flex-col items-center">
                            <button className={`${getButtonClass('/app/directs')} transition-transform duration-100 hover:scale-110`}>
                                <MessageSquare size={20} />
                            </button>
                            <span className={`text-[11px] ${isActive('/app/directs') ? 'text-white' : 'text-white/70'} mt-0.5 text-center leading-tight`}>Messages<br />directs</span>
                        </NavLink>
                    </div>

                    {/* Activity */}
                    <div className="w-full flex flex-col items-center">
                        <NavLink to="/app/activity" className="w-full flex flex-col items-center">
                            <button className={`${getButtonClass('/app/activity')} transition-transform duration-100 hover:scale-110`}>
                                <Bell size={20} />
                            </button>
                            <span className={`text-[11px] ${isActive('/app/activity') ? 'text-white' : 'text-white/70'} mt-0.5`}>Activité</span>
                        </NavLink>
                    </div>

                    {/* More */}
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

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-11 bg-[#431343] flex items-center justify-center px-4 gap-4 relative">
                    <div className="flex items-center gap-3">
                    
                    {/* Navigation Buttons */}
                    <div className="flex items-center gap-2">
                        <button className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white">
                            <ArrowLeft size={18} />
                        </button>
                        <button className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white">
                            <ArrowRight size={18} />
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 w-[50vw] relative">
                        <input
                            type="text"
                            placeholder="Rechercher un canal ou un utilisateur"
                            className="w-full h-7 bg-[#5B315E] text-white placeholder-white text-sm px-8 rounded border border-white/30 focus:outline-none focus:border-white/60"
                        />
                        <Search size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-white/60" />
                    </div>

                    </div>

                    {/* Right Side Icons */}
                    <div className="flex items-center gap-2 absolute right-4">
                        <button
                            onClick={handleLogout}
                            className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white"
                            title="Se déconnecter"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-hidden bg-[#F8F8F8]">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
