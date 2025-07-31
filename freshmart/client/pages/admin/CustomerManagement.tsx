import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  Edit,
  Ban,
  CheckCircle,
  Download,
  RefreshCw,
  Users,
  ShoppingCart,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  Star,
  TrendingUp,
  UserPlus,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  status: "active" | "inactive" | "blocked";
  joinDate: string;
  lastLogin: string;
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  loyaltyPoints: number;
  addresses: Array<{
    id: string;
    type: "home" | "work" | "other";
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
    isDefault: boolean;
  }>;
  preferences: {
    notifications: boolean;
    emailMarketing: boolean;
    smsMarketing: boolean;
    favoriteCategories: string[];
  };
  notes: string;
  tags: string[];
  lastOrderDate?: string;
  segment: "new" | "regular" | "vip" | "inactive";
}

const generateDummyCustomers = (): Customer[] => {
  const names = [
    "Harish Erupothu",
    "Priya Sharma",
    "Rajesh Kumar",
    "Anita Singh",
    "Vivek Gupta",
    "Meera Patel",
    "Suresh Reddy",
    "Kavya Nair",
    "Amit Verma",
    "Sunita Joshi",
    "Rahul Chopra",
    "Deepika Agarwal",
    "Sanjay Mishra",
    "Pooja Bansal",
    "Vikas Yadav",
    "Shreya Das",
    "Manoj Thakur",
    "Neha Kulkarni",
    "Arun Pandey",
    "Ritu Saxena",
    "Karan Malhotra",
    "Divya Rao",
    "Ashok Singh",
    "Shilpa Gupta",
    "Rohit Jain",
    "Anjali Mehta",
    "Sachin Tiwari",
    "Priyanka Roy",
    "Nitin Sharma",
    "Swati Arora",
  ];

  const cities = [
    "Bangalore",
    "Mumbai",
    "Delhi",
    "Chennai",
    "Hyderabad",
    "Pune",
    "Kolkata",
    "Ahmedabad",
  ];
  const segments: Customer["segment"][] = ["new", "regular", "vip", "inactive"];
  const categories = [
    "dairy",
    "fruits",
    "vegetables",
    "bakery",
    "beverages",
    "snacks",
  ];

  return names
    .map((name, index) => {
      const joinDate = new Date(
        Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000,
      );
      const lastLogin = new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      );
      const totalOrders = Math.floor(Math.random() * 50) + 1;
      const totalSpent = Math.floor(Math.random() * 50000) + 500;
      const segment = segments[Math.floor(Math.random() * segments.length)];

      return {
        id: `customer_${String(index + 1).padStart(3, "0")}`,
        name,
        email: name.toLowerCase().replace(/\s+/g, ".") + "@example.com",
        phone: `+91 ${String(Math.floor(Math.random() * 9000000000) + 1000000000)}`,
        status:
          Math.random() > 0.9
            ? "blocked"
            : Math.random() > 0.95
              ? "inactive"
              : "active",
        joinDate: joinDate.toISOString(),
        lastLogin: lastLogin.toISOString(),
        totalOrders,
        totalSpent,
        averageOrderValue: Math.round(totalSpent / totalOrders),
        loyaltyPoints: Math.floor(totalSpent / 10),
        addresses: [
          {
            id: `addr_${index}_1`,
            type: "home" as const,
            street: `${Math.floor(Math.random() * 999) + 1}, ${["MG Road", "Brigade Road", "Koramangala", "Indiranagar", "Whitefield"][Math.floor(Math.random() * 5)]}`,
            city: cities[Math.floor(Math.random() * cities.length)],
            state: "Karnataka",
            pincode: `${560000 + Math.floor(Math.random() * 100)}`,
            landmark: [
              "Near Metro Station",
              "Opposite Mall",
              "Behind Hospital",
            ][Math.floor(Math.random() * 3)],
            isDefault: true,
          },
          ...(Math.random() > 0.5
            ? [
                {
                  id: `addr_${index}_2`,
                  type: "work" as const,
                  street: `${Math.floor(Math.random() * 999) + 1}, ${["Tech Park", "Business District", "IT Corridor"][Math.floor(Math.random() * 3)]}`,
                  city: cities[Math.floor(Math.random() * cities.length)],
                  state: "Karnataka",
                  pincode: `${560000 + Math.floor(Math.random() * 100)}`,
                  isDefault: false,
                },
              ]
            : []),
        ],
        preferences: {
          notifications: Math.random() > 0.2,
          emailMarketing: Math.random() > 0.3,
          smsMarketing: Math.random() > 0.5,
          favoriteCategories: categories.filter(() => Math.random() > 0.5),
        },
        notes:
          Math.random() > 0.7
            ? [
                "VIP customer - priority delivery",
                "Prefers organic products",
                "Bulk buyer - restaurant owner",
                "Price-sensitive customer",
              ][Math.floor(Math.random() * 4)]
            : "",
        tags:
          Math.random() > 0.5
            ? ["vip", "organic-lover", "bulk-buyer", "price-sensitive"].filter(
                () => Math.random() > 0.7,
              )
            : [],
        lastOrderDate:
          totalOrders > 0
            ? new Date(
                Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
              ).toISOString()
            : undefined,
        segment,
      };
    })
    .sort((a, b) => b.totalSpent - a.totalSpent);
};

