import { ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
  isCollapsible?: boolean;
  isCollapsed?: boolean;
  onToggle?: () => void;
  rightContent?: ReactNode;
  className?: string;
}

export function SidebarSection({
  title,
  children,
  isCollapsible = false,
  isCollapsed = false,
  onToggle,
  rightContent,
  className
}: SidebarSectionProps) {
  return (
    <div className={clsx("py-1", className)}>
      {/* Header */}
      <div 
        className={`flex items-center justify-between px-2 py-1 text-white/70 hover:text-white ${isCollapsible ? 'cursor-pointer' : ''}`}
        onClick={isCollapsible ? onToggle : undefined}
      >
        <div className="flex items-center">
          {isCollapsible && (
            <button
              className="text-white/70 hover:text-white mr-1"
            >
              {isCollapsed ? (
                <ChevronRight size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
          )}
          <h3 className="text-white/70 uppercase text-xs font-medium tracking-wider">
            {title}
          </h3>
        </div>
        {rightContent}
      </div>

      {/* Content */}
      {!isCollapsed && (
        <div className="mt-1 space-y-0.5">
          {children}
        </div>
      )}
    </div>
  );
} 