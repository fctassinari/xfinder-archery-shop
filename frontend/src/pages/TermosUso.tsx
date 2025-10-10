import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { FileText } from "lucide-react";

const TermosUso = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <FileText className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold">Termos de Uso</h1>
          </div>
          
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <p className="text-muted-foreground mb-6">
                Última atualização: Janeiro de 2025
              </p>
              <p>
                Bem-vindo à XFinder Archery. Ao acessar e usar nosso site, você concorda com estes Termos de Uso. 
                Leia atentamente antes de realizar qualquer compra ou utilizar nossos serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar o site da XFinder Archery, você concorda em cumprir e estar vinculado a estes 
                Termos de Uso e todas as leis e regulamentos aplicáveis. Se você não concordar com algum destes 
                termos, está proibido de usar ou acessar este site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Uso do Site</h2>
              <h3 className="text-xl font-semibold mb-3">2.1 Licença de Uso</h3>
              <p className="mb-4">
                É concedida permissão para baixar temporariamente uma cópia dos materiais no site da XFinder Archery 
                apenas para visualização transitória pessoal e não comercial.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">2.2 Restrições</h3>
              <p className="mb-4">Você não pode:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modificar ou copiar os materiais</li>
                <li>Usar os materiais para fins comerciais ou exibição pública</li>
                <li>Tentar descompilar ou fazer engenharia reversa de qualquer software</li>
                <li>Remover quaisquer direitos autorais ou outras notações proprietárias</li>
                <li>Transferir os materiais para outra pessoa ou "espelhar" em qualquer outro servidor</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Cadastro e Conta</h2>
              <h3 className="text-xl font-semibold mb-3">3.1 Criação de Conta</h3>
              <p className="mb-4">
                Para realizar compras, você deve criar uma conta fornecendo informações precisas, completas e atuais. 
                Você é responsável por manter a confidencialidade de sua senha.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">3.2 Responsabilidade</h3>
              <p>
                Você é responsável por todas as atividades que ocorrem em sua conta. Notifique-nos imediatamente 
                sobre qualquer uso não autorizado.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Produtos e Preços</h2>
              <h3 className="text-xl font-semibold mb-3">4.1 Descrições de Produtos</h3>
              <p className="mb-4">
                Fazemos todos os esforços para exibir com precisão as cores e imagens dos produtos. No entanto, 
                não podemos garantir que a exibição de qualquer cor seja precisa.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">4.2 Preços</h3>
              <p className="mb-4">
                Os preços estão sujeitos a alterações sem aviso prévio. Reservamo-nos o direito de modificar ou 
                descontinuar produtos a qualquer momento. Todos os preços estão em Reais (R$) e incluem impostos 
                quando aplicável.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">4.3 Disponibilidade</h3>
              <p>
                A disponibilidade dos produtos está sujeita a confirmação. Reservamo-nos o direito de limitar 
                quantidades e recusar pedidos a nosso critério.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Pedidos e Pagamento</h2>
              <h3 className="text-xl font-semibold mb-3">5.1 Processamento de Pedidos</h3>
              <p className="mb-4">
                Ao fazer um pedido, você está fazendo uma oferta para comprar o produto. Todos os pedidos estão 
                sujeitos a aceitação e disponibilidade.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">5.2 Formas de Pagamento</h3>
              <p className="mb-4">Aceitamos:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cartões de crédito e débito</li>
                <li>PIX</li>
                <li>Boleto bancário</li>
              </ul>
              
              <h3 className="text-xl font-semibold mb-3">5.3 Cancelamento de Pedidos</h3>
              <p>
                Reservamo-nos o direito de recusar ou cancelar qualquer pedido por razões incluindo, mas não 
                limitado a: disponibilidade do produto, erros na descrição ou preço, ou problemas identificados 
                pelo nosso departamento de prevenção de fraudes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Entrega e Envio</h2>
              <p className="mb-4">
                Os prazos de entrega são estimativas e começam a contar a partir da confirmação do pagamento. 
                Não nos responsabilizamos por atrasos causados por transportadoras ou eventos fora de nosso controle.
              </p>
              <p>
                O risco de perda e o título dos produtos passam para você no momento da entrega à transportadora.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Propriedade Intelectual</h2>
              <p className="mb-4">
                Todo o conteúdo do site, incluindo texto, gráficos, logos, imagens, e software, é propriedade 
                da XFinder Archery ou de seus fornecedores de conteúdo e protegido por leis de direitos autorais.
              </p>
              <p>
                As marcas comerciais, logotipos e marcas de serviço exibidas no site são propriedade da 
                XFinder Archery. Você não pode usar essas marcas sem nossa permissão prévia por escrito.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Limitação de Responsabilidade</h2>
              <p>
                A XFinder Archery não será responsável por quaisquer danos indiretos, incidentais, especiais, 
                consequenciais ou punitivos, incluindo perda de lucros, dados, uso ou boa vontade, decorrentes 
                do uso ou incapacidade de usar nossos produtos ou serviços.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Garantias e Isenções</h2>
              <p className="mb-4">
                Os materiais no site são fornecidos "como estão". A XFinder Archery não oferece garantias, 
                expressas ou implícitas, e por este meio isenta e nega todas as outras garantias.
              </p>
              <p>
                Produtos esportivos vendidos por nós podem estar sujeitos a garantias de fabricantes. 
                Consulte a documentação do produto para detalhes específicos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Links para Terceiros</h2>
              <p>
                Nosso site pode conter links para sites de terceiros. Não temos controle sobre o conteúdo, 
                políticas de privacidade ou práticas desses sites e não assumimos responsabilidade por eles.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Modificações dos Termos</h2>
              <p>
                Reservamo-nos o direito de revisar estes Termos de Uso a qualquer momento. Ao continuar a usar 
                o site após a publicação de alterações, você concorda em ficar vinculado aos termos revisados.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Lei Aplicável</h2>
              <p>
                Estes Termos de Uso são regidos e interpretados de acordo com as leis do Brasil. Qualquer 
                disputa relacionada a estes termos será resolvida nos tribunais de São Paulo, SP.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Contato</h2>
              <p className="mb-2">Para questões sobre estes Termos de Uso, entre em contato:</p>
              <div className="bg-muted p-4 rounded-lg">
                <p><strong>XFinder Archery</strong></p>
                <p>E-mail: contato.xfinder@gmail.com</p>
                <p>Telefone: (11) 99999-9999</p>
                <p>Endereço: São Paulo, SP</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default TermosUso;