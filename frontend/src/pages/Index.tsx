import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ProductsHome from "@/components/ProductsHome";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <ProductsHome />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
