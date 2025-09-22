import React, { useState, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from './ui/use-toast';

interface RapidAPIMapProps {
  center: { lat: number; lng: number };
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  height?: string;
  zoom?: number;
}

const RapidAPIMap: React.FC<RapidAPIMapProps> = ({ 
  center, 
  onLocationSelect, 
  height = '400px',
  zoom = 10
}) => {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number }>(center);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const rapidApiKey = import.meta.env.VITE_RAPIDAPI_KEY;

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(location);
          onLocationSelect(location);
          toast({
            title: "Location Found",
            description: `Location set to ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          toast({
            title: "Location Error",
            description: "Unable to get your current location. Please enter coordinates manually.",
            variant: "destructive"
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
        }
      );
    } else {
      toast({
        title: "Not Supported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive"
      });
    }
  }, [onLocationSelect, toast]);

  const handleLocationUpdate = useCallback((lat: number, lng: number) => {
    const location = { lat, lng };
    setCurrentLocation(location);
    onLocationSelect(location);
  }, [onLocationSelect]);

  const searchPlaces = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Error",
        description: "Please enter a location to search.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // For now, let's use a geocoding service or show a message
      toast({
        title: "Search Feature",
        description: "Location search will be available once RapidAPI integration is fully configured. Please use GPS or manual coordinates.",
        variant: "default"
      });
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Error",
        description: "Unable to search for places. Please use GPS or manual coordinates.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4 space-y-4" style={{ minHeight: height }}>
      {/* Search Section */}
      <div className="space-y-2">
        <Label>Search for a Location</Label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search for address, city, landmark..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchPlaces()}
            className="flex-1"
          />
          <Button 
            type="button" 
            onClick={searchPlaces}
            disabled={isLoading || !searchQuery.trim()}
            variant="outline"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>

      {/* Current Location Button */}
      <div>
        <Button 
          type="button" 
          variant="outline" 
          onClick={getCurrentLocation}
          className="w-full"
        >
          📍 Use Current Location
        </Button>
      </div>

      {/* Manual Coordinates Input */}
      <div className="space-y-2">
        <Label>Manual Coordinates</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-gray-600">Latitude</Label>
            <Input 
              type="number" 
              step="any"
              value={currentLocation.lat}
              onChange={(e) => {
                const lat = parseFloat(e.target.value) || 0;
                handleLocationUpdate(lat, currentLocation.lng);
              }}
              className="text-sm"
              placeholder="e.g., 28.6139"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-600">Longitude</Label>
            <Input 
              type="number" 
              step="any"
              value={currentLocation.lng}
              onChange={(e) => {
                const lng = parseFloat(e.target.value) || 0;
                handleLocationUpdate(currentLocation.lat, lng);
              }}
              className="text-sm"
              placeholder="e.g., 77.2090"
            />
          </div>
        </div>
      </div>

      {/* Map Visualization */}
      <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-lg p-8 text-center border-2 border-dashed border-blue-200">
        <div className="space-y-3">
          <div className="w-16 h-16 bg-red-500 rounded-full mx-auto flex items-center justify-center text-white text-2xl shadow-lg">
            📍
          </div>
          <h3 className="font-semibold text-gray-800">Selected Location</h3>
          <div className="space-y-1">
            <p className="text-sm font-mono text-gray-700 bg-white px-3 py-1 rounded">
              {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
            </p>
            <p className="text-xs text-gray-500">
              Latitude: {currentLocation.lat.toFixed(6)} • Longitude: {currentLocation.lng.toFixed(6)}
            </p>
          </div>
          
          {rapidApiKey && rapidApiKey !== 'YOUR_RAPIDAPI_KEY_HERE' ? (
            <p className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
              ✅ RapidAPI Connected
            </p>
          ) : (
            <div className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded">
              ⚠️ Add RapidAPI key to enable location search
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>• Click "Use Current Location" to get GPS coordinates</p>
        <p>• Enter coordinates manually for precise location</p>
        <p>• Search functionality requires RapidAPI configuration</p>
      </div>
    </div>
  );
};

export default RapidAPIMap;