import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Leaf, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [credentials, setCredentials] = React.useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Simulate admin authentication
      if (
        credentials.email === "admin@freshmart.com" &&
        credentials.password === "admin123"
      ) {
        // Store admin session
        localStorage.setItem(
          "admin_session",
          JSON.stringify({
            user: { email: credentials.email, role: "admin" },
            token: "admin_token_" + Date.now(),
            loginTime: new Date().toISOString(),
          }),
        );

        navigate("/admin/dashboard");
      } else {
        setError("Invalid credentials. Use admin@freshmart.com / admin123");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fresh-50 to-fresh-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-fresh-200 shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-fresh-500 rounded-full flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-fresh-700">
              Admin Portal
            </CardTitle>
            <p className="text-muted-foreground mt-2">
              Sign in to manage FreshMart
            </p>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@freshmart.com"
                value={credentials.email}
                onChange={(e) =>
                  setCredentials((prev) => ({ ...prev, email: e.target.value }))
                }
                className="border-fresh-200 focus:border-fresh-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  className="border-fresh-200 focus:border-fresh-400 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-600">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full bg-fresh-600 hover:bg-fresh-700 h-12"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <div className="text-sm text-muted-foreground">
              Demo Credentials:
            </div>
            <div className="text-xs text-fresh-600 mt-1">
              Email: admin@freshmart.com
              <br />
              Password: admin123
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-fresh-600 hover:text-fresh-700 flex items-center justify-center space-x-2"
            >
              <Leaf className="w-4 h-4" />
              <span>Back to FreshMart</span>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
