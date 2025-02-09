interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

export function Tooltip({ children, content, position = 'right' }: TooltipProps) {
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2'
  };

  return (
    <div className="relative group">
      {children}
      <div className={`absolute ${positionClasses[position]} scale-0 transition-all duration-100 origin-center group-hover:scale-100 z-50`}>
        <div className="bg-[#1A1A1A] text-white text-sm rounded-lg py-2 px-3 whitespace-nowrap">
          {content}
        </div>
      </div>
    </div>
  );
} 