import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ImportExportButtons from '@/components/ImportExportButtons';

export default function ImportExportTest() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Import/Export Test</h1>
          <p className="text-gray-600 mt-2">
            Test the Import/Export functionality for Products, Categories, and Orders
          </p>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Products Import/Export</CardTitle>
            </CardHeader>
            <CardContent>
              <ImportExportButtons
                type="products"
                filters={{ status: 'active' }}
                onImportComplete={() => {
                  console.log('Products import completed');
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Categories Import/Export</CardTitle>
            </CardHeader>
            <CardContent>
              <ImportExportButtons
                type="categories"
                filters={{ status: 'active' }}
                onImportComplete={() => {
                  console.log('Categories import completed');
                }}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orders Import/Export</CardTitle>
            </CardHeader>
            <CardContent>
              <ImportExportButtons
                type="orders"
                filters={{ status: 'delivered' }}
                onImportComplete={() => {
                  console.log('Orders import completed');
                }}
              />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>API Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <h4 className="font-medium text-gray-900 mb-2">Export Endpoints:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li><strong>Products:</strong> POST /api/import-export/products/export</li>
                <li><strong>Categories:</strong> POST /api/import-export/categories/export</li>
                <li><strong>Orders:</strong> POST /api/import-export/orders/export</li>
              </ul>
              
              <h4 className="font-medium text-gray-900 mb-2 mt-4">Import Endpoints:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li><strong>Products:</strong> POST /api/import-export/products/import</li>
                <li><strong>Categories:</strong> POST /api/import-export/categories/import</li>
                <li><strong>Orders:</strong> POST /api/import-export/orders/import</li>
              </ul>

              <h4 className="font-medium text-gray-900 mb-2 mt-4">Template Endpoints:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li><strong>Products:</strong> GET /api/import-export/templates/products</li>
                <li><strong>Categories:</strong> GET /api/import-export/templates/categories</li>
                <li><strong>Orders:</strong> GET /api/import-export/templates/orders</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-blue-900 mb-2">Instructions</h3>
          <ol className="list-decimal list-inside space-y-1 text-blue-800 text-sm">
            <li>Make sure the freshmart-be backend is running on port 9090</li>
            <li>Click "Template" to download Excel templates for data structure</li>
            <li>Click "Export" to download current data as Excel file</li>
            <li>Click "Import" to upload Excel files for bulk data entry</li>
            <li>Import results will show success/failure statistics</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
