import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Award, Users, Zap, CheckCircle, ArrowRight } from "lucide-react";
import hwrap from "@/assets/flechasnock.png";

const About = () => {
  const stats = [
    { label: "Anos de Experiência", value: "10+", icon: Award },
    { label: "Arqueiros Satisfeitos", value: "400+", icon: Users },
    { label: "Produtos Vendidos", value: "1.000+", icon: Target },
    { label: "Competições com atletas utilizando nossos produtos", value: "500+", icon: Zap }
  ];

  const values = [
    {
      title: "Qualidade Premium",
      description: "Trabalhamos apenas com materiais de primeira linha."
    },
    {
      title: "Expertise Técnica",
      description: "Nossa equipe é formada por arqueiros experientes que entendem as necessidades de cada atleta."
    },
    {
      title: "Suporte Completo",
      description: "Oferecemos consultoria técnica, manutenção e ajustes para garantir máximo desempenho."
    },
    {
      title: "Atendimento Especializado",
      description: "Nossa equipe está pronta a ajuda-lo a escolher o melhor."
    }
  ];

  return (
    <section id="sobre" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-navy-primary mb-4">
            Somos a XFinder Archery
          </h2>
          {/*}<p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Somos uma marca brasileira dedicada a oferecer produtos de alta qualidade para tiro com arco, desenvolvidos por arqueiros e para arqueiros, com paixão e precisão.
          </p>*/}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="text-center p-6 hover:shadow-elegant transition-smooth animate-fade-in group" style={{animationDelay: `${index * 0.1}s`}}>
                <CardContent className="p-0">
                  <div className="bg-coral-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-coral-accent/20 transition-smooth">
                    <Icon className="h-8 w-8 text-coral-accent" />
                  </div>
                  <div className="text-3xl font-bold text-navy-primary mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          {/* Text Content */}
          <div className="animate-slide-in">
            {/*<h3 className="text-3xl font-bold text-navy-primary mb-6">
              Excelência em Cada Detalhe
            </h3>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              A XFinder Archery nasceu da paixão pelo tiro com arco e do compromisso em fornecer 
              equipamentos que fazem a diferença no desempenho de atletas profissionais e amadores.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Nossa missão é democratizar o acesso a equipamentos de alta qualidade, mantendo 
              sempre os mais altos padrões de qualidade e atendimento personalizado.
            </p>*/}
            
{/*            <div className="space-y-4 mb-8">
              {["Equipamentos de alta qualidade", "Consultoria técnica especializada", "Garantia em todos os produtos", "Suporte pós-venda completo"].map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-coral-accent flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>*/}
              <div className="bg-gradient-to-br from-coral-accent/10 to-navy-primary/10 h-96 flex items-center justify-center rounded-lg">
                {/*<Target className="h-32 w-32 text-coral-accent" />*/}
                <img
                  src={hwrap}
                  alt="Wrap"
                  className="w-full h-full object-cover"
                />
              </div>

            <a href="/sobre" >
            <Button variant="archery" size="lg" className="group">
              Conheça Nossa História
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            </a>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="p-6 hover:shadow-elegant transition-smooth animate-fade-in" style={{animationDelay: `${index * 0.15}s`}}>
                <CardContent className="p-0">
                  <h4 className="font-semibold text-navy-primary mb-3">{value.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;