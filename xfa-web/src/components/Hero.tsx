import { Button } from "@/components/ui/button";
import { ArrowRight, Target, Award, Zap } from "lucide-react";
import heroImage from "@/assets/flechas.png";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Arrows"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-primary/70 via-navy-primary/30 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-3xl">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Qualidade e paixão no
              <span className="text-coral-accent"> Tiro com Arco</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Produtos profissionais desenvolvidos no Brasil por arqueiros para arqueiros.              
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button variant="accent" size="xl" className="group" asChild>
                <a href="/produtos">
                  Ver Produtos
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
              <Button variant="outline" size="xl" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                Saiba Mais
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3 text-white/90">
                <div className="bg-coral-accent/20 p-3 rounded-full">
                  <Target className="h-6 w-6 text-coral-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Precisão Máxima</h3>
                  <p className="text-sm opacity-80">Produtos dimensionados adequadamente</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-white/90">
                <div className="bg-coral-accent/20 p-3 rounded-full">
                  <Award className="h-6 w-6 text-coral-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Qualidade</h3>
                  <p className="text-sm opacity-80">Matéria Prima de primeira linha</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 text-white/90">
                <div className="bg-coral-accent/20 p-3 rounded-full">
                  <Zap className="h-6 w-6 text-coral-accent" />
                </div>
                <div>
                  <h3 className="font-semibold">Durabilidade</h3>
                  <p className="text-sm opacity-80">Produtos com longa Vida Util</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Arrow */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-6 border-2 border-white/50 border-t-0 border-l-0 transform rotate-45"></div>
      </div>
    </section>
  );
};

export default Hero;