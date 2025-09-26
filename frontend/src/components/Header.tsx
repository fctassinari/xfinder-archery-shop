import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, User } from "lucide-react";
import Cart from "@/components/Cart";
import logo from "@/assets/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {/* Logo Flutuante */}
      <div className="fixed top-6 left-6 z-50">
        <a href="/">
          <img
            src={logo}
            alt="XFinder Archery"
            className="h-40 w-auto border-2 border-white rounded shadow-lg hover:shadow-xl transition-all duration-300"
          />
        </a>
      </div>

      <header className="bg-background border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 ml-20">
            {/* Espaço vazio onde estava o logo */}
            <div className="flex items-center space-x-2">
            </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-foreground hover:text-navy-primary transition-smooth">
              Início
            </a>
            <a href="/produtos" className="text-foreground hover:text-navy-primary transition-smooth">
              Produtos
            </a>
            <a href="/sobre" className="text-foreground hover:text-navy-primary transition-smooth">
              Sobre
            </a>
            <a href="/contato" className="text-foreground hover:text-navy-primary transition-smooth">
              Contato
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
            <Cart />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <a href="/" className="text-foreground hover:text-navy-primary transition-smooth">
                Início
              </a>
              <a href="/produtos" className="text-foreground hover:text-navy-primary transition-smooth">
                Produtos
              </a>
              <a href="/sobre" className="text-foreground hover:text-navy-primary transition-smooth">
                Sobre
              </a>
              <a href="/contato" className="text-foreground hover:text-navy-primary transition-smooth">
                Contato
              </a>
              <div className="flex items-center space-x-4 pt-4">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
                <Cart />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
    </>
  );
};

export default Header;