import { Card, CardContent } from '@/components/ui/card'
import { Target, Users, Award, Heart } from 'lucide-react'

export default function Sobre() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">Sobre a Xfinder Archery</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Somos especialistas em equipamentos de tiro com arco, dedicados a fornecer 
          produtos de alta qualidade para arqueiros de todos os níveis.
        </p>
      </div>

      {/* Nossa História */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">Nossa História</h2>
            <div className="space-y-4 text-gray-600">
              <p>
                A Xfinder Archery nasceu da paixão pelo tiro com arco e do desejo de 
                democratizar o acesso a equipamentos de qualidade no Brasil. Fundada em 2020, 
                nossa empresa começou como um pequeno negócio familiar e cresceu para se tornar 
                uma referência no mercado nacional.
              </p>
              <p>
                Nossos fundadores, arqueiros experientes com mais de 15 anos de experiência 
                no esporte, identificaram a necessidade de uma loja especializada que oferecesse 
                não apenas produtos, mas também conhecimento técnico e suporte personalizado.
              </p>
              <p>
                Hoje, atendemos arqueiros em todo o Brasil, desde iniciantes que estão dando 
                seus primeiros passos no esporte até competidores profissionais que buscam 
                equipamentos de alta performance.
              </p>
            </div>
          </div>
          <div className="bg-gray-200 h-96 flex items-center justify-center rounded-lg">
            <Target className="h-32 w-32 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Nossos Valores */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Nossos Valores</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Target className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Precisão</h3>
              <p className="text-gray-600">
                Buscamos a excelência em tudo que fazemos, desde a seleção de produtos 
                até o atendimento ao cliente.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Comunidade</h3>
              <p className="text-gray-600">
                Acreditamos na força da comunidade de arqueiros e trabalhamos para 
                fortalecê-la no Brasil.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Qualidade</h3>
              <p className="text-gray-600">
                Oferecemos apenas produtos testados e aprovados, garantindo a melhor 
                experiência para nossos clientes.
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Paixão</h3>
              <p className="text-gray-600">
                Nossa paixão pelo tiro com arco é o que nos motiva a sempre buscar 
                o melhor para nossos clientes.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Nossa Missão */}
      <section className="mb-16">
        <div className="bg-primary text-white rounded-lg p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Nossa Missão</h2>
          <p className="text-xl max-w-4xl mx-auto">
            Democratizar o acesso ao tiro com arco no Brasil, oferecendo equipamentos 
            de qualidade, conhecimento técnico, suporte especializado e preços acessíveis para arqueiros
            de todos os níveis, contribuindo para o crescimento e desenvolvimento do 
            esporte no país.
          </p>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Nossos Diferenciais</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-primary text-white rounded-full p-2 flex-shrink-0">
                <Target className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Expertise Técnica</h3>
                <p className="text-gray-600">
                  Nossa equipe é formada por arqueiros experientes que podem orientar 
                  você na escolha dos melhores equipamentos.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary text-white rounded-full p-2 flex-shrink-0">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Produtos Testados</h3>
                <p className="text-gray-600">
                  Todos os produtos são testados por nossa equipe antes de serem 
                  oferecidos aos clientes.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-primary text-white rounded-full p-2 flex-shrink-0">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Suporte Personalizado</h3>
                <p className="text-gray-600">
                  Oferecemos suporte técnico personalizado para ajudar você a 
                  aproveitar ao máximo seus equipamentos.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-200 h-80 flex items-center justify-center rounded-lg">
            <Target className="h-24 w-24 text-gray-400" />
          </div>
        </div>
      </section>

      {/* Compromisso */}
      <section>
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-6">Nosso Compromisso</h2>
          <p className="text-lg text-gray-600 text-center max-w-4xl mx-auto">
            Estamos comprometidos em ser mais do que uma simples loja. Queremos ser 
            parceiros dos arqueiros brasileiros em sua jornada no esporte, oferecendo 
            não apenas produtos, mas conhecimento, suporte e uma comunidade acolhedora 
            para todos que compartilham nossa paixão pelo tiro com arco.
          </p>
        </div>
      </section>
    </div>
  )
}

