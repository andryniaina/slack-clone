import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface NavigationItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  multilineLabel?: boolean;
}

export function NavigationItem({ to, icon: Icon, label, isActive, multilineLabel }: NavigationItemProps) {
  const getButtonClass = () => {
    const baseClass = "w-9 h-9 rounded-lg flex items-center justify-center text-white transition-colors";
    return `${baseClass} ${isActive ? 'bg-[#754A77] hover:bg-[#754A77]' : 'bg-[#rgb(69,17,70)] hover:bg-white/10'}`;
  };

  return (
    <div className="w-full flex flex-col items-center">
      <NavLink to={to} className="w-full flex flex-col items-center">
        <button className={`${getButtonClass()} transition-transform duration-100 hover:scale-110`}>
          <Icon size={20} />
        </button>
        <span className={`text-[11px] ${isActive ? 'text-white' : 'text-white/70'} mt-0.5 ${multilineLabel ? 'text-center leading-tight' : ''}`}>
          {multilineLabel ? (
            <>
              {label.split(' ').map((word, index) => (
                <span key={index}>
                  {word}
                  {index < label.split(' ').length - 1 && <br />}
                </span>
              ))}
            </>
          ) : (
            label
          )}
        </span>
      </NavLink>
    </div>
  );
} 