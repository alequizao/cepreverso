
"use client";

import * as React from 'react';
// Alterar a importação para usar o entry point específico do maplibre
import ReactMapGL, { Marker, Popup, Source, Layer, NavigationControl, FullscreenControl } from 'react-map-gl/maplibre';
import type { ViewState, LngLatLike } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react'; // Removido Maximize, Minimize pois não são usados

interface MapDisplayProps {
  originCoords?: { lat: number; lng: number };
  destinationCoords?: { lat: number; lng: number };
  destinationCityName?: string;
  originCityName?: string;
}

const alagoasCenter = { longitude: -36.7819, latitude: -9.5713 };
const defaultZoom = 7;

export default function MapDisplay({ originCoords, destinationCoords, destinationCityName, originCityName = "Rio Largo" }: MapDisplayProps) {
  const [isClient, setIsClient] = React.useState(false);
  const [viewport, setViewport] = React.useState<Partial<ViewState>>({
    longitude: alagoasCenter.longitude,
    latitude: alagoasCenter.latitude,
    zoom: defaultZoom,
    pitch: 0,
    bearing: 0,
  });

  const [showOriginPopup, setShowOriginPopup] = React.useState(false);
  const [showDestinationPopup, setShowDestinationPopup] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  React.useEffect(() => {
    if (isClient) {
      const points: LngLatLike[] = [];
      if (originCoords) {
        points.push([originCoords.lng, originCoords.lat]);
      }
      if (destinationCoords) {
        points.push([destinationCoords.lng, destinationCoords.lat]);
      }

      if (points.length === 1) {
        setViewport(prev => ({
          ...prev,
          longitude: points[0][0],
          latitude: points[0][1],
          zoom: 10,
        }));
      } else if (points.length > 1) {
        const longitudes = points.map(p => p[0]);
        const latitudes = points.map(p => p[1]);
        const minLng = Math.min(...longitudes);
        const maxLng = Math.max(...longitudes);
        const minLat = Math.min(...latitudes);
        const maxLat = Math.max(...latitudes);

        setViewport(prev => ({
          ...prev,
          longitude: (minLng + maxLng) / 2,
          latitude: (minLat + maxLat) / 2,
          // Ajuste de zoom simples; para um fitBounds mais preciso, seria necessário usar mapRef.current.fitBounds
          zoom: Math.max(defaultZoom - 2, 5), // Evitar zoom muito distante
        }));
      } else {
         setViewport(prev => ({
          ...prev,
          longitude: alagoasCenter.longitude,
          latitude: alagoasCenter.latitude,
          zoom: defaultZoom,
        }));
      }
    }
  }, [originCoords, destinationCoords, isClient]);

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

  const lineData: GeoJSON.Feature<GeoJSON.LineString> | null = 
    originCoords && destinationCoords ? {
    type: 'Feature',
    geometry: {
      type: 'LineString',
      coordinates: [
        [originCoords.lng, originCoords.lat],
        [destinationCoords.lng, destinationCoords.lat],
      ],
    },
    properties: {}
  } : null;

  return (
    <Card className="shadow-lg w-full mt-8">
      <CardHeader>
        <CardTitle className="text-xl text-primary flex items-center">
          <MapPin className="mr-2 h-5 w-5" /> Visualização no Mapa
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full rounded-md overflow-hidden">
          <ReactMapGL
            {...viewport}
            mapLib={maplibregl} // Crucial para usar maplibre-gl
            style={{ width: '100%', height: '100%' }}
            onMove={evt => setViewport(evt.viewState)}
            mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
            // Evitar controle de zoom com scroll do mouse se não desejado
            // scrollZoom={false} 
            // dragPan={true}
            // dragRotate={false}
            // doubleClickZoom={true}
          >
            <NavigationControl position="top-right" />
            <FullscreenControl position="top-right" />

            {originCoords && originCityName && (
              <Marker longitude={originCoords.lng} latitude={originCoords.lat} anchor="bottom">
                <div 
                  onMouseEnter={() => setShowOriginPopup(true)}
                  onMouseLeave={() => setShowOriginPopup(false)}
                  className="cursor-pointer"
                >
                  <MapPin className="h-8 w-8 text-red-500 fill-red-300" />
                </div>
              </Marker>
            )}
            {showOriginPopup && originCoords && originCityName && (
                 <Popup
                    longitude={originCoords.lng}
                    latitude={originCoords.lat}
                    anchor="top"
                    closeButton={false}
                    closeOnClick={false}
                    offset={25}
                 >
                    <div className="text-sm p-1 bg-background rounded-md shadow-md">{originCityName} (Origem)</div>
                 </Popup>
            )}


            {destinationCoords && destinationCityName && (
              <Marker longitude={destinationCoords.lng} latitude={destinationCoords.lat} anchor="bottom">
                 <div 
                  onMouseEnter={() => setShowDestinationPopup(true)}
                  onMouseLeave={() => setShowDestinationPopup(false)}
                  className="cursor-pointer"
                >
                  <MapPin className="h-8 w-8 text-blue-500 fill-blue-300" />
                </div>
              </Marker>
            )}
            {showDestinationPopup && destinationCoords && destinationCityName && (
                 <Popup
                    longitude={destinationCoords.lng}
                    latitude={destinationCoords.lat}
                    anchor="top"
                    closeButton={false}
                    closeOnClick={false}
                    offset={25}
                 >
                    <div className="text-sm p-1 bg-background rounded-md shadow-md">{destinationCityName} (Destino)</div>
                 </Popup>
            )}


            {lineData && (
              <Source id="route-line" type="geojson" data={lineData}>
                <Layer
                  id="line-layer"
                  type="line"
                  paint={{
                    'line-color': 'hsl(var(--primary))',
                    'line-width': 3,
                    'line-dasharray': [2, 2]
                  }}
                />
              </Source>
            )}
          </ReactMapGL>
        </div>
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

