import { Eye, EyeOff } from 'lucide-react';

interface PasswordToggleButtonProps {
  showPassword: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export const PasswordToggleButton = ({ 
  showPassword, 
  onToggle, 
  disabled 
}: PasswordToggleButtonProps) => (
  <button
    type="button"
    onClick={onToggle}
    disabled={disabled}
  >
    {showPassword ? (
      <EyeOff className="h-5 w-5 text-gray-500 hover:text-gray-700" aria-hidden="true" />
    ) : (
      <Eye className="h-5 w-5 text-gray-500 hover:text-gray-700" aria-hidden="true" />
    )}
  </button>
); 