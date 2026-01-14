import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { useAuth } from '@/contexts/AuthContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/services/apiClient';
import { Loader2, User } from 'lucide-react';
import heroImage from '@/assets/lubepuller.jpg';

const Profile = () => {
  // useRequireAuth garante que Keycloak seja inicializado quando acessa esta página
  useRequireAuth();
  const { customer, user, syncCustomer } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: customer?.name || '',
    email: customer?.email || user?.email || '',
    phone: customer?.phone || '',
    cpf: customer?.cpf || '',
    cep: customer?.cep || '',
    address: customer?.address || '',
    number: customer?.number || '',
    complement: customer?.complement || '',
    neighborhood: customer?.neighborhood || '',
    city: customer?.city || '',
    state: customer?.state || '',
    acceptsPromotionalEmails: customer?.acceptsPromotionalEmails || false,
  });

  // Atualizar formData quando customer mudar
  useEffect(() => {
    if (customer && !isEditing) {
      setFormData({
        name: customer.name || '',
        email: customer.email || user?.email || '',
        phone: customer.phone || '',
        cpf: customer.cpf || '',
        cep: customer.cep || '',
        address: customer.address || '',
        number: customer.number || '',
        complement: customer.complement || '',
        neighborhood: customer.neighborhood || '',
        city: customer.city || '',
        state: customer.state || '',
        acceptsPromotionalEmails: customer.acceptsPromotionalEmails || false,
      });
    }
  }, [customer, user?.email, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!customer) {
      toast({
        title: 'Erro',
        description: 'Customer não encontrado. Tente sincronizar primeiro.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.put(`/api/customers/${customer.id}`, formData);
      if (response.status === 200) {
        toast({
          title: 'Sucesso',
          description: 'Perfil atualizado com sucesso!',
        });
        setIsEditing(false);
        // Recarregar dados do customer
        await syncCustomer();
      }
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.response?.data?.error || 'Erro ao atualizar perfil',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return value;
  };

  const formatCEP = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 8) {
      return numbers.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return value;
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  if (!customer && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <Header />
        <section className="relative py-20 bg-cover bg-fixed bg-center text-white" style={{ backgroundImage: `url(${heroImage})` }}>
          <div className="container mx-auto px-4">
            <div className="text-center animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                Meu Perfil
              </h1>
            </div>
          </div>
        </section>
        <section className="py-12">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto animate-slide-in">
              <CardHeader>
                <CardTitle>Carregando...</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </section>
        <Footer />
        <WhatsAppFloat />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Header />
      {/* Hero Section */}
      <section className="relative py-20 bg-cover bg-fixed bg-center text-white" style={{ backgroundImage: `url(${heroImage})` }}>
        <div className="container mx-auto px-4">
          <div className="text-center animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Meu Perfil
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Gerencie suas informações pessoais e dados de entrega
            </p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto animate-slide-in">
            <CardHeader>
              <CardTitle className="text-2xl text-navy-primary">Meu Perfil</CardTitle>
              <CardDescription>
                Gerencie suas informações pessoais e dados de entrega
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
            {!customer ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Seus dados ainda não foram sincronizados. Clique no botão abaixo para sincronizar.
                </p>
                <Button 
                  variant="archery" 
                  size="lg" 
                  onClick={syncCustomer} 
                  disabled={isLoading}
                  className="w-full sm:w-auto"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sincronizando...
                    </>
                  ) : (
                    <>
                      <User className="mr-2 h-5 w-5" />
                      Sincronizar Dados
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium text-foreground mb-2 block">
                      Nome Completo
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                      E-mail
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="text-sm font-medium text-foreground mb-2 block">
                      Telefone
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formatPhone(formData.phone)}
                      onChange={(e) => {
                        const numbers = e.target.value.replace(/\D/g, '');
                        setFormData((prev) => ({ ...prev, phone: numbers }));
                      }}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label htmlFor="cpf" className="text-sm font-medium text-foreground mb-2 block">
                      CPF
                    </label>
                    <Input
                      id="cpf"
                      name="cpf"
                      value={formatCPF(formData.cpf)}
                      onChange={(e) => {
                        const numbers = e.target.value.replace(/\D/g, '');
                        setFormData((prev) => ({ ...prev, cpf: numbers }));
                      }}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label htmlFor="cep" className="text-sm font-medium text-foreground mb-2 block">
                      CEP
                    </label>
                    <Input
                      id="cep"
                      name="cep"
                      value={formatCEP(formData.cep)}
                      onChange={(e) => {
                        const numbers = e.target.value.replace(/\D/g, '');
                        setFormData((prev) => ({ ...prev, cep: numbers }));
                      }}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="text-sm font-medium text-foreground mb-2 block">
                      Estado
                    </label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      maxLength={2}
                      className="uppercase"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label htmlFor="address" className="text-sm font-medium text-foreground mb-2 block">
                      Endereço
                    </label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label htmlFor="number" className="text-sm font-medium text-foreground mb-2 block">
                      Número
                    </label>
                    <Input
                      id="number"
                      name="number"
                      value={formData.number}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label htmlFor="complement" className="text-sm font-medium text-foreground mb-2 block">
                      Complemento
                    </label>
                    <Input
                      id="complement"
                      name="complement"
                      value={formData.complement}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label htmlFor="neighborhood" className="text-sm font-medium text-foreground mb-2 block">
                      Bairro
                    </label>
                    <Input
                      id="neighborhood"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="text-sm font-medium text-foreground mb-2 block">
                      Cidade
                    </label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="pt-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="acceptsPromotionalEmails"
                      checked={formData.acceptsPromotionalEmails}
                      onCheckedChange={(checked) => 
                        setFormData((prev) => ({ ...prev, acceptsPromotionalEmails: checked === true }))
                      }
                      disabled={!isEditing}
                    />
                    <label
                      htmlFor="acceptsPromotionalEmails"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Aceito receber emails promocionais
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => {
                          setIsEditing(false);
                          // Resetar formData
                          setFormData({
                            name: customer?.name || '',
                            email: customer?.email || user?.email || '',
                            phone: customer?.phone || '',
                            cpf: customer?.cpf || '',
                            cep: customer?.cep || '',
                            address: customer?.address || '',
                            number: customer?.number || '',
                            complement: customer?.complement || '',
                            neighborhood: customer?.neighborhood || '',
                            city: customer?.city || '',
                            state: customer?.state || '',
                            acceptsPromotionalEmails: customer?.acceptsPromotionalEmails || false,
                          });
                        }}
                        disabled={isLoading}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        variant="archery" 
                        size="lg" 
                        onClick={handleSave} 
                        disabled={isLoading}
                        className="group"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <User className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                            Salvar
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button 
                      variant="archery" 
                      size="lg" 
                      onClick={() => setIsEditing(true)}
                      className="group"
                    >
                      <User className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                      Editar Perfil
                    </Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
        </div>
      </section>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Profile;

