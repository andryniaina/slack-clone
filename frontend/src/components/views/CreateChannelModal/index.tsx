import { useState } from 'react';
import { X, Hash, ChevronLeft} from 'lucide-react';
import { ChannelType } from '../../../data/dtos/channel';
import { ChannelService } from '../../../services/channel';
import { useQueryClient } from '@tanstack/react-query';
import { useUsers } from '../../../hooks/user';
import { User } from '../../../data/dtos/user';
import clsx from 'clsx';
import avatar from '../../../assets/images/avatar.png';
import { useAuth } from '../../../contexts/AuthContext';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateChannelModal({ isOpen, onClose }: CreateChannelModalProps) {
  const { user: currentUser } = useAuth();
  const [name, setName] = useState('');
  const [type, setType] = useState<ChannelType.PUBLIC | ChannelType.PRIVATE>(ChannelType.PUBLIC);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [step, setStep] = useState<'info' | 'members'>('info');
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();
  const { data: users = [] } = useUsers();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      await ChannelService.createChannel({
        name,
        type,
        members: selectedMembers,
      });

      // Invalider la requête des canaux accessibles
      queryClient.invalidateQueries({ 
        queryKey: ['channels', 'accessible'] 
      });

      // Réinitialiser et fermer
      setName('');
      setType(ChannelType.PUBLIC);
      setSelectedMembers([]);
      setStep('info');
      setSearchQuery('');
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création du canal:', error);
    }
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Filtrer les utilisateurs pour la recherche et exclure l'utilisateur actuel
  const filteredUsers = users
    .filter(user => user._id !== currentUser?._id)
    .filter(user => {
      const searchLower = searchQuery.toLowerCase();
      return (
        user.username?.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    });

  const handleNext = () => {
    if (type === ChannelType.PUBLIC) {
      handleSubmit();
    } else {
      setStep('members');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center">
            {step === 'members' && (
              <button 
                onClick={() => setStep('info')}
                className="mr-3 text-gray-600 hover:text-gray-900"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <h2 className="text-xl font-semibold text-gray-900">
              {step === 'info' ? 'Informations du canal' : 'Ajouter des membres'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        {step === 'info' ? (
          /* Channel Info Form */
          <div className="p-6">
            <div className="space-y-6">
              {/* Nom du canal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom du canal
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    placeholder="par-exemple"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Les conversations articulées autour d'un thème ont lieu dans les canaux. Choisissez un nom simple et clair.
                </p>
              </div>

              {/* Type de canal */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Visibilité
                </label>
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={type === ChannelType.PUBLIC}
                      onChange={() => setType(ChannelType.PUBLIC)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <span className="ml-3">
                      <span className="block text-sm font-medium text-gray-900">
                        Public - tous les utilisateurs de Koto SA
                      </span>
                    </span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={type === ChannelType.PRIVATE}
                      onChange={() => setType(ChannelType.PRIVATE)}
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                    />
                    <span className="ml-3">
                      <span className="block text-sm font-medium text-gray-900">
                        Privé - uniquement certaines personnes
                      </span>
                      <span className="block text-sm text-gray-500">
                        Ne peut être rejoint ou consulté que sur invitation
                      </span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Members Selection */
          <div className="p-6">
            <div className="mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des membres..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {filteredUsers.map((user: User) => (
                <button
                  key={user._id}
                  onClick={() => toggleMember(user._id)}
                  className={clsx(
                    "w-full px-4 py-3 flex items-center hover:bg-gray-50 rounded-md",
                    selectedMembers.includes(user._id) && "bg-purple-50"
                  )}
                >
                  <img
                    src={user.avatar || avatar}
                    alt={user.username || user.email}
                    className="w-8 h-8 rounded-md mr-3"
                  />
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">
                      {user.username || user.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.email}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(user._id)}
                    onChange={() => {}}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          {step === 'info' ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Annuler
              </button>
              <button
                onClick={handleNext}
                disabled={!name.trim()}
                className={clsx(
                  "px-4 py-2 rounded-md text-sm font-medium",
                  name.trim()
                    ? "bg-[#007a5a] text-white hover:bg-[#006c4f]"
                    : "bg-[#007a5a]/50 text-white cursor-not-allowed"
                )}
              >
                {type === ChannelType.PUBLIC ? 'Créer' : 'Suivant'}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setStep('info')}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Retour
              </button>
              <button
                onClick={handleSubmit}
                disabled={selectedMembers.length === 0}
                className={clsx(
                  "px-4 py-2 rounded-md text-sm font-medium",
                  selectedMembers.length > 0
                    ? "bg-[#007a5a] text-white hover:bg-[#006c4f]"
                    : "bg-[#007a5a]/50 text-white cursor-not-allowed"
                )}
              >
                Créer
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 