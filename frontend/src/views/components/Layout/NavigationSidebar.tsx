import { Home, MessageSquare, Bell, Plus, Slack, User } from 'lucide-react';
import { NavigationItem } from './NavigationItem';
import { useLocation } from 'react-router-dom';
import { Tooltip } from '../UI/Tooltip';
import { useAuth } from '../../../contexts/AuthContext';
import { UserProfileModal } from './UserProfileModal';
import { CreateNewModal } from './CreateNewModal';
import { CreateChannelModal } from '../Dashboard/CreateChannelModal';
import { EditProfileModal } from '../Profile/EditProfileModal';
import { useState } from 'react';

export function NavigationSidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isCreateNewModalOpen, setIsCreateNewModalOpen] = useState(false);
  const [isChannelCreationModalOpen, setIsChannelCreationModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleEditProfileClick = () => {
    setIsProfileModalOpen(false);
    setIsEditProfileModalOpen(true);
  };

  const handleChannelCreationClick = () => {
    setIsCreateNewModalOpen(false);
    setIsChannelCreationModalOpen(true);
  };

  const handleCreateNewClick = () => {
    setIsSpinning(true);
    setIsCreateNewModalOpen(!isCreateNewModalOpen);
    setTimeout(() => setIsSpinning(false), 300);
  };

  const userTooltipContent = (
    <div className="flex flex-col items-start">
      <span className="font-medium">{user?.username || user?.email}</span>
      <div className="flex items-center gap-1.5 mt-1">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="text-xs text-white/90">Connecté</span>
      </div>
    </div>
  );

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

      {/* Plus */}
      <div className="w-full flex flex-col items-center mt-4 mb-2 relative">
        {!isCreateNewModalOpen ? (
          <Tooltip content="Créer un nouveau" position="right">
            <button 
              onClick={handleCreateNewClick}
              className="w-9 h-9 bg-[#542C56] rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-100"
            >
              <Plus 
                size={20}
                className={isSpinning ? "animate-spin [animation-duration:300ms] [animation-iteration-count:1] [animation-timing-function:ease-in-out]" : ""}
              />
            </button>
          </Tooltip>
        ) : (
          <button 
            onClick={handleCreateNewClick}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-[#431343] shadow-lg transition-all duration-300 ease-in-out hover:scale-110"
          >
            <Plus 
              size={20}
              className={isSpinning ? "animate-spin [animation-duration:300ms] [animation-iteration-count:1] [animation-timing-function:ease-in-out]" : ""}
            />
          </button>
        )}

        <CreateNewModal
          isOpen={isCreateNewModalOpen}
          onClose={() => {
            setIsSpinning(true);
            setIsCreateNewModalOpen(false);
            setTimeout(() => setIsSpinning(false), 300);
          }}
          onCreateChannel={handleChannelCreationClick}
        />

        <CreateChannelModal
          isOpen={isChannelCreationModalOpen}
          onClose={() => setIsChannelCreationModalOpen(false)}
        />
      </div>

      {/* Avatar */}
      <div className="w-full flex flex-col items-center mt-4 mb-2 relative">
        {!isProfileModalOpen ? (
          <Tooltip content={userTooltipContent} position="right">
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-transform duration-100 hover:scale-110"
            >
              <User size={24} />
            </button>
          </Tooltip>
        ) : (
          <button 
            onClick={() => setIsProfileModalOpen(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white transition-transform duration-100 hover:scale-110"
          >
            <User size={24} />
          </button>
        )}

        <UserProfileModal
          user={user}
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onLogout={handleLogout}
          onEditProfile={handleEditProfileClick}
        />

        <EditProfileModal
          isOpen={isEditProfileModalOpen}
          onClose={() => setIsEditProfileModalOpen(false)}
          user={user}
        />
      </div>
    </div>
  );
} 