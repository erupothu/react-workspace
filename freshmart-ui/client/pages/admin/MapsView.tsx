import React, { useState, useEffect, useRef } from 'react';

// Google Maps type declarations
declare global {
  interface Window {
    google: any;
  }
}

// Simplified Google Maps types for our use case
interface GoogleMap {
  setCenter(latLng: { lat: number; lng: number }): void;
  setZoom(zoom: number): void;
  fitBounds(bounds: any): void;
}

interface GoogleMarker {
  setMap(map: GoogleMap | null): void;
  getTitle(): string | undefined;
  addListener(eventName: string, handler: Function): void;
}

interface GoogleInfoWindow {
  setContent(content: string): void;
  open(map?: GoogleMap, anchor?: GoogleMarker): void;
}
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MapPin,
  RefreshCw,
  Search,
  Car,
  Clock,
  User,
  Phone,
  MapIcon,
  Navigation,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/api';
import { Order } from '@shared/api';

interface OrderLocation {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  status: Order['status'];
  deliveryAddress: {
    fullAddress: string;
    latitude: number;
    longitude: number;
    landmark?: string;
  };
  estimatedDelivery?: string;
  deliveryBoy?: {
    name: string;
    phone: string;
  };
  priority: boolean;
  orderValue: number;
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  preparing: 'bg-purple-100 text-purple-800 border-purple-200',
  out_for_delivery: 'bg-orange-100 text-orange-800 border-orange-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export default function MapsView() {
  const [orderLocations, setOrderLocations] = useState<OrderLocation[]>([]);
  const [filteredLocations, setFilteredLocations] = useState<OrderLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderLocation | null>(null);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<GoogleMap | null>(null);
  const markersRef = useRef<GoogleMarker[]>([]);
  const infoWindowRef = useRef<GoogleInfoWindow | null>(null);

  // Load Google Maps script
  useEffect(() => {
    const loadGoogleMaps = () => {
      if (window.google) {
        setMapLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBrYApqVNXyUU6etgeJASnjouAyO_YiN5k&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      script.onerror = () => {
        setError('Failed to load Google Maps. Please check your internet connection.');
      };
      document.head.appendChild(script);
    };

    loadGoogleMaps();
  }, []);

  // Initialize map when loaded
  useEffect(() => {
    if (mapLoaded && mapRef.current && !googleMapRef.current) {
      initializeMap();
    }
  }, [mapLoaded]);

  // Update markers when locations change
  useEffect(() => {
    updateMapMarkers();
    if (googleMapRef.current && filteredLocations.length > 0) {
      updateMapMarkers();
    }
  }, [filteredLocations]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google) return;
//
    // Default center (you can change this to your city/region)
    const defaultCenter = { lat: 12.9716, lng: 77.5946 }; // Bangalore, India

    googleMapRef.current = new window.google.maps.Map(mapRef.current, {
      zoom: 12,
      center: defaultCenter,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
    }) as any;

    infoWindowRef.current = new window.google.maps.InfoWindow() as any;
    updateMapMarkers
  };

  const updateMapMarkers = () => {
    if (!googleMapRef.current || !window.google) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Add new markers
    const bounds = new window.google.maps.LatLngBounds();

    // filteredLocations.forEach((location) => {
      const position = {
        lat: 12.932989,
        lng: 77.758119,
      };

      // Create custom marker icon based on status
      const markerColor = '#ef4444'; //location.priority ? '#ef4444' : getStatusColor(location.status);
      const markerIcon = {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: markerColor,
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      };

      const marker = new window.google.maps.Marker({
        position,
        map: googleMapRef.current,
        title: `Order #123`,
        icon: markerIcon,
      }) as any;

      // Add click listener for marker
      marker.addListener('click', () => {
        // setSelectedOrder(location);
        showInfoWindow(marker);
      });

      markersRef.current.push(marker);
      bounds.extend(position);
    // });

    // Fit map to show all markers
    if (filteredLocations.length > 0) {
      googleMapRef.current.fitBounds(bounds);
    }
  };



  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'confirmed': return '#3b82f6';
      case 'preparing': return '#8b5cf6';
      case 'out_for_delivery': return '#f97316';
      case 'delivered': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const showInfoWindow = (marker: any) => {
    if (!infoWindowRef.current) return;
    const content = `<div class="p-3 max-w-xs">
        <div class="font-semibold text-lg mb-2">Order #numberr/div></div>`
    // const content = `
    //   <div class="p-3 max-w-xs">
    //     <div class="font-semibold text-lg mb-2">Order #${location.orderNumber}</div>
    //     <div class="space-y-1 text-sm">
    //       <div><strong>Customer:</strong> ${location.customerName}</div>
    //       <div><strong>Phone:</strong> ${location.customerPhone}</div>
    //       <div><strong>Status:</strong> <span class="inline-block px-2 py-1 rounded text-xs font-medium" style="background-color: ${getStatusColor(location.status)}20; color: ${getStatusColor(location.status)}">${location.status.replace('_', ' ').toUpperCase()}</span></div>
    //       <div><strong>Value:</strong> ₹${location.orderValue.toFixed(2)}</div>
    //       <div><strong>Address:</strong> ${location.deliveryAddress.fullAddress}</div>
    //       ${location.deliveryBoy ? `<div><strong>Delivery Boy:</strong> ${location.deliveryBoy.name}</div>` : ''}
    //       ${location.estimatedDelivery ? `<div><strong>ETA:</strong> ${location.estimatedDelivery}</div>` : ''}
    //     </div>
    //   </div>
    // `;

    infoWindowRef.current.setContent(content);
    infoWindowRef.current.open(googleMapRef.current, marker);
  };

