import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Grid3x3,
  ShoppingBasket,
  Wallet,
  MoreHorizontal,
  User,
} from "lucide-react";

export default function BottomNavigation() {
  const location = useLocation();

  // Mock cart count - in a real app, this would come from a context or state management
  const cartCount = 1;

  const navItems = [
    {
      name: "Home",
      href: "/",
      icon: Home,
      active: location.pathname === "/",
    },
    {
      name: "Categories",
      href: "/categories",
      icon: Grid3x3,
      active:
        location.pathname === "/categories" ||
        location.pathname.startsWith("/categories/"),
    },
    {
      name: "Basket",
      href: "/basket",
      icon: ShoppingBasket,
      active: location.pathname === "/basket",
      badge: cartCount,
    },
    {
      name: "Wallet",
      href: "/wallet",
      icon: Wallet,
      active: location.pathname === "/wallet",
    },
    {
      name: "More",
      href: "/more",
      icon: MoreHorizontal,
      active: location.pathname === "/more",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden shadow-lg">
      <div className="grid grid-cols-5 h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center space-y-1 transition-colors active:scale-95 transform duration-150 py-2",
                item.active
                  ? "text-fresh-600"
                  : "text-gray-500 hover:text-fresh-500",
              )}
            >
              <div className="relative">
                <Icon
                  className={cn("w-6 h-6", item.active && "text-fresh-600")}
                />
                {item.badge && item.badge > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-fresh-600 rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  </div>
                )}
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  item.active ? "text-fresh-600" : "text-gray-500",
                )}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
      {/* Safe area padding for devices with home indicator */}
      <div className="h-[env(safe-area-inset-bottom)] bg-white" />
    </nav>
  );
}
