import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Search,
  Filter,
  Eye,
  Download,
  RefreshCw,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
  };
  items: Array<{
    id: string;
    name: string;
    image: string;
    quantity: number;
    price: number;
    unit: string;
  }>;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "out_for_delivery"
    | "delivered"
    | "cancelled"
    | "refunded";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  paymentMethod: "cash" | "card" | "upi" | "wallet";
  total: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  deliveryTime: string;
  orderDate: string;
  estimatedDelivery: string;
  actualDelivery?: string;
  notes?: string;
  trackingId?: string;
}

const generateDummyOrders = (): Order[] => {
  const customers = [
    {
      id: "1",
      name: "Harish Erupothu",
      email: "harish@example.com",
      phone: "+91 9876543210",
    },
    {
      id: "2",
      name: "Priya Sharma",
      email: "priya.sharma@example.com",
      phone: "+91 9876543211",
    },
    {
      id: "3",
      name: "Rajesh Kumar",
      email: "rajesh.kumar@example.com",
      phone: "+91 9876543212",
    },
    {
      id: "4",
      name: "Anita Singh",
      email: "anita.singh@example.com",
      phone: "+91 9876543213",
    },
    {
      id: "5",
      name: "Vivek Gupta",
      email: "vivek.gupta@example.com",
      phone: "+91 9876543214",
    },
    {
      id: "6",
      name: "Meera Patel",
      email: "meera.patel@example.com",
      phone: "+91 9876543215",
    },
    {
      id: "7",
      name: "Suresh Reddy",
      email: "suresh.reddy@example.com",
      phone: "+91 9876543216",
    },
    {
      id: "8",
      name: "Kavya Nair",
      email: "kavya.nair@example.com",
      phone: "+91 9876543217",
    },
  ];

  const products = [
    {
      id: "1",
      name: "Fresh Red Apples",
      image:
        "https://images.pexels.com/photos/3746517/pexels-photo-3746517.jpeg",
      price: 140,
      unit: "1 Kg",
    },
    {
      id: "2",
      name: "Ripe Yellow Bananas",
      image:
        "https://images.pexels.com/photos/2872767/pexels-photo-2872767.jpeg",
      price: 60,
      unit: "1 Dozen",
    },
    {
      id: "3",
      name: "Fresh Strawberries",
      image:
        "https://images.pexels.com/photos/1788912/pexels-photo-1788912.jpeg",
      price: 300,
      unit: "500g",
    },
    {
      id: "4",
      name: "Heritage Toned Milk",
      image:
        "https://images.pexels.com/photos/18258533/pexels-photo-18258533.jpeg",
      price: 65,
      unit: "1L",
    },
    {
      id: "5",
      name: "Fresh Carrots",
      image:
        "https://images.pexels.com/photos/5855239/pexels-photo-5855239.jpeg",
      price: 40,
      unit: "500g",
    },
    {
      id: "6",
      name: "Green Broccoli",
      image:
        "https://images.pexels.com/photos/1346347/pexels-photo-1346347.jpeg",
      price: 80,
      unit: "500g",
    },
    {
      id: "7",
      name: "Fresh Spinach",
      image:
        "https://images.pexels.com/photos/2297961/pexels-photo-2297961.jpeg",
      price: 25,
      unit: "250g",
    },
    {
      id: "8",
      name: "Farm Fresh Potatoes",
      image:
        "https://images.pexels.com/photos/4502145/pexels-photo-4502145.jpeg",
      price: 30,
      unit: "1 Kg",
    },
  ];

  const statuses: Order["status"][] = [
    "pending",
    "confirmed",
    "preparing",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];
  const paymentMethods: Order["paymentMethod"][] = [
    "cash",
    "card",
    "upi",
    "wallet",
  ];
  const cities = [
    "Bangalore",
    "Mumbai",
    "Delhi",
    "Chennai",
    "Hyderabad",
    "Pune",
    "Kolkata",
  ];

  return Array.from({ length: 50 }, (_, i) => {
    const customer = customers[Math.floor(Math.random() * customers.length)];
    const orderDate = new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
    );
    const estimatedDelivery = new Date(
      orderDate.getTime() + 2 * 60 * 60 * 1000,
    );
    const status = statuses[Math.floor(Math.random() * statuses.length)];

    const numItems = Math.floor(Math.random() * 5) + 1;
    const orderItems = Array.from({ length: numItems }, () => {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      return {
        ...product,
        quantity,
      };
    });

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const tax = Math.round(subtotal * 0.05);
    const deliveryFee = subtotal > 299 ? 0 : 40;
    const discount = Math.floor(Math.random() * 50);
    const total = subtotal + tax + deliveryFee - discount;

    return {
      id: `order_${String(i + 1).padStart(3, "0")}`,
      orderNumber: `FM${String(1000 + i).slice(-4)}`,
      customer,
      items: orderItems,
      status,
      paymentStatus:
        status === "cancelled"
          ? "refunded"
          : Math.random() > 0.1
            ? "paid"
            : "pending",
      paymentMethod:
        paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      total,
      subtotal,
      tax,
      deliveryFee,
      discount,
      deliveryAddress: {
        street: `${Math.floor(Math.random() * 999) + 1}, ${["MG Road", "Brigade Road", "Koramangala", "Indiranagar", "Whitefield"][Math.floor(Math.random() * 5)]}`,
        city: cities[Math.floor(Math.random() * cities.length)],
        state: "Karnataka",
        pincode: `${560000 + Math.floor(Math.random() * 100)}`,
        landmark: ["Near Metro Station", "Opposite Mall", "Behind Hospital"][
          Math.floor(Math.random() * 3)
        ],
      },
      deliveryTime: [
        "9:00 AM - 12:00 PM",
        "12:00 PM - 3:00 PM",
        "3:00 PM - 6:00 PM",
        "6:00 PM - 9:00 PM",
      ][Math.floor(Math.random() * 4)],
      orderDate: orderDate.toISOString(),
      estimatedDelivery: estimatedDelivery.toISOString(),
      actualDelivery:
        status === "delivered"
          ? new Date(
              estimatedDelivery.getTime() + Math.random() * 60 * 60 * 1000,
            ).toISOString()
          : undefined,
      notes:
        Math.random() > 0.7
          ? [
              "Please call before delivery",
              "Leave at door",
              "Ring doorbell twice",
            ][Math.floor(Math.random() * 3)]
          : undefined,
      trackingId:
        status !== "pending"
          ? `TRK${String(Math.floor(Math.random() * 900000) + 100000)}`
          : undefined,
    };
  }).sort(
    (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime(),
  );
};

