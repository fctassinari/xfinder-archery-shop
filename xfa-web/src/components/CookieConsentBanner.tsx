import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Cookie } from "lucide-react";
import { Link } from "react-router-dom";

const COOKIE_CONSENT_KEY = "xfinder-cookie-consent";

interface CookieConsentBannerProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

export const CookieConsentBanner = ({ 
  onAccept, 
  onDecline 
}: CookieConsentBannerProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já deu consentimento
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Aguardar um pouco antes de mostrar o banner para melhor UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    // Salvar consentimento
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      accepted: true,
      timestamp: new Date().toISOString(),
    }));
    
    setIsVisible(false);
    onAccept?.();
  };

  const handleDecline = () => {
    // Salvar que o usuário recusou (opcional, dependendo da política)
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
      accepted: false,
      timestamp: new Date().toISOString(),
    }));
    
    setIsVisible(false);
    onDecline?.();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg animate-in slide-in-from-bottom duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Ícone e Texto */}
          <div className="flex items-start gap-3 flex-1">
            <div className="mt-1">
              <Cookie className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm md:text-base mb-1">
                Uso de Cookies
              </h3>
              <p className="text-sm text-muted-foreground">
                Utilizamos cookies <strong>exclusivamente para o funcionamento do site</strong>, 
                incluindo autenticação e preferências de interface. 
                Ao continuar navegando, você concorda com o uso desses cookies essenciais.
                {" "}
                <Link 
                  to="/politica-privacidade" 
                  className="text-primary hover:underline font-medium"
                >
                  Saiba mais
                </Link>
              </p>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="flex-1 md:flex-initial"
            >
              Recusar
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="flex-1 md:flex-initial"
            >
              Aceitar
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAccept}
              className="hidden md:flex"
              aria-label="Fechar"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Função utilitária para verificar se o usuário deu consentimento
export const hasCookieConsent = (): boolean => {
  try {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) return false;
    
    const parsed = JSON.parse(consent);
    return parsed.accepted === true;
  } catch {
    return false;
  }
};

// Função utilitária para remover consentimento (útil para testes)
export const clearCookieConsent = (): void => {
  localStorage.removeItem(COOKIE_CONSENT_KEY);
};
