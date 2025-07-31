import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Package,
  Grid3x3,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  TrendingUp,
  ShoppingCart,
  AlertTriangle,
  Menu,
  X,
} from "lucide-react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: Grid3x3,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    title: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminDashboard() {
  const [adminUser, setAdminUser] = React.useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    // Check admin authentication
    const session = localStorage.getItem("admin_session");
    if (!session) {
      navigate("/admin/login");
      return;
    }

    try {
      const parsedSession = JSON.parse(session);
      setAdminUser(parsedSession.user);
    } catch {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    navigate("/admin/login");
  };

  const isDashboardHome = location.pathname === "/admin/dashboard";

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-fresh-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-fresh-500 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">FreshMart</h1>
                <p className="text-sm text-fresh-600">Admin Panel</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <nav className="p-4">
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? location.pathname === item.href
                : location.pathname.startsWith(item.href);

              return (
                <button
                  key={item.href}
                  onClick={() => {
                    navigate(item.href);
                    setSidebarOpen(false); // Close sidebar on mobile after navigation
                  }}
                  className={cn(
                    "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors",
                    isActive
                      ? "bg-fresh-50 text-fresh-700 border border-fresh-200"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                Admin User
              </p>
              <p className="text-xs text-gray-500 truncate">
                {adminUser.email}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-500 hover:text-red-600 flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0">
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div>
                <h2 className="text-lg lg:text-xl font-semibold text-gray-900">
                  {sidebarItems.find((item) =>
                    item.exact
                      ? location.pathname === item.href
                      : location.pathname.startsWith(item.href),
                  )?.title || "Dashboard"}
                </h2>
                <p className="text-sm text-gray-500 hidden sm:block">
                  Manage your FreshMart store
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 lg:space-x-3">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 hidden sm:inline-flex"
              >
                Live
              </Badge>
              <Button
                onClick={() => navigate("/admin/products/add")}
                className="bg-fresh-600 hover:bg-fresh-700"
                size="sm"
              >
                <Plus className="w-4 h-4 lg:mr-2" />
                <span className="hidden lg:inline">Add Product</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-6">
          {isDashboardHome ? <DashboardHome /> : <Outlet />}
        </div>
      </div>
    </div>
  );
}

function DashboardHome() {
  const stats = [
    {
      title: "Total Products",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Categories",
      value: "24",
      change: "+2",
      trend: "up",
      icon: Grid3x3,
      color: "text-green-600",
    },
    {
      title: "Orders Today",
      value: "89",
      change: "+5%",
      trend: "up",
      icon: ShoppingCart,
      color: "text-purple-600",
    },
    {
      title: "Revenue",
      value: "₹45,230",
      change: "+8%",
      trend: "up",
      icon: DollarSign,
      color: "text-fresh-600",
    },
  ];

  const recentActivities = [
    {
      action: "New product added",
      item: "Organic Bananas",
      time: "5 min ago",
      type: "product",
    },
    {
      action: "Price updated",
      item: "Fresh Milk 1L",
      time: "12 min ago",
      type: "price",
    },
    {
      action: "Category created",
      item: "Organic Fruits",
      time: "1 hour ago",
      type: "category",
    },
    {
      action: "Inventory alert",
      item: "Greek Yogurt",
      time: "2 hours ago",
      type: "alert",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-gray-200">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                      <span className="text-xs text-green-600">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div
                    className={cn("p-3 rounded-full bg-gray-50", stat.color)}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Recent Activity */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center",
                      activity.type === "product" &&
                        "bg-blue-100 text-blue-600",
                      activity.type === "price" &&
                        "bg-green-100 text-green-600",
                      activity.type === "category" &&
                        "bg-purple-100 text-purple-600",
                      activity.type === "alert" &&
                        "bg-orange-100 text-orange-600",
                    )}
                  >
                    {activity.type === "alert" ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <Package className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-500">{activity.item}</p>
                  </div>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 lg:gap-4">
              <Button
                variant="outline"
                className="h-16 lg:h-20 flex flex-col space-y-1 lg:space-y-2 border-fresh-200 hover:bg-fresh-50"
                onClick={() => (window.location.href = "/admin/products/add")}
              >
                <Package className="w-5 h-5 lg:w-6 lg:h-6 text-fresh-600" />
                <span className="text-xs lg:text-sm">Add Product</span>
              </Button>

              <Button
                variant="outline"
                className="h-16 lg:h-20 flex flex-col space-y-1 lg:space-y-2 border-fresh-200 hover:bg-fresh-50"
                onClick={() => (window.location.href = "/admin/categories")}
              >
                <Grid3x3 className="w-5 h-5 lg:w-6 lg:h-6 text-fresh-600" />
                <span className="text-xs lg:text-sm">Categories</span>
              </Button>

              <Button
                variant="outline"
                className="h-16 lg:h-20 flex flex-col space-y-1 lg:space-y-2 border-fresh-200 hover:bg-fresh-50"
                onClick={() => (window.location.href = "/admin/orders")}
              >
                <ShoppingCart className="w-5 h-5 lg:w-6 lg:h-6 text-fresh-600" />
                <span className="text-xs lg:text-sm">Orders</span>
              </Button>

              <Button
                variant="outline"
                className="h-16 lg:h-20 flex flex-col space-y-1 lg:space-y-2 border-fresh-200 hover:bg-fresh-50"
                onClick={() => (window.location.href = "/admin/analytics")}
              >
                <BarChart3 className="w-5 h-5 lg:w-6 lg:h-6 text-fresh-600" />
                <span className="text-xs lg:text-sm">Analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
