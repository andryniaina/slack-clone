import { useEffect, useRef } from 'react';

interface CreateNewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChannel: () => void;
}

export function CreateNewModal({ 
  isOpen, 
  onClose,
  onCreateChannel
}: CreateNewModalProps) {
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
      style={{ transform: 'translateY(calc(100% - 60px)) translateX(calc(100% - 270px))' }}
    >
      {/* Actions */}
      <div className="p-2 space-y-1">
        <button
          onClick={onCreateChannel}
          className="w-full text-left px-3 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 hover:shadow-sm rounded transition-all duration-150 ease-in-out group"
        >
          Créer un canal
        </button>
      </div>
    </div>
  );
} 