import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import BottomNavigation from "@/components/BottomNavigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  User,
  Phone,
  Mail,
  Shield,
  Edit,
  Save,
  ArrowLeft,
  MapPin,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editedName, setEditedName] = React.useState(user?.name || "");
  const [editedEmail, setEditedEmail] = React.useState(user?.email || "");

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please sign in</h2>
          <p className="text-muted-foreground mb-4">
            You need to be logged in to view your profile
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleSave = () => {
    updateUser({
      name: editedName.trim(),
      email: editedEmail.trim() || undefined,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(user.name);
    setEditedEmail(user.email || "");
    setIsEditing(false);
  };

  const memberSince = new Date(
    parseInt(user.id.split("_")[1]),
  ).toLocaleDateString();

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
            <h1 className="text-lg font-semibold text-fresh-700">My Profile</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="space-y-6">
          {/* Profile Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-fresh-500 text-white text-xl">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold text-fresh-700">
                      {user.name}
                    </h2>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge
                        variant="outline"
                        className="border-green-200 text-green-700"
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Member since {memberSince}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="border-fresh-300 text-fresh-600"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              </div>
            </CardHeader>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5 text-fresh-600" />
                <span>Contact Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span>{user.name}</span>
                  </div>
                )}
              </div>

              {user.mobile && (
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>+91 {user.mobile}</span>
                    <Badge
                      variant="outline"
                      className="border-green-200 text-green-700 ml-auto"
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Mobile number cannot be changed for security reasons
                  </p>
                </div>
              )}

              {user.authProvider && user.authProvider !== "mobile" && (
                <div className="space-y-2">
                  <Label>Authentication Method</Label>
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <Shield className="w-4 h-4 text-muted-foreground" />
                    <span className="capitalize">
                      Signed in with {user.authProvider}
                    </span>
                    <Badge
                      variant="outline"
                      className="border-blue-200 text-blue-700 ml-auto"
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      OAuth
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your account is secured with {user.authProvider} authentication
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                    placeholder="Enter your email address"
                  />
                ) : (
                  <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{user.email || "Not provided"}</span>
                  </div>
                )}
              </div>

              {isEditing && (
                <div className="flex space-x-2 pt-4">
                  <Button
                    onClick={handleSave}
                    className="bg-fresh-500 hover:bg-fresh-600"
                    disabled={!editedName.trim()}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/orders">
                <Button variant="outline" className="w-full justify-start h-12">
                  <Calendar className="w-4 h-4 mr-3" />
                  View Order History
                </Button>
              </Link>

              <Link to="/addresses">
                <Button variant="outline" className="w-full justify-start h-12">
                  <MapPin className="w-4 h-4 mr-3" />
                  Manage Addresses
                </Button>
              </Link>

              <Separator />

              <Button
                variant="outline"
                className="w-full justify-start h-12 text-destructive border-destructive/20 hover:bg-destructive/5"
                onClick={logout}
              >
                <User className="w-4 h-4 mr-3" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />

      {/* Bottom padding for mobile navigation */}
      <div className="h-16 md:hidden" />
    </div>
  );
}
