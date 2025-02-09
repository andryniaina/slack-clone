import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface NavigationButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  disabled: boolean;
  title: string;
}

export function NavigationButton({ icon: Icon, onClick, disabled, title }: NavigationButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={clsx(
        "w-7 h-7 flex items-center justify-center transition-colors",
        disabled
          ? "text-white/30 cursor-not-allowed"
          : "text-white/70 hover:text-white cursor-pointer"
      )}
    >
      <Icon size={18} />
    </button>
  );
} 