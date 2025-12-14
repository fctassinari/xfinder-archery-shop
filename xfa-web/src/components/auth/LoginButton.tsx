import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, User } from "lucide-react";

export const LoginButton = () => {
  const { login, isLoading } = useAuth();

  return (
    <Button
      onClick={login}
      disabled={isLoading}
      variant="ghost" size="icon"
    >
      <User className="h-5 w-5" />
    </Button>
  );
};

