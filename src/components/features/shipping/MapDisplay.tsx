
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
  const mapRef = React.useRef<L.Map | null>(null);
  const [isClient, setIsClient] = React.useState(false);
  // This state helps trigger effects that depend on the map being ready
  const [mapReady, setMapReady] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const positions: LatLngExpression[] = [];
  if (originCoords) {
    positions.push([originCoords.lat, originCoords.lng]);
  }
  if (destinationCoords) {
    positions.push([destinationCoords.lat, destinationCoords.lng]);
  }

  // Effect to update the map view (zoom, center)
  React.useEffect(() => {
    if (mapRef.current && isClient && mapReady) {
      const currentMap = mapRef.current;
      if (positions.length > 0) {
        if (positions.length === 1) {
          currentMap.setView(positions[0], 10); // Zoom um pouco maior para um único ponto
        } else if (positions.length > 1) {
          const bounds = L.latLngBounds(positions);
          currentMap.fitBounds(bounds, { padding: [50, 50] }); // Adiciona padding
        }
      } else {
          currentMap.setView(alagoasCenter, defaultZoom);
      }
    }
  }, [originCoords, destinationCoords, isClient, mapReady, positions]); // positions is derived

  // Effect for map instance cleanup when the MapDisplay component unmounts
  React.useEffect(() => {
    // This cleanup runs when the MapDisplay component unmounts.
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs only on unmount.

  const handleMapCreated = React.useCallback((mapInstance: L.Map) => {
    mapRef.current = mapInstance;
    setMapReady(true); // Indicate that the map is ready for interactions
  }, []);


  if (!isClient) {
    return (
      <Card className="shadow-lg w-full mt-8">
        <CardHeader>
          <CardTitle className="text-xl text-primary flex items-center">
            <MapPin className="mr-2 h-5 w-5" /> Visualização no Mapa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full bg-muted rounded-md flex items-center justify-center">
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
            {/* The key prop is crucial here to force a full remount when isClient becomes true */}
            <MapContainer
                key={String(isClient)} 
                center={alagoasCenter}
                zoom={defaultZoom}
                scrollWheelZoom={false}
                style={{ height: '400px', width: '100%' }}
                whenCreated={handleMapCreated}
                className="rounded-md"
            >
                <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {originCoords && originCityName && (
                <Marker position={[originCoords.lat, originCoords.lng]}>
                    <LeafletTooltip permanent>{originCityName}</LeafletTooltip>
                </Marker>
                )}
                {destinationCoords && destinationCityName && (
                <Marker position={[destinationCoords.lat, destinationCoords.lng]}>
                    <LeafletTooltip permanent>{destinationCityName}</LeafletTooltip>
                </Marker>
                )}
                {positions.length === 2 && (
                    <Polyline pathOptions={{ color: 'hsl(var(--primary))', weight: 5 }} positions={positions} />
                )}
            </MapContainer>
            {positions.length === 2 && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                    Nota: A linha no mapa representa uma trajetória direta. A distância do frete é baseada em dados rodoviários pré-definidos para as cidades.
                </p>
            )}
            {(positions.length === 1 && originCityName) && (
                 <p className="text-xs text-muted-foreground mt-2 text-center">
                    Visualizando cidade de origem: {originCityName}. Selecione um destino para ver a rota.
                </p>
            )}
        </CardContent>
    </Card>
  );
}
