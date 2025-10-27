interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'third' | 'fourth';
}

export default function Button({ children, variant = 'primary', ...props }: ButtonProps) {
  const variantStyles: Record<'primary' | 'secondary' | 'third' | 'fourth', string> = {
    primary: 'bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500',
    secondary: 'bg-gray-400 text-white hover:bg-gray-500 focus:ring-gray-500',
    third: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-600',
    fourth: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600'
  };

  return (
    <button 
      className={`${variantStyles[variant]} px-4 py-2 rounded-lg cursor-pointer flex items-center gap-2`}
      {...props}
    >
      {children}
    </button>
  );
}
