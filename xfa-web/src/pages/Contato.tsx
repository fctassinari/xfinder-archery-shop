import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ContatoPage from "@/components/ContatoPage";

const ContatoRoute = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <ContatoPage />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default ContatoRoute;

