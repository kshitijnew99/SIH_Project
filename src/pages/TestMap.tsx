import React from 'react';
import RapidAPIMap from '@/components/RapidAPIMap';

const TestMap = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Map Test Page</h1>
      <RapidAPIMap
        center={{ lat: 28.6139, lng: 77.2090 }}
        onLocationSelect={(location) => {
          console.log('Location selected:', location);
        }}
        height="500px"
      />
    </div>
  );
};

export default TestMap;