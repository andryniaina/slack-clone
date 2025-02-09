interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
}

export const Button = ({ 
  children, 
  loading, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  disabled,
  ...props 
}: ButtonProps) => {
  const baseStyles = 'relative flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'text-white bg-[#611f69] hover:bg-[#4a1751] focus:ring-[#611f69] disabled:bg-[#611f69]/50',
    secondary: 'text-gray-700 bg-white hover:bg-gray-50 focus:ring-purple-500 disabled:bg-gray-100',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? 'Chargement...' : children}
    </button>
  );
}; 