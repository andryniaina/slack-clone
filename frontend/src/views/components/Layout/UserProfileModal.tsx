import { User } from '../../../data/dtos/user';
import avatar from '../../../assets/images/avatar.png';
import { useEffect, useRef } from 'react';

interface UserProfileModalProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  onEditProfile: () => void;
}

export function UserProfileModal({ 
  user, 
  isOpen, 
  onClose, 
  onLogout,
  onEditProfile 
}: UserProfileModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={modalRef}
      className="absolute bottom-0 left-full w-[260px] bg-white rounded-lg shadow-lg overflow-hidden"
      style={{ transform: 'translateY(calc(100% - 185px)) translateX(calc(100% - 270px))' }}
    >
      {/* En-tête avec l'avatar et les informations de l'utilisateur */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
            <img
              src={user?.avatar || avatar}
              alt={user?.username || user?.email}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-900 font-medium">
              {user?.username || user?.email}
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-sm text-gray-600">Connecté</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-2 space-y-1">
        <button
          onClick={onEditProfile}
          className="w-full text-left px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:shadow-sm rounded transition-all duration-150 ease-in-out group"
        >
          Modifier profil
        </button>
        <button
          onClick={onLogout}
          className="w-full text-left px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded transition-all duration-150 ease-in-out"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
} 