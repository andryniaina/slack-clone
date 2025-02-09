import { LucideIcon } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  rightElement?: React.ReactNode;
}

export const FormInput = ({ 
  icon: Icon, 
  rightElement, 
  className = '', 
  ...props 
}: FormInputProps) => {
  return (
    <div className="relative flex items-center">
      <Icon className="absolute left-3 h-5 w-5 text-gray-500" aria-hidden="true" />
      <input
        className={`appearance-none block w-full px-3 py-2 pl-10 ${
          rightElement ? 'pr-10' : ''
        } border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm bg-white disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
        {...props}
      />
      {rightElement && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {rightElement}
        </div>
      )}
    </div>
  );
}; 