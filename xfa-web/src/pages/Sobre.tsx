import Header from "@/components/Header";
import Sobre from "@/components/Sobre";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const SobreRoute = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Sobre />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default SobreRoute;