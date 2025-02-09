import { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
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
  isCollapsible = true,
  isCollapsed = false,
  onToggle,
  className
}: SidebarSectionProps) {
  return (
    <div className={clsx("py-1", className)}>
      {/* Header */}
      <button
        onClick={isCollapsible ? onToggle : undefined}
        className={clsx(
          "w-full px-2 py-1 flex items-center text-white/70 hover:text-white",
          isCollapsible && "cursor-pointer"
        )}
      >
        {isCollapsible && (
          <ChevronDown
            size={16}
            className={clsx(
              "mr-1 transition-transform",
              isCollapsed && "transform rotate-180"
            )}
          />
        )}
        <span className="text-sm font-medium">{title}</span>
      </button>

      {/* Content */}
      {!isCollapsed && (
        <div className="mt-1 space-y-0.5">
          {children}
        </div>
      )}
    </div>
  );
} 