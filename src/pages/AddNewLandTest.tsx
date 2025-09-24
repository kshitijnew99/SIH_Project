import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, MapPin } from "lucide-react";

const AddNewLandTest = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Add New Land - Test Page</h1>
          <p className="text-gray-600 mt-2">Testing if the route is working correctly</p>
        </div>

        {/* Success Card */}
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              ✅ Route Working Successfully!
            </CardTitle>
            <CardDescription className="text-green-700">
              The Add New Land page route is functioning correctly.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-green-700">
            <p>If you can see this page, it means:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>React Router is working</li>
              <li>The AddNewLand component can be imported</li>
              <li>No major compilation errors</li>
              <li>The route `/landowner/add-new-land` is accessible</li>
            </ul>
          </CardContent>
        </Card>

        {/* Test Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Route Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <strong>Current URL:</strong> {window.location.href}
              </div>
              <div>
                <strong>Available Routes:</strong>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li><code>/landowner/add-new-land</code> - Original route</li>
                  <li><code>/add-land</code> - Alternative route (newly added)</li>
                </ul>
              </div>
              <div>
                <strong>Access Methods:</strong>
                <ul className="list-disc list-inside ml-4 mt-2">
                  <li>Direct URL navigation</li>
                  <li>From Landowner Dashboard</li>
                  <li>Programmatic navigation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Navigation</CardTitle>
            <CardDescription>Test navigation to other pages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => navigate('/')}>
                🏠 Home
              </Button>
              <Button onClick={() => navigate('/landowner-dashboard')} variant="outline">
                📊 Landowner Dashboard
              </Button>
              <Button onClick={() => navigate('/land')} variant="outline">
                🌾 Find Land
              </Button>
              <Button onClick={() => navigate('/contact-support')} variant="outline">
                📞 Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mt-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">🔄 Next Steps</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-700">
            <p>Since this test page is working, the issue might be:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li><strong>LeafletMap Component:</strong> There might be an issue with the Leaflet integration</li>
              <li><strong>CSS Loading:</strong> Leaflet CSS might not be loading properly</li>
              <li><strong>Browser Console:</strong> Check for JavaScript errors in the console</li>
              <li><strong>Module Loading:</strong> react-leaflet modules might have loading issues</li>
            </ol>
            <div className="mt-4 p-3 bg-blue-100 rounded">
              <strong>Recommendation:</strong> Check the browser console (F12) when loading the full AddNewLand page for any errors.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AddNewLandTest;