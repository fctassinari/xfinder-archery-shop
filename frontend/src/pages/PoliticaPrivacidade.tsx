import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Shield } from "lucide-react";

const PoliticaPrivacidade = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Shield className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold">Política de Privacidade</h1>
          </div>
          
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <p className="text-muted-foreground mb-6">
                Última atualização: Janeiro de 2025
              </p>
              <p>
                A XFinder Archery está comprometida em proteger sua privacidade. Esta Política de Privacidade 
                explica como coletamos, usamos, divulgamos e protegemos suas informações quando você visita 
                nosso site e realiza compras.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Informações que Coletamos</h2>
              <h3 className="text-xl font-semibold mb-3">1.1 Informações Pessoais</h3>
              <p className="mb-4">Coletamos as seguintes informações quando você:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cria uma conta: nome, e-mail, telefone, CPF</li>
                <li>Realiza uma compra: endereço de entrega e cobrança, dados de pagamento</li>
                <li>Entra em contato: nome, e-mail, mensagem</li>
                <li>Assina nossa newsletter: e-mail</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">1.2 Informações de Navegação</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Endereço IP</li>
                <li>Tipo de navegador e dispositivo</li>
                <li>Páginas visitadas e tempo de permanência</li>
                <li>Cookies e tecnologias similares</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Como Usamos Suas Informações</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Processar e entregar seus pedidos</li>
                <li>Gerenciar sua conta e preferências</li>
                <li>Enviar comunicações sobre pedidos e atualizações</li>
                <li>Melhorar nossos produtos e serviços</li>
                <li>Personalizar sua experiência de compra</li>
                <li>Prevenir fraudes e garantir segurança</li>
                <li>Cumprir obrigações legais e regulatórias</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Compartilhamento de Informações</h2>
              <p className="mb-4">Compartilhamos suas informações apenas quando necessário:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Prestadores de serviços:</strong> transportadoras, processadores de pagamento, plataformas de e-mail</li>
                <li><strong>Parceiros comerciais:</strong> apenas com seu consentimento explícito</li>
                <li><strong>Autoridades legais:</strong> quando exigido por lei ou para proteger nossos direitos</li>
              </ul>
              <p className="mt-4">
                Nunca vendemos suas informações pessoais para terceiros.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Cookies</h2>
              <p className="mb-4">
                Utilizamos cookies para melhorar sua experiência. Você pode gerenciar preferências de cookies 
                através das configurações do seu navegador. Tipos de cookies que usamos:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essenciais:</strong> necessários para o funcionamento do site</li>
                <li><strong>Performance:</strong> ajudam a entender como você usa o site</li>
                <li><strong>Funcionais:</strong> lembram suas preferências</li>
                <li><strong>Marketing:</strong> personalizam anúncios (apenas com seu consentimento)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Segurança dos Dados</h2>
              <p>
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações, 
                incluindo criptografia SSL, servidores seguros e controles de acesso restritos. No entanto, 
                nenhum método de transmissão pela internet é 100% seguro.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Seus Direitos (LGPD)</h2>
              <p className="mb-4">De acordo com a Lei Geral de Proteção de Dados, você tem direito a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Confirmar a existência de tratamento de dados</li>
                <li>Acessar seus dados pessoais</li>
                <li>Corrigir dados incompletos ou desatualizados</li>
                <li>Solicitar a anonimização ou eliminação de dados</li>
                <li>Revogar consentimento</li>
                <li>Solicitar portabilidade dos dados</li>
              </ul>
              <p className="mt-4">
                Para exercer seus direitos, entre em contato através de: contato.xfinder@gmail.com
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Retenção de Dados</h2>
              <p>
                Mantemos suas informações apenas pelo tempo necessário para cumprir as finalidades descritas 
                nesta política ou conforme exigido por lei. Dados de transações são mantidos por no mínimo 
                5 anos conforme legislação fiscal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Menores de Idade</h2>
              <p>
                Nosso site não é direcionado a menores de 18 anos. Não coletamos intencionalmente informações 
                de menores sem o consentimento dos pais ou responsáveis.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Alterações nesta Política</h2>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre mudanças 
                significativas através do site ou por e-mail.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contato</h2>
              <p className="mb-2">Para questões sobre esta Política de Privacidade, entre em contato:</p>
              <div className="bg-muted p-4 rounded-lg">
                <p><strong>XFinder Archery</strong></p>
                <p>E-mail: contato.xfinder@gmail.com</p>
                <p>Telefone: (11) 99131-8744</p>
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

export default PoliticaPrivacidade;