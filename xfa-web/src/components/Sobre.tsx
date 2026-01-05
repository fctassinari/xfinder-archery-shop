import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Award, Users, Zap, CheckCircle, ArrowRight, Heart } from "lucide-react";
import historyImage from "@/assets/wraping.jpg";
import heroImage from "@/assets/heroWrap.jpg";

const Sobre = () => {
  {/*}const stats = [
    { label: "Anos de Experiência", value: "10+", icon: Award },
    { label: "Arqueiros Satisfeitos", value: "400+", icon: Users },
    { label: "Produtos Vendidos", value: "1.000+", icon: Target },
    { label: "Competições", value: "100+", icon: Zap }
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
  ];*/}

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Hero Section */}
      <section className="relative py-20 bg-cover bg-fixed bg-center text-white" style={{ backgroundImage: `url(${heroImage})` }}>
      {/*<section className="relative py-20 bg-gradient-to-r from-navy-primary to-navy-primary/80 text-white" style={{ backgroundImage: `url(${heroImage})` }}>*/}
        <div className="container mx-auto px-4">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              XFinder Archery
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Somos uma marca brasileira dedicada a oferecer produtos de alta qualidade para tiro com arco,
              desenvolvidos por arqueiros e para arqueiros, com paixão e precisão.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Stats
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
          </div>*/}

          {/* Main Content
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Text Content }
            <div className="animate-slide-in">
              <h3 className="text-3xl font-bold text-navy-primary mb-6">
                Excelência em Cada Detalhe
              </h3>
              <div className="space-y-4 mb-8">
                {["Equipamentos de alta qualidade", "Consultoria técnica especializada", "Garantia em todos os produtos", "Suporte pós-venda completo"].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-coral-accent flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Values Grid }
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
          </div>*/}

          {/* Nossa História */}
          <section className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-navy-primary mb-6">Nossa História</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Fundada em 2015, a Xfinder Archery nasceu da paixão pelo tiro com arco, da necessidade de ter produtos Nacionais de fácil e rápido acesso
                    com o compromisso em fornecer equipamentos que fazem a diferença no desempenho de atletas profissionais e amadores.
                  </p>
                  <p>
                    Hoje, atendemos arqueiros em todo o Brasil e no exterior, desde iniciantes que estão dando
                    seus primeiros passos no esporte até competidores profissionais que buscam
                    equipamentos de alta performance para todas as modalidades.
                  </p>
                  <p>
                    Recurvo, Composto, Barebow, Target, Field, etc.
                  </p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-coral-accent/10 to-navy-primary/10 h-96 flex items-center justify-center rounded-lg overflow-hidden">
                {/*<Target className="h-32 w-32 text-coral-accent" />*/}
                <img
                  src={historyImage}
                  alt="Arrows"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </section>

          {/* Nossos Valores */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-center text-navy-primary mb-12">Nossos Valores</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center hover:shadow-elegant transition-smooth">
                <CardContent className="p-6">
                  <div className="bg-coral-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-coral-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy-primary mb-2">Precisão</h3>
                  <p className="text-muted-foreground">
                    Buscamos a excelência em tudo que fazemos, desde a seleção de produtos
                    até o atendimento ao cliente.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-elegant transition-smooth">
                <CardContent className="p-6">
                  <div className="bg-coral-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-coral-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy-primary mb-2">Comunidade</h3>
                  <p className="text-muted-foreground">
                    Acreditamos na força da comunidade de arqueiros e trabalhamos para
                    fortalecê-la no Brasil.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-elegant transition-smooth">
                <CardContent className="p-6">
                  <div className="bg-coral-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-coral-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy-primary mb-2">Qualidade</h3>
                  <p className="text-muted-foreground">
                    Oferecemos apenas produtos testados e aprovados, garantindo a melhor
                    experiência para nossos clientes.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-elegant transition-smooth">
                <CardContent className="p-6">
                  <div className="bg-coral-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-coral-accent" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy-primary mb-2">Paixão</h3>
                  <p className="text-muted-foreground">
                    Nossa paixão pelo tiro com arco é o que nos motiva a sempre buscar
                    o melhor para nossos clientes.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Nossa Missão */}
          <section className="mb-16">
            <div className="bg-gradient-to-r from-navy-primary to-navy-primary/80 text-white rounded-lg p-12 text-center">
              <h2 className="text-3xl font-bold mb-6">Nossa Missão</h2>
              <p className="text-xl max-w-4xl mx-auto">
                Democratizar o acesso ao tiro com arco no Brasil, oferecendo equipamentos
                de qualidade, conhecimento técnico e suporte especializado para arqueiros
                de todos os níveis, contribuindo para o crescimento e desenvolvimento do
                esporte no país.
              </p>
            </div>
          </section>

          {/* Diferenciais */}
          {/*<section className="mb-16">
            <h2 className="text-3xl font-bold text-center text-navy-primary mb-12">Nossos Diferenciais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-coral-accent text-white rounded-full p-2 flex-shrink-0">
                    <Target className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-navy-primary mb-2">Expertise Técnica</h3>
                    <p className="text-muted-foreground">
                      Nossa equipe é formada por arqueiros experientes que podem orientar
                      você na escolha dos melhores equipamentos.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-coral-accent text-white rounded-full p-2 flex-shrink-0">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-navy-primary mb-2">Produtos Testados</h3>
                    <p className="text-muted-foreground">
                      Todos os produtos são testados por nossa equipe antes de serem
                      oferecidos aos clientes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-coral-accent text-white rounded-full p-2 flex-shrink-0">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-navy-primary mb-2">Suporte Personalizado</h3>
                    <p className="text-muted-foreground">
                      Oferecemos suporte técnico personalizado para ajudar você a
                      aproveitar ao máximo seus equipamentos.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-coral-accent/10 to-navy-primary/10 h-80 flex items-center justify-center rounded-lg">
                <Target className="h-24 w-24 text-coral-accent" />
              </div>
            </div>
          </section>*/}

          {/* Compromisso */}
          <section>
            <div className="bg-muted/50 rounded-lg p-8">
              <h2 className="text-3xl font-bold text-center text-navy-primary mb-6">Nosso Compromisso</h2>
              <p className="text-lg text-muted-foreground text-center max-w-4xl mx-auto">
                Estamos comprometidos em ser mais do que uma simples loja. Queremos ser
                parceiros dos arqueiros brasileiros em sua jornada no esporte, oferecendo
                não apenas produtos, mas conhecimento, suporte e uma comunidade acolhedora
                para todos que compartilham nossa paixão pelo tiro com arco.
              </p>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default Sobre;