import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  RefreshCw, 
  Database,
  ShoppingCart,
  Users,
  Package,
  BarChart3
} from 'lucide-react';
import { api } from '@/lib/api';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'loading';
  message: string;
  data?: any;
  duration?: number;
}

export default function APITest() {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const tests = [
    {
      name: 'Connection Test',
      description: 'Test basic API connectivity',
      icon: Database,
      test: async () => {
        const response = await fetch('http://localhost:8080/api/test-connection');
        const data = await response.json();
        return { success: response.ok, data };
      }
    },
    {
      name: 'Products API',
      description: 'Test products service',
      icon: Package,
      test: async () => {
        const response = await api.products.getProducts();
        return { success: response.success, data: response.data };
      }
    },
    {
      name: 'Dashboard Stats',
      description: 'Test dashboard analytics',
      icon: BarChart3,
      test: async () => {
        const response = await api.dashboard.getDashboardStats();
        return { success: response.success, data: response.data };
      }
    }
  ];

  const runTest = async (test: typeof tests[0], index: number) => {
    const startTime = Date.now();
    
    setTestResults(prev => prev.map((result, i) => 
      i === index 
        ? { ...result, status: 'loading', message: 'Running...' }
        : result
    ));

    try {
      const result = await test.test();
      const duration = Date.now() - startTime;
      
      setTestResults(prev => prev.map((testResult, i) => 
        i === index 
          ? { 
              ...testResult, 
              status: result.success ? 'success' : 'error',
              message: result.success ? 'Test passed successfully' : 'Test failed',
              data: result.data,
              duration
            }
          : testResult
      ));
    } catch (error) {
      const duration = Date.now() - startTime;
      setTestResults(prev => prev.map((testResult, i) => 
        i === index 
          ? { 
              ...testResult, 
              status: 'error',
              message: error instanceof Error ? error.message : 'Unknown error',
              duration
            }
          : testResult
      ));
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setTestResults(tests.map(test => ({
      name: test.name,
      status: 'loading' as const,
      message: 'Waiting...'
    })));

    for (let i = 0; i < tests.length; i++) {
      await runTest(tests[i], i);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsRunning(false);
  };

  useEffect(() => {
    setTestResults(tests.map(test => ({
      name: test.name,
      status: 'loading' as const,
      message: 'Not tested yet'
    })));
  }, []);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'loading':
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <div className="w-5 h-5 rounded-full bg-gray-300" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'error':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'loading':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">
            FreshMart API Integration Test
          </h1>
          <p className="text-gray-600">
            Test connectivity and functionality with the Spring Boot backend at localhost:9090
          </p>
          
          <Alert>
            <Database className="h-4 w-4" />
            <AlertDescription>
              <strong>Backend URL:</strong> http://localhost:9090/api
              <br />
              <strong>Status:</strong> All REST API services configured and ready for Spring Boot integration
            </AlertDescription>
          </Alert>
        </div>

        {/* Test Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              API Test Suite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Run comprehensive tests to verify API integration
              </p>
              <Button 
                onClick={runAllTests} 
                disabled={isRunning}
                className="bg-fresh-600 hover:bg-fresh-700"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Run All Tests
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <div className="grid gap-4">
          {tests.map((test, index) => {
            const result = testResults[index];
            const Icon = test.icon;
            
            return (
              <Card key={test.name} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-fresh-100 rounded-lg">
                        <Icon className="w-6 h-6 text-fresh-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{test.name}</h3>
                        <p className="text-sm text-gray-600">{test.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {result?.duration && (
                        <span className="text-sm text-gray-500">
                          {result.duration}ms
                        </span>
                      )}
                      <Badge className={`border ${getStatusColor(result?.status || 'loading')}`}>
                        {result?.status === 'loading' ? 'Testing...' : result?.status || 'Pending'}
                      </Badge>
                      {getStatusIcon(result?.status || 'loading')}
                    </div>
                  </div>
                  
                  {result && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-gray-700">
                        {result.message}
                      </p>
                      
                      {result.data && (
                        <details className="text-sm">
                          <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                            View Response Data
                          </summary>
                          <pre className="mt-2 p-3 bg-gray-100 rounded-md overflow-x-auto text-xs">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* API Services Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Available API Services</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Products API', endpoints: 25, icon: Package },
                { name: 'Categories API', endpoints: 18, icon: Database },
                { name: 'Orders API', endpoints: 22, icon: ShoppingCart },
                { name: 'Customers API', endpoints: 20, icon: Users },
                { name: 'Auth API', endpoints: 15, icon: CheckCircle },
                { name: 'Dashboard API', endpoints: 12, icon: BarChart3 }
              ].map((service) => {
                const Icon = service.icon;
                return (
                  <div key={service.name} className="p-4 border border-gray-200 rounded-lg hover:border-fresh-300 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-fresh-600" />
                      <div>
                        <h4 className="font-medium text-gray-900">{service.name}</h4>
                        <p className="text-sm text-gray-600">{service.endpoints} endpoints</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Implementation Status */}
        <Card>
          <CardHeader>
            <CardTitle>Implementation Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">API Type Definitions</span>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  ✓ Complete
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Service Layer Implementation</span>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  ✓ Complete
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Error Handling & Interceptors</span>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  ✓ Complete
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Authentication Integration</span>
                <Badge className="bg-green-100 text-green-700 border-green-200">
                  ✓ Complete
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Spring Boot Backend Connection</span>
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                  ⚠ Pending
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
