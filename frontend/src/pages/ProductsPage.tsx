import Header from "@/components/Header";
import ProductsPage from "@/components/ProductsPage";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const ProductsPageRoute = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <ProductsPage />
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default ProductsPageRoute;