  const fetchOrderLocations = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch active orders (not delivered or cancelled)
      const response = await api.orders.getOrders({
        limit: 1000,
      });

      if (response.success && response.data) {
        const activeOrders = response.data.filter(order =>
          ['pending', 'confirmed', 'preparing', 'out_for_delivery'].includes(order.status)
        );

        const locations: OrderLocation[] = activeOrders
          .filter(order =>
            order.deliveryAddress?.latitude &&
            order.deliveryAddress?.longitude &&
            order.deliveryAddress?.fullAddress
          )
          .map(order => ({
            orderId: order.id,
            orderNumber: order.orderNumber,
            customerName: (order.customer ? `${order.customer?.name}` : 'Unknown Customer').trim(),
            customerPhone: order.customer?.phone || '',
            status: order.status,
            deliveryAddress: {
              fullAddress: order.deliveryAddress.fullAddress ||
                          `${order.deliveryAddress.street}, ${order.deliveryAddress.city}, ${order.deliveryAddress.state} ${order.deliveryAddress.pincode}`,
              latitude: order.deliveryAddress.latitude!,
              longitude: order.deliveryAddress.longitude!,
              landmark: order.deliveryAddress.landmark,
            },
            estimatedDelivery: order.estimatedDelivery,
            deliveryBoy: order.deliveryBoy ? {
              name: order.deliveryBoy.name,
              phone: order.deliveryBoy.phone,
            } : undefined,
            priority: order.priority || false,
            orderValue: order.total,
          }));

        setOrderLocations(locations);
        setFilteredLocations(locations);
      } else {
        setError(response.error?.message || 'Failed to fetch order locations');
      }
    } catch (err) {
      console.error('Error fetching order locations:', err);
      setError('Failed to fetch order locations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Filter locations based on search and filters
  useEffect(() => {
    let filtered = orderLocations;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(location =>
        location.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.deliveryAddress.fullAddress.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(location => location.status === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      const isPriority = priorityFilter === 'priority';
      filtered = filtered.filter(location => location.priority === isPriority);
    }

    setFilteredLocations(filtered);
  }, [orderLocations, searchTerm, statusFilter, priorityFilter]);

  // Load data on component mount
  useEffect(() => {
    fetchOrderLocations();
  }, []);

  const centerOnOrder = (location: OrderLocation) => {
    if (!googleMapRef.current || !window.google) return;

    const position = {
      lat: location.deliveryAddress.latitude,
      lng: location.deliveryAddress.longitude,
    };

    googleMapRef.current.setCenter(position);
    googleMapRef.current.setZoom(16);
    setSelectedOrder(location);

    // Find and trigger click on the marker
    const marker = markersRef.current.find(m =>
      m.getTitle && m.getTitle() === `Order #${location.orderNumber}`
    );
    if (marker && window.google.maps.event) {
      window.google.maps.event.trigger(marker, 'click');
    }
  };

  const getStatusStats = () => {
    const stats = {
      total: orderLocations.length,
      pending: 0,
      confirmed: 0,
      preparing: 0,
      outForDelivery: 0,
      priority: 0,
    };

    orderLocations.forEach(location => {
      if (location.status === 'pending') stats.pending++;
      if (location.status === 'confirmed') stats.confirmed++;
      if (location.status === 'preparing') stats.preparing++;
      if (location.status === 'out_for_delivery') stats.outForDelivery++;
      if (location.priority) stats.priority++;
    });

    return stats;
  };

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-fresh-600" />
          <p className="text-gray-600">Loading delivery locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Map</h1>
          <p className="text-gray-600">Track active orders and delivery locations</p>
        </div>
        <Button onClick={fetchOrderLocations} disabled={loading}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Orders</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.confirmed}</div>
            <div className="text-sm text-gray-600">Confirmed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.preparing}</div>
            <div className="text-sm text-gray-600">Preparing</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.outForDelivery}</div>
            <div className="text-sm text-gray-600">Out for Delivery</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.priority}</div>
            <div className="text-sm text-gray-600">Priority</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapIcon className="w-5 h-5" />
                Delivery Locations
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : (
                <div 
                  ref={mapRef}
                  className="w-full h-96 rounded-lg border"
                  style={{ minHeight: '400px' }}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Orders List */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                Active Orders ({filteredLocations.length})
              </CardTitle>
              
              {/* Filters */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="preparing">Preparing</SelectItem>
                      <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredLocations.map((location) => (
                  <div
                    key={location.orderId}
                    className={cn(
                      "p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50",
                      selectedOrder?.orderId === location.orderId && "bg-fresh-50 border-fresh-200"
                    )}
                    onClick={() => centerOnOrder(location)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">#{location.orderNumber}</span>
                        {location.priority && (
                          <Badge variant="destructive" className="text-xs">
                            Priority
                          </Badge>
                        )}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", statusColors[location.status] || statusColors.pending)}
                      >
                        {location.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        <span>{location.customerName}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{location.customerPhone}</span>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{location.deliveryAddress.fullAddress}</span>
                      </div>
                      
                      {location.estimatedDelivery && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>ETA: {location.estimatedDelivery}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-medium">₹{location.orderValue.toFixed(2)}</span>
                        {location.deliveryBoy && (
                          <span className="text-green-600 text-xs">
                            🚗 {location.deliveryBoy.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredLocations.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No orders found matching your criteria</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
