import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  User,
  LogOut,
  Settings,
  ShoppingBag,
  Heart,
  MapPin,
  Phone,
  Shield,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface UserDropdownProps {
  className?: string;
}

export function UserDropdown({ className }: UserDropdownProps) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "flex items-center space-x-2 h-auto py-2 px-3 hover:bg-fresh-50",
            className,
          )}
        >
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-fresh-500 text-white text-sm">
              {user.name}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:flex flex-col items-start">
            <div className="text-sm font-medium text-fresh-700 leading-none">
              {user.name}
            </div>
            <div className="text-xs text-muted-foreground leading-none mt-1">
              {user.mobile ? `+91 ${user.mobile}` : user.email || "OAuth User"}
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-64 p-0" align="end" sideOffset={8}>
        {/* User Info Header */}
        <div className="px-4 py-3 border-b bg-fresh-50">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-fresh-500 text-white">
                {user.name}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-fresh-700 truncate">
                {user.name}
              </div>
              <div className="flex items-center space-x-2 mt-1">
                <div className="text-sm text-muted-foreground">
                  {user.mobile ? `+91 ${user.mobile}` : user.email || "OAuth User"}
                </div>
                {user.isVerified && (
                  <Badge
                    variant="outline"
                    className="text-xs border-green-200 text-green-700"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          <DropdownMenuItem asChild>
            <Link
              to="/profile"
              className="flex items-center space-x-3 px-4 py-2 cursor-pointer"
            >
              <User className="w-4 h-4 text-muted-foreground" />
              <span>My Profile</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              to="/orders"
              className="flex items-center space-x-3 px-4 py-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-muted-foreground" />
              <span>My Orders</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              to="/favorites"
              className="flex items-center space-x-3 px-4 py-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-muted-foreground" />
              <span>Favorites</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              to="/addresses"
              className="flex items-center space-x-3 px-4 py-2 cursor-pointer"
            >
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>Saved Addresses</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild>
            <Link
              to="/settings"
              className="flex items-center space-x-3 px-4 py-2 cursor-pointer"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span>Settings</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              to="/help"
              className="flex items-center space-x-3 px-4 py-2 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>Help & Support</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-2 cursor-pointer text-destructive focus:text-destructive"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;
