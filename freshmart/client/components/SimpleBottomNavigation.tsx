import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Grid3x3,
  ShoppingBasket,
  Wallet,
  MoreHorizontal,
} from "lucide-react";

const navigationItems = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "Categories",
    href: "/categories",
    icon: Grid3x3,
  },
  {
    name: "Basket",
    href: "/basket",
    icon: ShoppingBasket,
  },
  {
    name: "Wallet",
    href: "/wallet",
    icon: Wallet,
  },
  {
    name: "More",
    href: "/more",
    icon: MoreHorizontal,
  },
];

export default function SimpleBottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-5 h-16">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          // Use simple pathname check instead of useLocation
          const isActive = window.location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive
                  ? "text-fresh-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
