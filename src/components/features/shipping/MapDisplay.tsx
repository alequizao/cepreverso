
"use client";

import * as React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip as LeafletTooltip } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet'; // Import L para usar L.icon
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

// Corrige o problema comum com os ícones do marcador padrão do Leaflet no Next.js/Webpack
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


interface MapDisplayProps {
  originCoords?: { lat: number; lng: number };
  destinationCoords?: { lat: number; lng: number };
  destinationCityName?: string;
  originCityName?: string;
}

// Coordenadas aproximadas do centro de Alagoas para visualização inicial
const alagoasCenter: LatLngExpression = [-9.5713, -36.7819]; 
const defaultZoom = 8;

export default function MapDisplay({ originCoords, destinationCoords, destinationCityName, originCityName = "Rio Largo" }: MapDisplayProps) {
  const [mapInstance, setMapInstance] = React.useState<L.Map | null>(null);

  const positions: LatLngExpression[] = [];
  if (originCoords) {
    positions.push([originCoords.lat, originCoords.lng]);
  }
  if (destinationCoords) {
    positions.push([destinationCoords.lat, destinationCoords.lng]);
  }

  React.useEffect(() => {
    if (mapInstance && positions.length > 0) {
      if (positions.length === 1) {
        mapInstance.setView(positions[0], 10); // Zoom maior se só tiver um ponto
      } else if (positions.length > 1) {
        const bounds = L.latLngBounds(positions);
        mapInstance.fitBounds(bounds, { padding: [50, 50] });
      }
    } else if (mapInstance) {
        mapInstance.setView(alagoasCenter, defaultZoom);
    }
  }, [originCoords, destinationCoords, mapInstance]);


  if (typeof window === 'undefined') {
    return (
      <Card className="shadow-lg w-full mt-8">
        <CardHeader>
          <CardTitle className="text-xl text-primary flex items-center">
            <MapPin className="mr-2 h-5 w-5" /> Visualização no Mapa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full bg-muted rounded-md flex items-center justify-center">
            <p className="text-muted-foreground">Carregando mapa...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg w-full mt-8">
        <CardHeader>
            <CardTitle className="text-xl text-primary flex items-center">
                <MapPin className="mr-2 h-5 w-5" /> Visualização no Mapa
            </CardTitle>
        </CardHeader>
        <CardContent>
            <MapContainer
                center={alagoasCenter}
                zoom={defaultZoom}
                scrollWheelZoom={false}
                style={{ height: '400px', width: '100%' }}
                whenCreated={setMapInstance}
                className="rounded-md"
            >
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {originCoords && (
                <Marker position={[originCoords.lat, originCoords.lng]}>
                    <LeafletTooltip permanent>{originCityName}</LeafletTooltip>
                </Marker>
                )}
                {destinationCoords && (
                <Marker position={[destinationCoords.lat, destinationCoords.lng]}>
                    <LeafletTooltip permanent>{destinationCityName || 'Destino'}</LeafletTooltip>
                </Marker>
                )}
                {positions.length === 2 && (
                    <Polyline pathOptions={{ color: 'hsl(var(--primary))', weight: 5 }} positions={positions} />
                )}
            </MapContainer>
            {positions.length === 2 && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                    Nota: A linha no mapa representa uma trajetória direta. A distância do frete é baseada em dados rodoviários pré-definidos.
                </p>
            )}
        </CardContent>
    </Card>
  );
}

// Para evitar problemas com SSR, exportamos o componente dinamicamente
// No entanto, para este caso, como o MapContainer lida bem com o client-side rendering,
// podemos tentar sem o dynamic import primeiro. Se houver problemas de hidratação,
// podemos reintroduzir o dynamic import.
// import dynamic from 'next/dynamic';
// export default dynamic(() => Promise.resolve(MapDisplay), { ssr: false });
