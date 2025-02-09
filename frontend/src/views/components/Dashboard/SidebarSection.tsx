import { ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

interface SidebarSectionProps {
  title: string;
  children: ReactNode;
  isCollapsible?: boolean;
  isCollapsed?: boolean;
  onToggle?: () => void;
  className?: string;
}

export function SidebarSection({
  title,
  children,
  isCollapsible = false,
  isCollapsed = false,
  onToggle,
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
            isCollapsed ? (
              <ChevronRight size={16} className="mr-1" />
            ) : (
              <ChevronDown size={16} className="mr-1" />
            )
          )}
          <span className="text-sm font-medium">{title}</span>
        </div>
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