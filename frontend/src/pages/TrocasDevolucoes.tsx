import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { RefreshCw } from "lucide-react";

const TrocasDevolucoes = () => {
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <RefreshCw className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold">Trocas e Devoluções</h1>
          </div>
          
          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <p className="text-muted-foreground mb-6">
                Última atualização: Janeiro de 2025
              </p>
              <p>
                Na XFinder Archery, queremos que você esteja completamente satisfeito com sua compra. 
                Esta política explica como realizar trocas e devoluções de produtos adquiridos em nosso site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Direito de Arrependimento (CDC)</h2>
              <p className="mb-4">
                De acordo com o Código de Defesa do Consumidor (Art. 49), você tem o direito de desistir 
                da compra em até <strong>7 dias corridos</strong> após o recebimento do produto, sem necessidade 
                de justificativa.
              </p>
              
              <h3 className="text-xl font-semibold mb-3">Condições:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>O produto deve estar em sua embalagem original</li>
                <li>Não deve ter sido usado ou danificado</li>
                <li>Deve estar acompanhado de nota fiscal e acessórios</li>
                <li>A devolução do valor será feita na mesma forma de pagamento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Política de Troca</h2>
              <h3 className="text-xl font-semibold mb-3">2.1 Prazo para Troca</h3>
              <p className="mb-4">
                Aceitamos solicitações de troca em até <strong>30 dias corridos</strong> após o recebimento 
                do produto, nas seguintes situações:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Defeito de fabricação</li>
                <li>Produto errado enviado</li>
                <li>Produto danificado durante o transporte</li>
                <li>Divergência com a descrição do site</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.2 Produtos Não Trocáveis</h3>
              <p className="mb-4">Por motivos de higiene e segurança, não aceitamos trocas de:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Produtos personalizados ou feitos sob encomenda</li>
                <li>Itens de proteção corporal (braçadeiras, protetores de peito) já utilizados</li>
                <li>Cordas de arco cortadas ou instaladas</li>
                <li>Produtos em promoção ou liquidação (consulte condições específicas)</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">2.3 Estado do Produto</h3>
              <p className="mb-4">Para ser aceita, a troca deve atender aos seguintes critérios:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Produto sem sinais de uso</li>
                <li>Embalagem original intacta</li>
                <li>Todos os acessórios, manuais e brindes incluídos</li>
                <li>Nota fiscal original</li>
                <li>Etiquetas e lacres preservados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Como Solicitar Troca ou Devolução</h2>
              
              <div className="bg-muted p-6 rounded-lg mb-6">
                <h3 className="text-xl font-semibold mb-4">Passo a Passo:</h3>
                <ol className="list-decimal pl-6 space-y-3">
                  <li>
                    <strong>Entre em contato:</strong>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>E-mail: contato.xfinder@gmail.com</li>
                      <li>WhatsApp: (11) 99131-8744</li>
                      <li>Telefone: (11) 99131-8744</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Informe os dados:</strong>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Número do pedido</li>
                      <li>Nome completo</li>
                      <li>Motivo da troca/devolução</li>
                      <li>Fotos do produto (se aplicável)</li>
                    </ul>
                  </li>
                  <li>
                    <strong>Aguarde autorização:</strong> Nossa equipe analisará sua solicitação em até 2 dias úteis
                  </li>
                  <li>
                    <strong>Envie o produto:</strong> Após aprovação, você receberá instruções de postagem
                  </li>
                  <li>
                    <strong>Receba seu produto ou reembolso:</strong> Processamos em até 5 dias úteis após recebermos o produto
                  </li>
                </ol>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Custos de Frete</h2>
              
              <h3 className="text-xl font-semibold mb-3">4.1 Responsabilidade XFinder Archery</h3>
              <p className="mb-4">Arcamos com os custos de frete nos casos de:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Defeito de fabricação</li>
                <li>Produto errado enviado</li>
                <li>Produto danificado no transporte</li>
                <li>Divergência com a descrição</li>
              </ul>

              <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Responsabilidade do Cliente</h3>
              <p className="mb-4">O cliente arca com os custos de frete nos casos de:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Desistência da compra (arrependimento)</li>
                <li>Troca por escolha incorreta de tamanho/modelo</li>
                <li>Mudança de preferência</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Reembolso</h2>
              
              <h3 className="text-xl font-semibold mb-3">5.1 Prazo para Reembolso</h3>
              <p className="mb-4">
                Após recebermos e aprovarmos a devolução, o reembolso será processado em até <strong>10 dias úteis</strong>.
              </p>

              <h3 className="text-xl font-semibold mb-3">5.2 Forma de Reembolso</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Cartão de crédito:</strong> Estorno na fatura em 1-2 ciclos de faturamento</li>
                <li><strong>PIX/Boleto:</strong> Depósito na conta bancária informada em até 5 dias úteis</li>
                <li><strong>Vale-compras:</strong> Crédito disponível imediatamente para novas compras</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Garantia do Fabricante</h2>
              <p className="mb-4">
                Além da nossa política de trocas, todos os produtos possuem garantia do fabricante contra 
                defeitos de fabricação:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Arcos e acessórios estruturais:</strong> 12 meses</li>
                <li><strong>Flechas e pontas:</strong> 90 dias</li>
                <li><strong>Eletrônicos (miras, cronógrafos):</strong> 12 meses</li>
                <li><strong>Cordas e cabos:</strong> 90 dias</li>
              </ul>
              <p className="mt-4">
                <strong>Nota:</strong> A garantia não cobre danos causados por uso inadequado, quedas, 
                acidentes ou desgaste natural.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Produtos Danificados no Transporte</h2>
              <p className="mb-4">
                Se você receber um produto danificado:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Não aceite a entrega ou faça ressalvas na nota de entrega</li>
                <li>Tire fotos da embalagem e do produto</li>
                <li>Entre em contato conosco em até 24 horas</li>
                <li>Enviaremos um novo produto sem custo adicional</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Exceções e Casos Especiais</h2>
              
              <h3 className="text-xl font-semibold mb-3">8.1 Produtos Importados</h3>
              <p className="mb-4">
                Produtos importados podem ter prazos de troca estendidos devido à logística. 
                Entre em contato para informações específicas.
              </p>

              <h3 className="text-xl font-semibold mb-3">8.2 Itens em Promoção</h3>
              <p className="mb-4">
                Produtos em liquidação ou promoções especiais podem ter políticas de troca diferentes. 
                Verifique as condições específicas antes da compra.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Dicas para Evitar Trocas</h2>
              <div className="bg-primary/5 p-6 rounded-lg">
                <ul className="list-disc pl-6 space-y-2">
                  <li>Leia atentamente a descrição completa do produto</li>
                  <li>Verifique as especificações técnicas e medidas</li>
                  <li>Consulte nossa equipe em caso de dúvidas antes de comprar</li>
                  <li>Assista aos vídeos demonstrativos quando disponíveis</li>
                  <li>Leia as avaliações de outros clientes</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contato</h2>
              <p className="mb-4">
                Nossa equipe de atendimento está pronta para ajudar com trocas, devoluções ou qualquer dúvida:
              </p>
              <div className="bg-muted p-6 rounded-lg">
                <p><strong>XFinder Archery - Atendimento ao Cliente</strong></p>
                <p className="mt-2">📧 E-mail: contato.xfinder@gmail.com</p>
                <p>📱 WhatsApp: (11) 99131-8744</p>
                <p>📞 Telefone: (11) 99131-8744</p>
                <p className="mt-2">⏰ Horário de atendimento:</p>
                <p>Segunda a Sexta: 9h às 18h</p>
                <p>Sábado: 9h às 13h</p>
              </div>
            </section>

            <section className="bg-primary/10 p-6 rounded-lg">
              <p className="text-center font-semibold">
                💚 Sua satisfação é nossa prioridade! Estamos aqui para garantir a melhor experiência 
                em tiro com arco.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default TrocasDevolucoes;