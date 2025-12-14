import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { useAuth } from '@/contexts/AuthContext';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/services/apiClient';
import { Loader2 } from 'lucide-react';

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
  });

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
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <Card>
            <CardHeader>
              <CardTitle>Carregando...</CardTitle>
            </CardHeader>
          </Card>
        </div>
        <Footer />
        <WhatsAppFloat />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Meu Perfil</CardTitle>
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
                <Button onClick={syncCustomer} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sincronizando...
                    </>
                  ) : (
                    'Sincronizar Dados'
                  )}
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
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
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF</Label>
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
                  <div className="space-y-2">
                    <Label htmlFor="cep">CEP</Label>
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
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
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
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="number">Número</Label>
                    <Input
                      id="number"
                      name="number"
                      value={formData.number}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="complement">Complemento</Label>
                    <Input
                      id="complement"
                      name="complement"
                      value={formData.complement}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      name="neighborhood"
                      value={formData.neighborhood}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 pt-4">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
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
                          });
                        }}
                        disabled={isLoading}
                      >
                        Cancelar
                      </Button>
                      <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          'Salvar'
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>Editar</Button>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Profile;

