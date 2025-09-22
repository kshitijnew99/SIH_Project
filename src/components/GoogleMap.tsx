import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import { Button } from './ui/button';

interface GoogleMapProps {
  center: { lat: number; lng: number };
  zoom?: number;
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  height?: string;
}

const MapComponent: React.FC<{
  center: { lat: number; lng: number };
  zoom: number;
  onLocationSelect: (location: { lat: number; lng: number }) => void;
}> = ({ center, zoom, onLocationSelect }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [marker, setMarker] = useState<google.maps.Marker>();

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {
        center,
        zoom,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: false,
      });
      setMap(newMap);

      // Add click listener to map
      newMap.addListener('click', (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
          const lat = e.latLng.lat();
          const lng = e.latLng.lng();
          onLocationSelect({ lat, lng });

          // Remove existing marker
          if (marker) {
            marker.setMap(null);
          }

          // Add new marker
          const newMarker = new google.maps.Marker({
            position: { lat, lng },
            map: newMap,
            title: 'Selected Location',
          });
          setMarker(newMarker);
        }
      });
    }
  }, [ref, map, center, zoom, onLocationSelect, marker]);

  // Update map center when prop changes
  useEffect(() => {
    if (map && center) {
      map.setCenter(center);
      
      // Update marker position
      if (marker) {
        marker.setPosition(center);
      } else {
        const newMarker = new google.maps.Marker({
          position: center,
          map: map,
          title: 'Selected Location',
        });
        setMarker(newMarker);
      }
    }
  }, [map, center, marker]);

  return <div ref={ref} style={{ height: '300px', width: '100%' }} />;
};

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  center, 
  zoom = 10, 
  onLocationSelect, 
  height = '300px' 
}) => {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string>('');

  const handleLocationSelect = useCallback((location: { lat: number; lng: number }) => {
    setCurrentLocation(location);
    onLocationSelect(location);
  }, [onLocationSelect]);

  const getCurrentLocation = useCallback(() => {
    setLocationError('');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          handleLocationSelect(location);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Unable to get your current location. Please select manually on the map.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    } else {
      setLocationError('Geolocation is not supported by this browser.');
    }
  }, [handleLocationSelect]);

  // Use Google Maps API key from environment variables
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE';

  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    return (
      <div className="border rounded-lg p-4" style={{ height }}>
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4 mb-4">
          <p className="text-yellow-800 text-sm">
            <strong>Google Maps API Key Required:</strong> Please add your Google Maps API key to the environment variables as VITE_GOOGLE_MAPS_API_KEY
          </p>
        </div>
        <div className="bg-gray-100 h-48 rounded flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Google Maps Preview</p>
            <p className="text-sm text-gray-500">
              Coordinates: {center.lat.toFixed(6)}, {center.lng.toFixed(6)}
            </p>
            <Button 
              type="button" 
              variant="outline" 
              className="mt-2"
              onClick={getCurrentLocation}
            >
              Use Current Location
            </Button>
          </div>
        </div>
        {locationError && (
          <p className="text-red-600 text-sm mt-2">{locationError}</p>
        )}
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4" style={{ height }}>
      <div className="mb-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={getCurrentLocation}
          className="mb-2"
        >
          Use Current Location
        </Button>
        {locationError && (
          <p className="text-red-600 text-sm">{locationError}</p>
        )}
      </div>
      
      <Wrapper apiKey={apiKey} libraries={['places']}>
        <MapComponent
          center={currentLocation || center}
          zoom={zoom}
          onLocationSelect={handleLocationSelect}
        />
      </Wrapper>
      
      <div className="mt-2 text-sm text-gray-600">
        <p>Click on the map to select a precise location</p>
        <p>Current: {(currentLocation || center).lat.toFixed(6)}, {(currentLocation || center).lng.toFixed(6)}</p>
      </div>
    </div>
  );
};

export default GoogleMap;