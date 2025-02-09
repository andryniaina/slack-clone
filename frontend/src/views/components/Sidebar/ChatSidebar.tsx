import { ReactNode } from 'react';
import { Plus } from 'lucide-react';
import { SidebarSection } from '../Dashboard/SidebarSection';
import { useCollapsibleState } from '../../../hooks/ui/useCollapsibleState';

interface ChatSidebarProps {
  title: string;
  onCreateClick?: () => void;
  children: ReactNode;
  collapsibleKey: string;
  sectionId: string;
}

export function ChatSidebar({
  title,
  onCreateClick,
  children,
  collapsibleKey,
  sectionId
}: ChatSidebarProps) {
  const [collapsibleState, toggleSection] = useCollapsibleState(collapsibleKey, {
    [sectionId]: false
  });

  return (
    <div className="w-[260px] bg-[#512654] flex flex-col flex-shrink-0 rounded-lg">
      {/* Header */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center">
          <h1 className="text-white font-semibold">{title}</h1>
        </div>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        <SidebarSection
          title={title}
          isCollapsible={true}
          isCollapsed={collapsibleState[sectionId]}
          onToggle={() => toggleSection(sectionId)}
        >
          {children}
        </SidebarSection>
      </div>

      {/* Create Button */}
      {onCreateClick && (
        <div className="p-2 border-t border-white/10">
          <button
            onClick={onCreateClick}
            className="w-full px-2 py-1 text-white/70 hover:text-white hover:bg-[#350D36] rounded flex items-center text-sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Créer un canal
          </button>
        </div>
      )}
    </div>
  );
} 