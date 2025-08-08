import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle,
  Truck,
  ShoppingBag,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Orders() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please sign in</h2>
          <p className="text-muted-foreground mb-4">
            You need to be logged in to view your orders
          </p>
          <Link to="/">
            <Button className="bg-fresh-500 hover:bg-fresh-600">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Mock orders data
  const orders = [
    {
      id: "ORD001",
      date: "2024-01-15",
      status: "delivered",
      total: "₹450",
      items: ["Fresh Apples", "Milk", "Bread"],
      deliveryTime: "30 min",
    },
    {
      id: "ORD002",
      date: "2024-01-14",
      status: "processing",
      total: "₹320",
      items: ["Bananas", "Carrots", "Rice"],
      deliveryTime: "25 min",
    },
    {
      id: "ORD003",
      date: "2024-01-12",
      status: "delivered",
      total: "₹680",
      items: ["Strawberries", "Yogurt", "Eggs", "Tomatoes"],
      deliveryTime: "35 min",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "processing":
        return <Clock className="w-4 h-4 text-orange-600" />;
      case "shipping":
        return <Truck className="w-4 h-4 text-blue-600" />;
      default:
        return <Package className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "processing":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "shipping":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="p-2">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-fresh-700">My Orders</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground mb-4">
              Start shopping to see your orders here
            </p>
            <Link to="/">
              <Button className="bg-fresh-500 hover:bg-fresh-600">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base">
                        Order #{order.id}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={getStatusColor(order.status)}
                    >
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Items:</p>
                      <p className="text-sm text-muted-foreground">
                        {order.items.join(", ")}
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-lg font-semibold text-fresh-600">
                          {order.total}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Delivered in {order.deliveryTime}
                        </p>
                      </div>

                      <div className="space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {order.status === "delivered" && (
                          <Button
                            size="sm"
                            className="bg-fresh-500 hover:bg-fresh-600"
                          >
                            Reorder
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Bottom padding for mobile navigation */}
      <div className="h-16 md:hidden" />
    </div>
  );
}
