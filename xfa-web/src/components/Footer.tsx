import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Instagram } from "lucide-react";
import logoBlanco from "@/assets/xfinder_Logo_nome-branco.png";

const Footer = () => {
  return (
    <footer className="bg-navy-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">XFinder Archery</h3>
              <p className="text-white/80 leading-relaxed">
                Sua parceira em equipamentos de tiro com arco competitivo. 
                Qualidade, precisão e performance em cada produto.
              </p>
            </div>
          </div>

          {/* Siga-nos */}
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg mb-6">Siga-nos</h3>
            </div>

            <div className="flex space-x-4">
              {/*<Button variant="ghost" size="icon" className="hover:bg-white/10 text-white hover:text-coral-accent">
                <Facebook className="h-5 w-5" />
              </Button>*/}

              <Button variant="ghost"  className="hover:bg-white/10 text-white hover:text-coral-accent">
                <a href="https://www.instagram.com/xfa.archery?utm_source=qr&igsh=Y3dtcGJsbDRzdnVp" target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-5 w-5" />
                </a>
              </Button>
              {/*<Button variant="ghost" size="icon" className="hover:bg-white/10 text-white hover:text-coral-accent">
                <Youtube className="h-5 w-5" />
              </Button>*/}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-lg mb-6">Links Rápidos</h4>
            <nav className="space-y-3">
              <a href="/" className="block text-white/80 hover:text-coral-accent transition-smooth">
                Início
              </a>
              <a href="/produtos" className="block text-white/80 hover:text-coral-accent transition-smooth">
                Produtos
              </a>
              <a href="/sobre" className="block text-white/80 hover:text-coral-accent transition-smooth">
                Sobre Nós
              </a>
              <a href="#contact" className="block text-white/80 hover:text-coral-accent transition-smooth">
                Contato
              </a>
            </nav>
          </div>

          {/* Categories 
          <div>
            <h4 className="font-semibold text-lg mb-6">Categorias</h4>
            <nav className="space-y-3">
              <a href="#" className="block text-white/80 hover:text-coral-accent transition-smooth">
                Arcos Recurvos
              </a>
              <a href="#" className="block text-white/80 hover:text-coral-accent transition-smooth">
                Flechas
              </a>
              <a href="#" className="block text-white/80 hover:text-coral-accent transition-smooth">
                Acessórios
              </a>
              <a href="#" className="block text-white/80 hover:text-coral-accent transition-smooth">
                Proteções
              </a>
              <a href="#" className="block text-white/80 hover:text-coral-accent transition-smooth">
                Kits Completos
              </a>
            </nav>
          </div>

          {/* Logo */}
          <div className="flex items-center justify-center md:justify-start">
            <img 
              src={logoBlanco}
              alt="XFinder Archery Logo" 
              className="w-full max-w-[200px] h-auto object-contain"
            />
          </div>

        </div>

        {/* Contact Info */}
        <div className="border-t border-white/20 pt-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <div className="bg-coral-accent/20 p-3 rounded-full">
                <Phone className="h-5 w-5 text-coral-accent" />
              </div>
              <div>
                <p className="font-semibold">Telefone</p>
                <p className="text-white/80">(11) 99131-8744</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-coral-accent/20 p-3 rounded-full">
                <Mail className="h-5 w-5 text-coral-accent" />
              </div>
              <div>
                <p className="font-semibold">E-mail</p>
                <p className="text-white/80">contato.xfinder@gmail.com</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-coral-accent/20 p-3 rounded-full">
                <a
                  href="https://maps.google.com/?q=Mooca,+São+Paulo,+SP,+Brasil"
                  target="_blank">
                <MapPin className="h-5 w-5 text-coral-accent" />
                </a>
              </div>
              <div>

                <p className="font-semibold">Localização</p>
                <p className="text-white/80">Mooca</p>
                <p className="text-white/80">São Paulo / SP - Brasil</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-white/60 text-sm">
              © 2025 XFinder Archery. Todos os direitos reservados.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="/politica-privacidade" className="text-white/60 hover:text-coral-accent transition-smooth">
                Política de Privacidade
              </a>
              <a href="/termos-uso" className="text-white/60 hover:text-coral-accent transition-smooth">
                Termos de Uso
              </a>
              <a href="/trocas-devolucoes" className="text-white/60 hover:text-coral-accent transition-smooth">
                Trocas e Devoluções
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;