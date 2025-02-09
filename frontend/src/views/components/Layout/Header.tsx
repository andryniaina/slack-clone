import { ArrowLeft, ArrowRight, Search, LogOut, Hash } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useAppNavigation } from '../../../hooks/navigation/useAppNavigation';
import { NavigationButton } from './NavigationButton';
import { useState, useEffect, useRef } from 'react';
import { SearchService, SearchResult } from '../../../services/search';
import avatar from '../../../assets/images/avatar.png';
import { User } from '../../../data/dtos/user';
import { Channel } from '../../../data/dtos/channel';

export function Header() {
  const { logout } = useAuth();
  const { canGoBack, canGoForward, goBack, goForward } = useAppNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    // Debounce le search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const results = await SearchService.search(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Erreur lors de la recherche:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un utilisateur ou un canal"
            className="w-full h-7 bg-[#5B315E] text-white placeholder-white/70 text-sm px-8 rounded border border-white/10 focus:outline-none focus:border-white/30 focus:bg-[#6B3B6E] transition-colors duration-150"
          />
          <Search size={14} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-white/70" />

          {/* Search Results Dropdown */}
          {(searchResults.length > 0 || isLoading) && searchQuery && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-md shadow-lg overflow-hidden z-50">
              {isLoading ? (
                <div className="p-3 text-sm text-gray-500 text-center">
                  Recherche en cours...
                </div>
              ) : (
                <div className="py-2">
                  {searchResults.map((result, index) => (
                    <div
                      key={`${result.type}-${index}`}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                    >
                      {result.type === 'channel' ? (
                        <>
                          <Hash className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-900">{(result.item as Channel).name}</span>
                        </>
                      ) : (
                        <>
                          <img
                            src={(result.item as User).avatar || avatar}
                            alt={(result.item as User).username || (result.item as User).email}
                            className="w-6 h-6 rounded object-cover flex-shrink-0"
                          />
                          <div className="flex flex-col">
                            <span className="text-gray-900">
                              {(result.item as User).username || (result.item as User).email}
                            </span>
                            {(result.item as User).username && (
                              <span className="text-xs text-gray-500">
                                {(result.item as User).email}
                              </span>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
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