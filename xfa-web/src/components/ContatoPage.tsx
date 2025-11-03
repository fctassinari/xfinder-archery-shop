import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, AlertCircle } from "lucide-react";
import GoogleMap from "@/components/GoogleMap";
import heroImage from "@/assets/wraps.png";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

// Schema de validação com Zod
const contactSchema = z.object({
  nome: z.string()
    .trim()
    .min(2, { message: "Nome deve ter pelo menos 2 caracteres" })
    .max(100, { message: "Nome deve ter no máximo 100 caracteres" }),
  email: z.string()
    .trim()
    .email({ message: "E-mail inválido" })
    .max(255, { message: "E-mail deve ter no máximo 255 caracteres" }),
  telefone: z.string()
    .trim()
    .max(20, { message: "Telefone deve ter no máximo 20 caracteres" })
    .optional(),
  assunto: z.string()
    .trim()
    .max(200, { message: "Assunto deve ter no máximo 200 caracteres" })
    .optional(),
  mensagem: z.string()
    .trim()
    .min(10, { message: "Mensagem deve ter pelo menos 10 caracteres" })
    .max(1000, { message: "Mensagem deve ter no máximo 1000 caracteres" })
});

const ContatoPage = () => {
  const { toast } = useToast();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [assunto, setAssunto] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSendMessage = () => {
    // Limpar erros anteriores
    setErrors({});

    // Validar dados do formulário
    try {
      const validatedData = contactSchema.parse({
        nome,
        email,
        telefone: telefone || undefined,
        assunto: assunto || undefined,
        mensagem
      });

      // Se validação passou, enviar para WhatsApp
      const phoneNumber = "5511991318744";
      const fullMessage = `Olá! Meu nome é ${validatedData.nome}, meu telefone é ${validatedData.telefone || 'Não informado'} e meu e-mail é ${validatedData.email}.\n\nAssunto: ${validatedData.assunto || 'Não informado'}\n\nMensagem: ${validatedData.mensagem}`;
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(fullMessage)}`;
      
      window.open(whatsappUrl, "_blank");
      
      // Limpar formulário após envio
      setNome("");
      setEmail("");
      setTelefone("");
      setAssunto("");
      setMensagem("");

      toast({
        title: "Mensagem enviada!",
        description: "Você será redirecionado para o WhatsApp.",
      });

    } catch (error) {
      if (error instanceof z.ZodError) {
        // Mapear erros de validação
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((err) => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);

        toast({
          variant: "destructive",
          title: "Erro na validação",
          description: "Por favor, corrija os campos destacados.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      {/* Hero Section */}
      <section className="relative py-20 bg-cover bg-fixed bg-center text-white" style={{ backgroundImage: `url(${heroImage})` }}>
      {/*<section className="relative py-20 bg-gradient-to-r from-navy-primary to-navy-primary/80 text-white">*/}
        <div className="container mx-auto px-4">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Entre em Contato
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Nossa equipe de especialistas está pronta para ajudar você a encontrar
              o equipamento perfeito para suas necessidades.
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="animate-slide-in">
              <CardHeader>
                <CardTitle className="text-2xl text-navy-primary">
                  Envie sua Mensagem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Nome *
                    </label>
                    <Input 
                      placeholder="Seu nome completo" 
                      value={nome} 
                      onChange={(e) => setNome(e.target.value)}
                      className={errors.nome ? "border-red-500" : ""}
                      maxLength={100}
                    />
                    {errors.nome && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.nome}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      E-mail *
                    </label>
                    <Input 
                      type="email" 
                      placeholder="seu@email.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                      className={errors.email ? "border-red-500" : ""}
                      maxLength={255}
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Telefone
                  </label>
                  <Input 
                    placeholder="(99) 9999-9999" 
                    value={telefone} 
                    onChange={(e) => setTelefone(e.target.value)}
                    className={errors.telefone ? "border-red-500" : ""}
                    maxLength={20}
                  />
                  {errors.telefone && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.telefone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Assunto
                  </label>
                  <Input 
                    placeholder="Como podemos ajudar?" 
                    value={assunto} 
                    onChange={(e) => setAssunto(e.target.value)}
                    className={errors.assunto ? "border-red-500" : ""}
                    maxLength={200}
                  />
                  {errors.assunto && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.assunto}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Mensagem *
                  </label>
                  <Textarea
                    placeholder="Descreva sua necessidade ou dúvida..."
                    rows={5}
                    value={mensagem}
                    onChange={(e) => setMensagem(e.target.value)}
                    className={errors.mensagem ? "border-red-500" : ""}
                    maxLength={1000}
                  />
                  {errors.mensagem && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.mensagem}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    {mensagem.length}/1000 caracteres
                  </p>
                </div>

                <Button variant="archery" size="lg" className="w-full group" onClick={handleSendMessage}>
                  <Send className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  Enviar Mensagem
                </Button>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Card className="hover:shadow-elegant transition-smooth animate-fade-in">
                  <CardContent className="p-6 text-center">
                    <div className="bg-coral-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Phone className="h-8 w-8 text-coral-accent" />
                    </div>
                    <h3 className="font-semibold text-navy-primary mb-2">Telefone</h3>
                    <p className="text-muted-foreground">(11) 99131-8744</p>
                    <p className="text-sm text-muted-foreground">Seg-Sex: 9h às 18h</p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-elegant transition-smooth animate-fade-in" style={{animationDelay: '0.1s'}}>
                  <CardContent className="p-6 text-center">
                    <div className="bg-coral-accent/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="h-8 w-8 text-coral-accent" />
                    </div>
                    <h3 className="font-semibold text-navy-primary mb-2">E-mail</h3>
                    <p className="text-muted-foreground text-sm">contato.xfinder@gmail.com.br</p>
                    <p className="text-sm text-muted-foreground">Resposta em 24h</p>
                  </CardContent>
                </Card>
              </div>

              {/* Address & Hours */}
              <Card className="animate-fade-in" style={{animationDelay: '0.2s'}}>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-coral-accent/10 p-3 rounded-full flex-shrink-0">
                        <MapPin className="h-6 w-6 text-coral-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-navy-primary mb-2">Localização</h3>
                        <p className="text-muted-foreground">
                          Mooca<br/>
                          São Paulo / SP - Brasil
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="bg-coral-accent/10 p-3 rounded-full flex-shrink-0">
                        <Clock className="h-6 w-6 text-coral-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-navy-primary mb-2">Horário</h3>
                        <div className="text-muted-foreground space-y-1">
                          <p>Segunda à Sexta: 9h às 18h</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Google Maps */}
              <Card className="animate-fade-in" style={{animationDelay: '0.3s'}}>
                <CardContent className="p-0">
                  <GoogleMap className="h-64 rounded-lg overflow-hidden" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContatoPage;

