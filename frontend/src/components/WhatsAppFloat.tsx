import { Button } from "@/components/ui/button";
import whatsapp from "@/assets/whatsapp.png";

const WhatsAppFloat = () => {
  const handleWhatsAppClick = () => {
    // Substitua pelo seu número de WhatsApp
    const phoneNumber = "5511991318744"; // Formato: 55 + DDD + número
    const message = "Olá! Gostaria de saber mais sobre os produtos da XFinder.";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 z-50 p-0"
      size="icon"
    >
      <img src={whatsapp} alt="WhatsApp" className="h-12 w-12" />
    </Button>
  );
};

export default WhatsAppFloat;