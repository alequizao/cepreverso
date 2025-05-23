
"use client";

import * as React from 'react';
// Alterar a importação para usar o entry point específico do maplibre
import ReactMapGL, { Marker, Popup, Source, Layer, NavigationControl, FullscreenControl } from 'react-map-gl/maplibre';
import type { ViewState, LngLatLike } from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

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

        // A simple way to fit bounds, for more precise control, one might use map.fitBounds
        // This calculation attempts to center the map and adjust zoom.
        const map = (document.querySelector('.maplibregl-map') as any)?._map; // Access map instance if needed
        if (map) {
            // map.fitBounds([[minLng, minLat], [maxLng, maxLat]], { padding: 40, duration: 1000 });
             setViewport(prev => ({
                ...prev,
                longitude: (minLng + maxLng) / 2,
                latitude: (minLat + maxLat) / 2,
                // Heuristic for zoom; actual fitBounds is better
                zoom: Math.max(defaultZoom - Math.log2(Math.max(maxLng-minLng, maxLat-minLat) / 0.1), 5) 
             }));

        } else {
            setViewport(prev => ({
                ...prev,
                longitude: (minLng + maxLng) / 2,
                latitude: (minLat + maxLat) / 2,
                zoom: Math.max(defaultZoom - 2, 5), 
            }));
        }
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
            mapLib={maplibregl} 
            style={{ width: '100%', height: '100%' }}
            onMove={evt => setViewport(evt.viewState)}
            mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
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
                    offset={25} // Adjust offset to position popup correctly above the marker pin
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
                    offset={25} // Adjust offset
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
                    'line-color': '#3F51B5', // Corrected: Use direct hex color value
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

