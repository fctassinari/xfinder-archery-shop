import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface LogoutButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export const LogoutButton = ({ variant = 'ghost', size = 'default', className }: LogoutButtonProps) => {
  const { logout } = useAuth();

  return (
    <Button
      onClick={logout}
      variant={variant}
      size={size}
      className={className}
    >
      <LogOut className="h-4 w-4" />
      Sair
    </Button>
  );
};

