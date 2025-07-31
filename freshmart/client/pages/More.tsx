import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Leaf,
  ArrowLeft,
  User,
  MapPin,
  Bell,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
  Star,
  Gift,
  Phone,
  Mail,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";

export default function More() {
  const menuItems = [
    {
      icon: User,
      title: "My Profile",
      subtitle: "Manage your account details",
      href: "/profile",
    },
    {
      icon: MapPin,
      title: "My Addresses",
      subtitle: "Manage delivery addresses",
      href: "/addresses",
    },
    {
      icon: Bell,
      title: "Notifications",
      subtitle: "Manage your preferences",
      href: "/notifications",
    },
    {
      icon: Star,
      title: "Rate & Review",
      subtitle: "Share your experience",
      href: "/reviews",
    },
    {
      icon: Gift,
      title: "Refer & Earn",
      subtitle: "Invite friends and earn rewards",
      href: "/referral",
    },
    {
      icon: HelpCircle,
      title: "Help & Support",
      subtitle: "Get help with your orders",
      href: "/help",
    },
    {
      icon: Settings,
      title: "Settings",
      subtitle: "App preferences and privacy",
      href: "/settings",
    },
    {
      icon: Shield,
      title: "Admin Panel",
      subtitle: "Manage products and categories",
      href: "/admin/login",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link to="/" className="md:hidden">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-fresh-500 rounded-lg flex items-center justify-center">
                  <Leaf className="w-3 h-3 md:w-5 md:h-5 text-white" />
                </div>
                <h1 className="text-lg md:text-xl font-bold text-fresh-600">
                  FreshMart
                </h1>
              </div>
            </div>
            <h2 className="text-lg font-semibold text-fresh-700">More</h2>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* User Profile Card */}
        <Card className="border-fresh-200 mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-fresh-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-fresh-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-fresh-700">
                  Hello, Harish!
                </h3>
                <p className="text-muted-foreground">Premium Member</p>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-1 text-sm">
                    <span className="text-muted-foreground">Orders:</span>
                    <span className="font-medium text-fresh-600">24</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm">
                    <span className="text-muted-foreground">Saved:</span>
                    <span className="font-medium text-fresh-600">₹2,400</span>
                  </div>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="space-y-2 mb-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.title} to={item.href}>
                <Card className="border-fresh-200 hover:shadow-md transition-all duration-200 active:scale-[0.98]">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-fresh-100 rounded-full flex items-center justify-center">
                        <Icon className="w-5 h-5 text-fresh-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-fresh-700">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {item.subtitle}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Quick Contact */}
        <Card className="border-fresh-200 mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-fresh-700 mb-4">
              Quick Contact
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="border-fresh-300 text-fresh-600 hover:bg-fresh-50 h-12"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Us
              </Button>
              <Button
                variant="outline"
                className="border-fresh-300 text-fresh-600 hover:bg-fresh-50 h-12"
              >
                <Mail className="w-4 h-4 mr-2" />
                Email Us
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="border-fresh-200 mb-6">
          <CardContent className="p-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-fresh-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-fresh-600" />
              </div>
              <h4 className="font-semibold text-fresh-700">FreshMart v2.1.0</h4>
              <p className="text-sm text-muted-foreground">
                Fresh groceries delivered daily
              </p>
              <div className="flex justify-center space-x-4 text-sm text-muted-foreground pt-4">
                <Link to="/privacy" className="hover:text-fresh-600">
                  Privacy Policy
                </Link>
                <span>•</span>
                <Link to="/terms" className="hover:text-fresh-600">
                  Terms of Service
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logout Button */}
        <Button
          variant="outline"
          className="w-full border-red-300 text-red-600 hover:bg-red-50 h-12 mb-6"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