export default function OrderManagement() {
  const [orders, setOrders] = React.useState<Order[]>(generateDummyOrders());
  const [filteredOrders, setFilteredOrders] = React.useState<Order[]>(orders);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("all");
  const [selectedPaymentStatus, setSelectedPaymentStatus] =
    React.useState("all");
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

  React.useEffect(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.customer.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.customer.phone.includes(searchTerm),
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((order) => order.status === selectedStatus);
    }

    if (selectedPaymentStatus !== "all") {
      filtered = filtered.filter(
        (order) => order.paymentStatus === selectedPaymentStatus,
      );
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, selectedStatus, selectedPaymentStatus]);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "preparing":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "out_for_delivery":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      case "refunded":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "refunded":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              trackingId:
                newStatus !== "pending" && !order.trackingId
                  ? `TRK${String(Math.floor(Math.random() * 900000) + 100000)}`
                  : order.trackingId,
              actualDelivery:
                newStatus === "delivered"
                  ? new Date().toISOString()
                  : order.actualDelivery,
            }
          : order,
      ),
    );
  };

  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    outForDelivery: orders.filter((o) => o.status === "out_for_delivery")
      .length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    revenue: orders
      .filter((o) => o.status === "delivered")
      .reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
            Order Management
          </h1>
          <p className="text-sm lg:text-base text-gray-600">
            Track and manage customer orders
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOrders(generateDummyOrders())}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 lg:gap-4">
        <Card>
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-500">
                  Total Orders
                </p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <ShoppingCart className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-500">
                  Pending
                </p>
                <p className="text-lg lg:text-2xl font-bold text-yellow-600">
                  {stats.pending}
                </p>
              </div>
              <Clock className="w-6 h-6 lg:w-8 lg:h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-500">
                  Preparing
                </p>
                <p className="text-lg lg:text-2xl font-bold text-orange-600">
                  {stats.preparing}
                </p>
              </div>
              <Package className="w-6 h-6 lg:w-8 lg:h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-500">
                  Out for Delivery
                </p>
                <p className="text-lg lg:text-2xl font-bold text-purple-600">
                  {stats.outForDelivery}
                </p>
              </div>
              <Truck className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-500">
                  Delivered
                </p>
                <p className="text-lg lg:text-2xl font-bold text-green-600">
                  {stats.delivered}
                </p>
              </div>
              <CheckCircle className="w-6 h-6 lg:w-8 lg:h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-500">
                  Revenue
                </p>
                <p className="text-lg lg:text-2xl font-bold text-fresh-600">
                  ₹{stats.revenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-6 h-6 lg:w-8 lg:h-8 text-fresh-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 lg:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search orders, customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Order Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="out_for_delivery">
                  Out for Delivery
                </SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedPaymentStatus}
              onValueChange={setSelectedPaymentStatus}
            >
              <SelectTrigger>
                <SelectValue placeholder="Payment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="border-fresh-300 text-fresh-600"
            >
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Orders ({filteredOrders.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-3 lg:p-4 font-medium text-gray-900 text-sm">
                    Order
                  </th>
                  <th className="text-left p-3 lg:p-4 font-medium text-gray-900 text-sm">
                    Customer
                  </th>
                  <th className="text-left p-3 lg:p-4 font-medium text-gray-900 text-sm">
                    Items
                  </th>
                  <th className="text-left p-3 lg:p-4 font-medium text-gray-900 text-sm">
                    Total
                  </th>
                  <th className="text-left p-3 lg:p-4 font-medium text-gray-900 text-sm">
                    Status
                  </th>
                  <th className="text-left p-3 lg:p-4 font-medium text-gray-900 text-sm">
                    Payment
                  </th>
                  <th className="text-left p-3 lg:p-4 font-medium text-gray-900 text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="p-3 lg:p-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {order.orderNumber}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </p>
                        {order.trackingId && (
                          <p className="text-xs text-blue-600">
                            #{order.trackingId}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="p-3 lg:p-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {order.customer.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.customer.phone}
                        </p>
                      </div>
                    </td>
                    <td className="p-3 lg:p-4">
                      <div className="flex items-center space-x-1">
                        {order.items.slice(0, 3).map((item, index) => (
                          <img
                            key={index}
                            src={item.image}
                            alt={item.name}
                            className="w-6 h-6 lg:w-8 lg:h-8 rounded object-cover"
                          />
                        ))}
                        {order.items.length > 3 && (
                          <div className="w-6 h-6 lg:w-8 lg:h-8 rounded bg-gray-100 flex items-center justify-center">
                            <span className="text-xs text-gray-600">
                              +{order.items.length - 3}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-3 lg:p-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          ₹{order.total}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.items.length} items
                        </p>
                      </div>
                    </td>
                    <td className="p-3 lg:p-4">
                      <Badge
                        className={cn(
                          "text-xs border",
                          getStatusColor(order.status),
                        )}
                      >
                        {order.status.replace("_", " ").toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-3 lg:p-4">
                      <Badge
                        className={cn(
                          "text-xs",
                          getPaymentStatusColor(order.paymentStatus),
                        )}
                      >
                        {order.paymentStatus.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-3 lg:p-4">
                      <div className="flex items-center space-x-1 lg:space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => alert(`Order details for ${order.orderNumber} - Feature will be enhanced soon`)}
                          className="text-gray-600 hover:text-blue-600 p-1"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function OrderDetailsModal({
  order,
  onUpdateStatus,
}: {
  order: Order | null;
  onUpdateStatus: (orderId: string, status: Order["status"]) => void;
}) {
  if (!order) return null;

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span>Order Details - {order.orderNumber}</span>
          <Badge
            className={cn(
              "text-xs border",
              order.status === "delivered"
                ? "bg-green-100 text-green-700 border-green-200"
                : order.status === "cancelled"
                  ? "bg-red-100 text-red-700 border-red-200"
                  : "bg-blue-100 text-blue-700 border-blue-200",
            )}
          >
            {order.status.replace("_", " ").toUpperCase()}
          </Badge>
        </DialogTitle>
        <DialogDescription>
          Placed on {new Date(order.orderDate).toLocaleDateString()} at{" "}
          {new Date(order.orderDate).toLocaleTimeString()}
        </DialogDescription>
      </DialogHeader>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-fresh-100 rounded-full flex items-center justify-center">
                <span className="text-fresh-600 font-semibold">
                  {order.customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {order.customer.name}
                </p>
                <p className="text-sm text-gray-500">{order.customer.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{order.customer.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{order.customer.email}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Delivery Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Delivery Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-gray-400 mt-1" />
              <div className="text-sm">
                <p>{order.deliveryAddress.street}</p>
                <p>
                  {order.deliveryAddress.city}, {order.deliveryAddress.state}
                </p>
                <p>PIN: {order.deliveryAddress.pincode}</p>
                {order.deliveryAddress.landmark && (
                  <p className="text-gray-500">
                    Landmark: {order.deliveryAddress.landmark}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-sm">
                Expected:{" "}
                {new Date(order.estimatedDelivery).toLocaleDateString()} (
                {order.deliveryTime})
              </span>
            </div>
            {order.trackingId && (
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-blue-700">
                  Tracking ID: {order.trackingId}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.unit}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">
                    ₹{item.price} × {item.quantity}
                  </p>
                  <p className="text-sm font-semibold text-fresh-600">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>₹{order.tax}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span>₹{order.deliveryFee}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>₹{order.total}</span>
            </div>
            <div className="mt-4">
              <Badge
                className={cn(
                  "text-xs",
                  order.paymentStatus === "paid"
                    ? "bg-green-100 text-green-700"
                    : order.paymentStatus === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700",
                )}
              >
                Payment: {order.paymentStatus.toUpperCase()} (
                {order.paymentMethod.toUpperCase()})
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Actions */}
      {order.status !== "delivered" && order.status !== "cancelled" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Update Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              {order.status === "pending" && (
                <Button
                  size="sm"
                  onClick={() => onUpdateStatus(order.id, "confirmed")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Confirm Order
                </Button>
              )}
              {order.status === "confirmed" && (
                <Button
                  size="sm"
                  onClick={() => onUpdateStatus(order.id, "preparing")}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Start Preparing
                </Button>
              )}
              {order.status === "preparing" && (
                <Button
                  size="sm"
                  onClick={() => onUpdateStatus(order.id, "out_for_delivery")}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Out for Delivery
                </Button>
              )}
              {order.status === "out_for_delivery" && (
                <Button
                  size="sm"
                  onClick={() => onUpdateStatus(order.id, "delivered")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Mark Delivered
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateStatus(order.id, "cancelled")}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Cancel Order
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {order.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Special Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg">
              {order.notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
