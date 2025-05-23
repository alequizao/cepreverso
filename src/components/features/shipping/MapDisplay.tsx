
"use client";

import * as React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip as LeafletTooltip } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

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

const alagoasCenter: LatLngExpression = [-9.5713, -36.7819]; 
const defaultZoom = 8;

export default function MapDisplay({ originCoords, destinationCoords, destinationCityName, originCityName = "Rio Largo" }: MapDisplayProps) {
  const [isClient, setIsClient] = React.useState(false);
  const mapRef = React.useRef<L.Map | null>(null);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Effect for map instance cleanup when the MapDisplay component unmounts
  // The `key` prop on MapContainer should trigger this unmount/remount cycle effectively
  React.useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Empty dependency array ensures this runs only on component unmount

  // Effect to update the map view (zoom, center)
  React.useEffect(() => {
    if (mapRef.current && isClient) {
      const currentMap = mapRef.current;
      const positions: LatLngExpression[] = [];
      if (originCoords) {
        positions.push([originCoords.lat, originCoords.lng]);
      }
      if (destinationCoords) {
        positions.push([destinationCoords.lat, destinationCoords.lng]);
      }

      if (positions.length > 0) {
        if (positions.length === 1) {
          currentMap.setView(positions[0], 10); 
        } else if (positions.length > 1) {
          const bounds = L.latLngBounds(positions);
          if (bounds.isValid()) {
            currentMap.fitBounds(bounds, { padding: [50, 50] });
          } else {
            currentMap.setView(alagoasCenter, defaultZoom); // Fallback
          }
        }
      } else {
          currentMap.setView(alagoasCenter, defaultZoom);
      }
    }
  }, [originCoords, destinationCoords, isClient]); // isClient ensures mapRef.current could be set

  if (!isClient) {
    return (
      <Card className="shadow-lg w-full mt-8">
        <CardHeader>
          <CardTitle className="text-xl text-primary flex items-center">
            <MapPin className="mr-2 h-5 w-5" /> Visualização no Mapa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full bg-muted rounded-md flex items-center justify-center">
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
                whenCreated={(mapInstance) => {
                    mapRef.current = mapInstance;
                }}
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
                {originCoords && destinationCoords && (
                    <Polyline 
                        pathOptions={{ color: 'hsl(var(--primary))', weight: 5 }} 
                        positions={[[originCoords.lat, originCoords.lng], [destinationCoords.lat, destinationCoords.lng]]} 
                    />
                )}
            </MapContainer>
            {originCoords && destinationCoords && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                    Nota: A linha no mapa representa uma trajetória direta. A distância do frete é baseada em dados rodoviários pré-definidos para as cidades.
                </p>
            )}
            {(originCoords && !destinationCoords && originCityName) && (
                 <p className="text-xs text-muted-foreground mt-2 text-center">
                    Visualizando cidade de origem: {originCityName}. Selecione um destino para ver a rota.
                </p>
            )}
        </CardContent>
    </Card>
  );
}
