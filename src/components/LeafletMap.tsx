import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { useToast } from './ui/use-toast';
import { MapPin, Navigation, Search, CheckCircle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import './leaflet-map.css';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom red marker icon
const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface LeafletMapProps {
  center: { lat: number; lng: number };
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  height?: string;
  zoom?: number;
  showLocationCard?: boolean;
}

// Component to handle map clicks
const MapClickHandler: React.FC<{ onLocationSelect: (location: { lat: number; lng: number }) => void }> = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng });
    },
  });
  return null;
};

const LeafletMap: React.FC<LeafletMapProps> = ({ 
  center, 
  onLocationSelect, 
  height = '400px',
  zoom = 13,
  showLocationCard = true
}) => {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number }>(center);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const mapRef = useRef<L.Map | null>(null);
  const { toast } = useToast();

  const handleLocationSelect = (location: { lat: number; lng: number }) => {
    setSelectedLocation(location);
    onLocationSelect(location);
    
    toast({
      title: "Location Selected",
      description: `Coordinates: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`,
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          handleLocationSelect(location);
          setIsLoading(false);
          
          // Pan map to current location
          if (mapRef.current) {
            mapRef.current.setView([location.lat, location.lng], zoom);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
          toast({
            title: "Location Error",
            description: "Unable to get your current location. Please click on the map to select a location.",
            variant: "destructive"
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 600000
        }
      );
    } else {
      toast({
        title: "Geolocation Not Supported",
        description: "Your browser doesn't support geolocation. Please click on the map to select a location.",
        variant: "destructive"
      });
    }
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Enter Location",
        description: "Please enter a location to search.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Using Nominatim for geocoding (free service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      
      if (data && data.length > 0) {
        const location = {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
        handleLocationSelect(location);
        
        // Pan map to searched location
        if (mapRef.current) {
          mapRef.current.setView([location.lat, location.lng], zoom);
        }
      } else {
        toast({
          title: "Location Not Found",
          description: "Could not find the specified location. Please try a different search term.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search location. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchLocation();
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and GPS Controls */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1">
          <div className="flex gap-2">
            <Input
              placeholder="Search for a location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={searchLocation} 
              disabled={isLoading}
              variant="outline"
              size="sm"
            >
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button 
          onClick={getCurrentLocation} 
          disabled={isLoading}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Navigation className="h-4 w-4" />
          Use GPS
        </Button>
      </div>

      {/* Map Container */}
      <div className="relative">
        <MapContainer
          center={[selectedLocation.lat, selectedLocation.lng]}
          zoom={zoom}
          style={{ height, width: '100%' }}
          className="rounded-lg border"
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          <MapClickHandler onLocationSelect={handleLocationSelect} />
          
          <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={redIcon}>
            <Popup>
              <div className="text-center">
                <MapPin className="h-4 w-4 mx-auto mb-1" />
                <p className="font-semibold">Selected Location</p>
                <p className="text-sm text-gray-600">
                  {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>Loading...</span>
            </div>
          </div>
        )}
      </div>

      {/* Selected Location Card */}
      {showLocationCard && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <MapPin className="h-4 w-4 text-white" />
              </div>
              Selected Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-center">
              <p className="text-xl font-mono font-semibold text-gray-800">
                {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Latitude: {selectedLocation.lat.toFixed(6)} • Longitude: {selectedLocation.lng.toFixed(6)}
              </p>
            </div>
            
            <div className="flex items-center justify-center gap-2 pt-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-600 font-medium">Map Connected</span>
            </div>
            
            <p className="text-xs text-gray-500 text-center mt-2">
              Click anywhere on the map to change location
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeafletMap;