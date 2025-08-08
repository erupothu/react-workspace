import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MapsTest() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Maps Test</h1>
            <p className="text-gray-600">Test the Google Maps integration</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Google Maps Integration Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                This page helps test the Google Maps integration for the admin Maps view.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Navigation Links</h3>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/admin/login')}
                    >
                      Admin Login
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/admin/dashboard')}
                    >
                      Admin Dashboard
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => navigate('/admin/maps')}
                    >
                      Maps View (Admin Panel)
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Features</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>✅ Google Maps integration</li>
                    <li>✅ Show active order locations</li>
                    <li>✅ Filter by order status</li>
                    <li>✅ Filter by priority</li>
                    <li>✅ Search orders</li>
                    <li>✅ Click markers for details</li>
                    <li>✅ Color-coded status markers</li>
                    <li>✅ Responsive design</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Usage Instructions:</h4>
                <ol className="text-sm text-blue-800 space-y-1">
                  <li>1. Navigate to Admin Login and sign in</li>
                  <li>2. Go to Admin Dashboard</li>
                  <li>3. Click on "Maps" in the sidebar</li>
                  <li>4. View active delivery locations on the map</li>
                  <li>5. Use filters to narrow down orders</li>
                  <li>6. Click on list items to center map on location</li>
                  <li>7. Click on map markers to see order details</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
