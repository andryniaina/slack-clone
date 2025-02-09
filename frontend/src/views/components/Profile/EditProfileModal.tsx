import { X, User as UserIcon, Lock } from 'lucide-react';
import { useState } from 'react';
import { User } from '../../../data/dtos/user';
import { FormInput } from '../UI/FormInput';
import { PasswordToggleButton } from '../Auth/PasswordToggleButton';
import { UserService } from '../../../services/user';
import { useQueryClient } from '@tanstack/react-query';
import { USERS_QUERY_KEY } from '../../../hooks/user';
import clsx from 'clsx';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

type TabType = 'profile' | 'security';

export function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [username, setUsername] = useState(user?.username || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const tabs = [
    { id: 'profile' as TabType, label: 'Profil' },
    { id: 'security' as TabType, label: 'Sécurité' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const { name, value } = e.target;
    switch (name) {
      case 'username':
        setUsername(value);
        break;
      case 'currentPassword':
        setCurrentPassword(value);
        break;
      case 'newPassword':
        setNewPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }
  };

  const isUsernameValid = username.trim().length >= 3 && username !== user?.username;

  const validatePasswordForm = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Tous les champs sont requis');
      return false;
    }

    if (newPassword.length < 6) {
      setError('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError('Les nouveaux mots de passe ne correspondent pas');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (activeTab === 'profile') {
        if (!isUsernameValid) {
          return;
        }

        const updatedUser = await UserService.updateUsername(username.trim());
        
        // Mettre à jour le cache
        queryClient.setQueryData(['auth', 'user'], updatedUser);
        queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
        
        onClose();
      } else if (activeTab === 'security') {
        if (!validatePasswordForm()) {
          setIsLoading(false);
          return;
        }

        await UserService.updatePassword(currentPassword, newPassword);
        
        // Réinitialiser les champs
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        
        onClose();
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('Le mot de passe actuel est incorrect');
      } else if (err.response?.status === 409) {
        setError('Ce nom d\'utilisateur est déjà pris');
      } else {
        setError('Une erreur est survenue lors de la mise à jour du profil');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = activeTab === 'profile' 
    ? isUsernameValid
    : true; // Always enable the button for security tab

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Modifier le profil
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="px-6">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    'py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap',
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}

          {activeTab === 'profile' ? (
            <div className="space-y-4">
              {/* Username */}
              <FormInput
                icon={UserIcon}
                id="username"
                name="username"
                type="text"
                required
                placeholder="Nom d'utilisateur"
                value={username}
                onChange={handleChange}
                disabled={isLoading}
                minLength={3}
              />
              <p className="text-sm text-gray-500 mt-1">
                Le nom d'utilisateur doit contenir au moins 3 caractères
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Current Password */}
              <FormInput
                icon={Lock}
                id="currentPassword"
                name="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                required
                placeholder="Mot de passe actuel"
                value={currentPassword}
                onChange={handleChange}
                rightElement={
                  <PasswordToggleButton
                    showPassword={showCurrentPassword}
                    onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
                  />
                }
              />

              {/* New Password */}
              <FormInput
                icon={Lock}
                id="newPassword"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                required
                placeholder="Nouveau mot de passe"
                value={newPassword}
                onChange={handleChange}
                minLength={6}
                rightElement={
                  <PasswordToggleButton
                    showPassword={showNewPassword}
                    onToggle={() => setShowNewPassword(!showNewPassword)}
                  />
                }
              />

              {/* Confirm New Password */}
              <FormInput
                icon={Lock}
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder="Confirmer le nouveau mot de passe"
                value={confirmPassword}
                onChange={handleChange}
                minLength={6}
                rightElement={
                  <PasswordToggleButton
                    showPassword={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            disabled={isLoading}
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={!isFormValid || isLoading}
            className={clsx(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              (!isFormValid || isLoading)
                ? "bg-[#007a5a]/50 text-white cursor-not-allowed"
                : "bg-[#007a5a] text-white hover:bg-[#006c4f]"
            )}
          >
            {isLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </div>
      </div>
    </div>
  );
} 