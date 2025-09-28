import React from 'react';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">
          KisanConnect Test Page
        </h1>
        <p className="text-center text-muted-foreground">
          If you can see this page, the basic React setup is working.
        </p>
        <div className="mt-8 text-center">
          <button 
            onClick={() => console.log('Button clicked')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Test Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestPage;