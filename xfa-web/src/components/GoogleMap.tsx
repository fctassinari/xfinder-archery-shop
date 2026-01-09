import React, { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';
import { getGoogleMapsConfig, isConfigLoaded, initConfig } from '@/config/appConfig';

interface GoogleMapProps {
  address?: string;
  className?: string;
}

const MapComponent: React.FC<{ address: string }> = ({ address }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 15,
      center: { lat: -23.5505, lng: -46.6333 }, // São Paulo center as fallback
      styles: [
        {
          featureType: 'all',
          elementType: 'geometry.fill',
          stylers: [{ color: '#f5f5f5' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#c9c9c9' }]
        }
      ]
    });

    // Geocoder to convert address to coordinates
    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode({ address }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        map.setCenter(location);
        
        // Add marker
        new window.google.maps.Marker({
          position: location,
          map,
          title: address,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C7.163 0 0 7.163 0 16C0 24.837 16 40 16 40S32 24.837 32 16C32 7.163 24.837 0 16 0ZM16 21.5C13.515 21.5 11.5 19.485 11.5 17C11.5 14.515 13.515 12.5 16 12.5C18.485 12.5 20.5 14.515 20.5 17C20.5 19.485 18.485 21.5 16 21.5Z" fill="#0ea5e9"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(32, 40),
          }
        });
      }
    });
  }, [address]);

  return <div ref={mapRef} className="w-full h-full rounded-lg" />;
};

const render = (status: Status, address: string) => {
  const encodedAddress = encodeURIComponent(address);
  
  switch (status) {
    case Status.LOADING:
      return (
        <div className="w-full h-64 bg-muted/30 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      );
    case Status.FAILURE:
      return (
        <div className="w-full h-64 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-border">
          <div className="text-center p-6">
            <div className="bg-muted/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <h3 className="font-semibold text-foreground mb-2">Localização</h3>
            <p className="text-muted-foreground text-sm">
              {address.split(',').map((part, i) => (
                <React.Fragment key={i}>
                  {part.trim()}
                  {i < address.split(',').length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Mapa temporariamente indisponível
            </p>
            <Button
              variant="archery"
              size="lg"
              asChild
              className="mt-3 group"
            >
              <a 
                href={`https://maps.google.com/?q=${encodedAddress}`}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <MapPin className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Ver no Google Maps
              </a>
            </Button>
          </div>
        </div>
      );
    case Status.SUCCESS:
      return <MapComponent address={address} />;
  }
};

const GoogleMap: React.FC<GoogleMapProps> = ({ address = "Mooca, São Paulo, SP, Brazil", className }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadApiKey = async () => {
      try {
        // Garantir que as configurações foram carregadas
        if (!isConfigLoaded()) {
          await initConfig();
        }

        // Obter a API key do backend
        const googleMapsConfig = getGoogleMapsConfig();
        const key = googleMapsConfig?.apiKey || '';

        if (!key) {
          console.warn('Google Maps API key não configurada no backend. Configure frontend.google-maps.api-key no application.properties');
        }

        setApiKey(key);
      } catch (error) {
        console.error('Erro ao carregar configuração do Google Maps:', error);
        setApiKey('');
      } finally {
        setLoading(false);
      }
    };

    loadApiKey();
  }, []);

  // Se ainda está carregando, mostrar loading
  if (loading) {
    return (
      <div className={className}>
        <div className="w-full h-64 bg-muted/30 rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // Se não houver API key, mostrar fallback
  if (!apiKey) {
    return (
      <div className={className}>
        {render(Status.FAILURE, address)}
      </div>
    );
  }

  // Usar o Wrapper do @googlemaps/react-wrapper para carregar o script do Google Maps
  // Passar address para a função render através de uma closure
  const renderWithAddress = (status: Status) => render(status, address);

  return (
    <div className={className}>
      <Wrapper apiKey={apiKey} render={renderWithAddress}>
        <MapComponent address={address} />
      </Wrapper>
    </div>
  );
};

export default GoogleMap;


