import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ProdutoDetalhesPage from "@/components/ProdutoDetalhesPage";

const ProdutoDetalhesRoute = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <ProdutoDetalhesPage />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default ProdutoDetalhesRoute;