export default function CustomerManagement() {
  const [customers, setCustomers] = React.useState<Customer[]>(
    generateDummyCustomers(),
  );
  const [filteredCustomers, setFilteredCustomers] =
    React.useState<Customer[]>(customers);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("all");
  const [selectedSegment, setSelectedSegment] = React.useState("all");
  const [selectedCustomer, setSelectedCustomer] =
    React.useState<Customer | null>(null);

  React.useEffect(() => {
    let filtered = customers;

    if (searchTerm) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone.includes(searchTerm),
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (customer) => customer.status === selectedStatus,
      );
    }

    if (selectedSegment !== "all") {
      filtered = filtered.filter(
        (customer) => customer.segment === selectedSegment,
      );
    }

    setFilteredCustomers(filtered);
  }, [customers, searchTerm, selectedStatus, selectedSegment]);

  const getStatusColor = (status: Customer["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "blocked":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getSegmentColor = (segment: Customer["segment"]) => {
    switch (segment) {
      case "vip":
        return "bg-purple-100 text-purple-700";
      case "regular":
        return "bg-blue-100 text-blue-700";
      case "new":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const updateCustomerStatus = (
    customerId: string,
    newStatus: Customer["status"],
  ) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === customerId
          ? { ...customer, status: newStatus }
          : customer,
      ),
    );
  };

  const stats = {
    total: customers.length,
    active: customers.filter((c) => c.status === "active").length,
    new: customers.filter((c) => c.segment === "new").length,
    vip: customers.filter((c) => c.segment === "vip").length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    averageOrderValue: Math.round(
      customers.reduce((sum, c) => sum + c.averageOrderValue, 0) /
        customers.length,
    ),
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
            Customer Management
          </h1>
          <p className="text-sm lg:text-base text-gray-600">
            Manage customer accounts and relationships
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
            onClick={() => setCustomers(generateDummyCustomers())}
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button size="sm" className="bg-fresh-600 hover:bg-fresh-700">
            <UserPlus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Add Customer</span>
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
                  Total Customers
                </p>
                <p className="text-lg lg:text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <Users className="w-6 h-6 lg:w-8 lg:h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-500">
                  Active
                </p>
                <p className="text-lg lg:text-2xl font-bold text-green-600">
                  {stats.active}
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
                  New Customers
                </p>
                <p className="text-lg lg:text-2xl font-bold text-fresh-600">
                  {stats.new}
                </p>
              </div>
              <UserPlus className="w-6 h-6 lg:w-8 lg:h-8 text-fresh-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-500">
                  VIP Customers
                </p>
                <p className="text-lg lg:text-2xl font-bold text-purple-600">
                  {stats.vip}
                </p>
              </div>
              <Star className="w-6 h-6 lg:w-8 lg:h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-500">
                  Total Revenue
                </p>
                <p className="text-lg lg:text-2xl font-bold text-fresh-600">
                  ₹{(stats.totalRevenue / 1000).toFixed(0)}K
                </p>
              </div>
              <DollarSign className="w-6 h-6 lg:w-8 lg:h-8 text-fresh-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 lg:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs lg:text-sm font-medium text-gray-500">
                  Avg Order Value
                </p>
                <p className="text-lg lg:text-2xl font-bold text-orange-600">
                  ₹{stats.averageOrderValue}
                </p>
              </div>
              <TrendingUp className="w-6 h-6 lg:w-8 lg:h-8 text-orange-600" />
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
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSegment} onValueChange={setSelectedSegment}>
              <SelectTrigger>
                <SelectValue placeholder="Segment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Segments</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="regular">Regular</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
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

      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Customers ({filteredCustomers.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-3 lg:p-4 font-medium text-gray-900 text-sm">
                    Customer
                  </th>
                  <th className="text-left p-3 lg:p-4 font-medium text-gray-900 text-sm">
                    Contact
                  </th>
                  <th className="text-left p-3 lg:p-4 font-medium text-gray-900 text-sm">
                    Orders
                  </th>
                  <th className="text-left p-3 lg:p-4 font-medium text-gray-900 text-sm">
                    Total Spent
                  </th>
                  <th className="text-left p-3 lg:p-4 font-medium text-gray-900 text-sm">
                    Segment
                  </th>
                  <th className="text-left p-3 lg:p-4 font-medium text-gray-900 text-sm">
                    Status
                  </th>
                  <th className="text-left p-3 lg:p-4 font-medium text-gray-900 text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="p-3 lg:p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-fresh-100 rounded-full flex items-center justify-center">
                          <span className="text-fresh-600 font-semibold text-sm">
                            {customer.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {customer.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Joined{" "}
                            {new Date(customer.joinDate).toLocaleDateString()}
                          </p>
                          {customer.tags.length > 0 && (
                            <div className="flex space-x-1 mt-1">
                              {customer.tags.slice(0, 2).map((tag) => (
                                <Badge
                                  key={tag}
                                  className="text-xs bg-blue-50 text-blue-600 border-blue-200"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 lg:p-4">
                      <div>
                        <p className="text-sm text-gray-900">
                          {customer.phone}
                        </p>
                        <p className="text-xs text-gray-500">
                          {customer.email}
                        </p>
                      </div>
                    </td>
                    <td className="p-3 lg:p-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {customer.totalOrders}
                        </p>
                        <p className="text-xs text-gray-500">
                          Avg: ₹{customer.averageOrderValue}
                        </p>
                      </div>
                    </td>
                    <td className="p-3 lg:p-4">
                      <div>
                        <p className="font-semibold text-gray-900">
                          ₹{customer.totalSpent.toLocaleString()}
                        </p>
                        <p className="text-xs text-fresh-600">
                          {customer.loyaltyPoints} points
                        </p>
                      </div>
                    </td>
                    <td className="p-3 lg:p-4">
                      <Badge
                        className={cn(
                          "text-xs",
                          getSegmentColor(customer.segment),
                        )}
                      >
                        {customer.segment.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-3 lg:p-4">
                      <Badge
                        className={cn(
                          "text-xs border",
                          getStatusColor(customer.status),
                        )}
                      >
                        {customer.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-3 lg:p-4">
                      <div className="flex items-center space-x-1 lg:space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => alert(`Customer details for ${customer.name} - Feature will be enhanced soon`)}
                          className="text-gray-600 hover:text-blue-600 p-1"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-gray-600 hover:text-green-600 p-1"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {customer.status === "active" ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              updateCustomerStatus(customer.id, "blocked")
                            }
                            className="text-gray-600 hover:text-red-600 p-1"
                          >
                            <Ban className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              updateCustomerStatus(customer.id, "active")
                            }
                            className="text-gray-600 hover:text-green-600 p-1"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
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

function CustomerDetailsModal({
  customer,
  onUpdateStatus,
}: {
  customer: Customer | null;
  onUpdateStatus: (customerId: string, status: Customer["status"]) => void;
}) {
  const [message, setMessage] = React.useState("");

  if (!customer) return null;

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle className="flex items-center justify-between">
          <span>Customer Details - {customer.name}</span>
          <div className="flex space-x-2">
            <Badge
              className={cn(
                "text-xs border",
                customer.status === "active"
                  ? "bg-green-100 text-green-700 border-green-200"
                  : customer.status === "blocked"
                    ? "bg-red-100 text-red-700 border-red-200"
                    : "bg-gray-100 text-gray-700 border-gray-200",
              )}
            >
              {customer.status.toUpperCase()}
            </Badge>
            <Badge
              className={cn(
                "text-xs",
                customer.segment === "vip"
                  ? "bg-purple-100 text-purple-700"
                  : customer.segment === "regular"
                    ? "bg-blue-100 text-blue-700"
                    : customer.segment === "new"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700",
              )}
            >
              {customer.segment.toUpperCase()}
            </Badge>
          </div>
        </DialogTitle>
        <DialogDescription>
          Customer since {new Date(customer.joinDate).toLocaleDateString()}
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
              <div className="w-16 h-16 bg-fresh-100 rounded-full flex items-center justify-center">
                <span className="text-fresh-600 font-semibold text-lg">
                  {customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900 text-lg">
                  {customer.name}
                </p>
                <p className="text-sm text-gray-500">{customer.email}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{customer.phone}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{customer.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm">
                  Last login:{" "}
                  {new Date(customer.lastLogin).toLocaleDateString()}
                </span>
              </div>
            </div>

            {customer.tags.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Tags:</p>
                <div className="flex flex-wrap gap-1">
                  {customer.tags.map((tag) => (
                    <Badge
                      key={tag}
                      className="text-xs bg-blue-50 text-blue-600 border-blue-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Order Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-xs text-blue-600 font-medium">
                  Total Orders
                </p>
                <p className="text-xl font-bold text-blue-700">
                  {customer.totalOrders}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-xs text-green-600 font-medium">
                  Total Spent
                </p>
                <p className="text-xl font-bold text-green-700">
                  ₹{customer.totalSpent.toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg">
                <p className="text-xs text-purple-600 font-medium">
                  Avg Order Value
                </p>
                <p className="text-xl font-bold text-purple-700">
                  ₹{customer.averageOrderValue}
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg">
                <p className="text-xs text-orange-600 font-medium">
                  Loyalty Points
                </p>
                <p className="text-xl font-bold text-orange-700">
                  {customer.loyaltyPoints}
                </p>
              </div>
            </div>
            {customer.lastOrderDate && (
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-xs text-gray-600 font-medium">Last Order</p>
                <p className="text-sm font-semibold text-gray-700">
                  {new Date(customer.lastOrderDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Addresses */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Delivery Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {customer.addresses.map((address) => (
              <div
                key={address.id}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-medium text-gray-900 text-sm capitalize">
                      {address.type}
                    </p>
                    {address.isDefault && (
                      <Badge className="text-xs bg-fresh-100 text-fresh-700">
                        Default
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{address.street}</p>
                  <p className="text-sm text-gray-600">
                    {address.city}, {address.state} - {address.pincode}
                  </p>
                  {address.landmark && (
                    <p className="text-xs text-gray-500">
                      Landmark: {address.landmark}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preferences & Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">
                Communication Preferences:
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Push Notifications
                  </span>
                  <Badge
                    className={
                      customer.preferences.notifications
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  >
                    {customer.preferences.notifications
                      ? "Enabled"
                      : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Email Marketing</span>
                  <Badge
                    className={
                      customer.preferences.emailMarketing
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  >
                    {customer.preferences.emailMarketing
                      ? "Enabled"
                      : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">SMS Marketing</span>
                  <Badge
                    className={
                      customer.preferences.smsMarketing
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  >
                    {customer.preferences.smsMarketing ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
            </div>

            {customer.preferences.favoriteCategories.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Favorite Categories:
                </p>
                <div className="flex flex-wrap gap-1">
                  {customer.preferences.favoriteCategories.map((category) => (
                    <Badge
                      key={category}
                      className="text-xs bg-blue-50 text-blue-600 border-blue-200 capitalize"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {customer.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg">
              {customer.notes}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Customer Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Customer Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {customer.status === "active" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateStatus(customer.id, "blocked")}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Block Customer
              </Button>
            )}
            {customer.status === "blocked" && (
              <Button
                size="sm"
                onClick={() => onUpdateStatus(customer.id, "active")}
                className="bg-green-600 hover:bg-green-700"
              >
                Unblock Customer
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              className="border-blue-300 text-blue-600"
            >
              View Orders
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-purple-300 text-purple-600"
            >
              Add Loyalty Points
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-orange-300 text-orange-600"
            >
              Send Offer
            </Button>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Send Message to Customer:
            </p>
            <div className="flex space-x-2">
              <Textarea
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1"
                rows={2}
              />
              <Button size="sm" className="bg-fresh-600 hover:bg-fresh-700">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
