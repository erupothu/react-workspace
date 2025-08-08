import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Download,
  Upload,
  FileSpreadsheet,
  Loader2,
  CheckCircle,
  AlertCircle,
  FileDown,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { ImportResponse } from '@/lib/api/import-export';

interface ImportExportButtonsProps {
  type: 'products' | 'categories' | 'orders';
  filters?: any;
  onImportComplete?: () => void;
  className?: string;
}

export default function ImportExportButtons({
  type,
  filters,
  onImportComplete,
  className,
}: ImportExportButtonsProps) {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importResult, setImportResult] = useState<ImportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    setExporting(true);
    setError(null);

    try {
      let response;
      switch (type) {
        case 'products':
          response = await api.importExport.downloadProducts();
          break;
        case 'categories':
          response = await api.importExport.downloadCategories();
          break;
        case 'orders':
          response = await api.importExport.downloadOrders();
          break;
      }

      if (response.ok) {
        // Trigger download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const date = new Date().toISOString().split('T')[0];
        const filename = `${type}_${date}.xlsx`;
        api.importExport.downloadFile(url, filename);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error(response.error?.message || 'Export failed');
      }
    } catch (err) {
      console.error('Export error:', err);
      setError(err instanceof Error ? err.message : 'Export failed');
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      let response: Response;
      switch (type) {
        case 'products':
          response = await api.importExport.downloadProductTemplate();
          break;
        case 'categories':
          response = await api.importExport.downloadCategoryTemplate();
          break;
        case 'orders':
          response = await api.importExport.downloadOrderTemplate();
          break;
      }

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const filename = `${type}_template.xlsx`;
        api.importExport.downloadFile(url, filename);
        window.URL.revokeObjectURL(url);
      } else {
        throw new Error('Failed to download template');
      }
    } catch (err) {
      console.error('Template download error:', err);
      setError(err instanceof Error ? err.message : 'Template download failed');
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError('Please select an Excel file (.xlsx or .xls)');
      return;
    }

    setImporting(true);
    setError(null);
    setImportResult(null);

    try {
      let response;
      switch (type) {
        case 'products':
          response = await api.importExport.importProducts(file);
          break;
        case 'categories':
          response = await api.importExport.importCategories(file);
          break;
        case 'orders':
          response = await api.importExport.importOrders(file);
          break;
      }

      if (response.success && response.data) {
        setImportResult(response.data);
        setShowImportDialog(true);
        if (onImportComplete) {
          onImportComplete();
        }
      } else {
        throw new Error(response.error?.message || 'Import failed');
      }
    } catch (err) {
      console.error('Import error:', err);
      setError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setImporting(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <>
      <div className={cn('flex items-center gap-2', className)}>
        {/* Export Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          disabled={exporting}
          className="border-green-300 text-green-600 hover:bg-green-50"
        >
          {exporting ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          Export
        </Button>

        {/* Import Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={importing}
          className="border-blue-300 text-blue-600 hover:bg-blue-50"
        >
          {importing ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Upload className="w-4 h-4 mr-2" />
          )}
          Import
        </Button>

        {/* Template Download Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownloadTemplate}
          className="border-purple-300 text-purple-600 hover:bg-purple-50"
        >
          <FileDown className="w-4 h-4 mr-2" />
          Template
        </Button>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Import Results Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {importResult?.success ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              {capitalizedType} Import Results
            </DialogTitle>
            <DialogDescription>
              Import process completed. Here are the results:
            </DialogDescription>
          </DialogHeader>

          {importResult && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Records:</span>
                    <Badge variant="outline">{importResult.totalRecords}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Successful:</span>
                    <Badge className="bg-green-100 text-green-700">
                      {importResult.successfulRecords}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Failed:</span>
                    <Badge className="bg-red-100 text-red-700">
                      {importResult.failedRecords}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {Math.round((importResult.successfulRecords / importResult.totalRecords) * 100)}%
                    </div>
                    <div className="text-xs text-gray-600">Success Rate</div>
                  </div>
                  <Progress 
                    value={(importResult.successfulRecords / importResult.totalRecords) * 100}
                    className="h-2"
                  />
                </div>
              </div>

              {importResult.errors && importResult.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-red-600">Errors:</h4>
                  <div className="max-h-32 overflow-y-auto space-y-1 text-xs">
                    {importResult.errors.slice(0, 5).map((error, index) => (
                      <div key={index} className="bg-red-50 p-2 rounded border">
                        <span className="font-medium">Row {error.row}:</span> {error.message}
                      </div>
                    ))}
                    {importResult.errors.length > 5 && (
                      <div className="text-gray-500 italic">
                        +{importResult.errors.length - 5} more errors...
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Button 
                onClick={() => setShowImportDialog(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
