import { ArrowLeft, ArrowRight, Search, LogOut } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useAppNavigation } from '../../../hooks/navigation/useAppNavigation';
import { NavigationButton } from './NavigationButton';

export function Header() {
  const { logout } = useAuth();
  const { canGoBack, canGoForward, goBack, goForward } = useAppNavigation();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="h-11 bg-[#431343] flex items-center justify-center px-4 gap-4 relative">
      <div className="flex items-center gap-3">
        {/* Navigation Buttons */}
        <div className="flex items-center gap-2">
          <NavigationButton
            icon={ArrowLeft}
            onClick={goBack}
            disabled={!canGoBack}
            title={canGoBack ? "Retour" : "Pas d'historique précédent"}
          />
          <NavigationButton
            icon={ArrowRight}
            onClick={goForward}
            disabled={!canGoForward}
            title={canGoForward ? "Suivant" : "Pas d'historique suivant"}
          />
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
  );
} 