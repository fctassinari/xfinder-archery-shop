declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: any) => any;
        Geocoder: new () => any;
        Marker: new (options: any) => any; // Deprecated, mantido para fallback
        Size: new (width: number, height: number) => any;
        importLibrary: (library: string) => Promise<{
          AdvancedMarkerElement: new (options: {
            map?: any;
            position: { lat: number; lng: number };
            title?: string;
            content?: HTMLElement;
          }) => any;
          PinElement: new (options: {
            background?: string;
            borderColor?: string;
            glyphColor?: string;
            scale?: number;
          }) => {
            element: HTMLElement;
          };
        }>;
      };
    };
  }
}

export {};