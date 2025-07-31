import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Smartphone,
  Shield,
  CheckCircle,
  ArrowLeft,
  Loader2,
  User,
  UserPlus,
  Mail,
  Chrome,
  Github,
  Apple,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

type AuthStep = "mobile" | "otp" | "profile";
type AuthMode = "signin" | "register";

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [authStep, setAuthStep] = useState<AuthStep>("mobile");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setAuthStep("mobile");
      setMobileNumber("");
      setOtp("");
      setName("");
      setEmail("");
      setError("");
      setOtpSent(false);
      setCountdown(0);
    }
  }, [isOpen]);

  const formatMobileNumber = (value: string) => {
    // Remove all non-digits
    const numbers = value.replace(/\D/g, "");

    // Limit to 10 digits
    if (numbers.length <= 10) {
      return numbers;
    }
    return numbers.slice(0, 10);
  };

  const validateMobileNumber = (mobile: string) => {
    return mobile.length === 10 && /^[6-9]\d{9}$/.test(mobile);
  };

  const validateOTP = (otpValue: string) => {
    return otpValue.length === 6 && /^\d{6}$/.test(otpValue);
  };

  const sendOTP = async () => {
    if (!validateMobileNumber(mobileNumber)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call to send OTP
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In real implementation, make API call here
      console.log(`Sending OTP to ${mobileNumber}`);

      setOtpSent(true);
      setAuthStep("otp");
      setCountdown(60); // 60 seconds countdown
    } catch (error) {
      setError("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!validateOTP(otp)) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call to verify OTP
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In real implementation, make API call here
      console.log(`Verifying OTP ${otp} for ${mobileNumber}`);

      // Mock response - check if user exists
      const userExists = Math.random() > 0.5; // 50% chance user exists

      if (authMode === "signin" && !userExists) {
        setError("Account not found. Please register first.");
        setAuthMode("register");
        return;
      }

      if (authMode === "register" && userExists) {
        setError("Account already exists. Please sign in.");
        setAuthMode("signin");
        return;
      }

      if (authMode === "register" && !userExists) {
        // New user - go to profile step
        setAuthStep("profile");
      } else {
        // Existing user - sign in directly
        const userData = {
          id: "user_" + Date.now(),
          mobile: mobileNumber,
          name: authMode === "register" ? name : "John Doe",
          email: authMode === "register" ? email : "john@example.com",
          isVerified: true,
        };

        onAuthSuccess(userData);
        onClose();
      }
    } catch (error) {
      setError("Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const completeRegistration = async () => {
    if (!name.trim()) {
      setError("Please enter your name");
      return;
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call to complete registration
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const userData = {
        id: "user_" + Date.now(),
        mobile: mobileNumber,
        name: name.trim(),
        email: email.trim() || null,
        isVerified: true,
      };

      onAuthSuccess(userData);
      onClose();
    } catch (error) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (countdown > 0) return;

    setCountdown(60);
    await sendOTP();
  };

  const goBack = () => {
    if (authStep === "otp") {
      setAuthStep("mobile");
      setOtp("");
      setOtpSent(false);
    } else if (authStep === "profile") {
      setAuthStep("otp");
    }
    setError("");
  };

  // OAuth authentication
  const handleOAuthLogin = async (provider: string) => {
    setIsLoading(true);
    setError("");

    try {
      // Simulate OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In real implementation, this would redirect to OAuth provider
      // and handle the callback with actual user data
      const mockUserData = {
        id: `${provider}_user_${Date.now()}`,
        name: getProviderMockData(provider).name,
        email: getProviderMockData(provider).email,
        mobile: "", // OAuth users might not have mobile initially
        isVerified: true,
        authProvider: provider,
        avatar: getProviderMockData(provider).avatar,
      };

      console.log(`OAuth ${provider} login successful:`, mockUserData);
      onAuthSuccess(mockUserData);
      onClose();
    } catch (error) {
      setError(`${provider} authentication failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const getProviderMockData = (provider: string) => {
    const mockData = {
      google: {
        name: "John Doe",
        email: "john.doe@gmail.com",
        avatar: "https://lh3.googleusercontent.com/a/default-user",
      },
      github: {
        name: "John Developer",
        email: "john.dev@github.com",
        avatar: "https://github.com/identicons/johndeveloper.png",
      },
      apple: {
        name: "John Smith",
        email: "john.smith@icloud.com",
        avatar: null,
      },
      microsoft: {
        name: "John Business",
        email: "john.business@outlook.com",
        avatar: "https://graph.microsoft.com/v1.0/me/photo/$value",
      },
    };

    return mockData[provider as keyof typeof mockData] || mockData.google;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {authStep !== "mobile" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={goBack}
                className="p-1 h-auto mr-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            <div className="flex items-center space-x-2">
              <Smartphone className="w-5 h-5 text-fresh-600" />
              <span>
                {authStep === "mobile" && "Sign In or Register"}
                {authStep === "otp" && "Verify OTP"}
                {authStep === "profile" && "Complete Profile"}
              </span>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Mobile Number Step */}
          {authStep === "mobile" && (
            <>
              <Tabs
                value={authMode}
                onValueChange={(value) => setAuthMode(value as AuthMode)}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="signin"
                    className="flex items-center space-x-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="register"
                    className="flex items-center space-x-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Register</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-4">
                  <div className="text-center text-sm text-muted-foreground">
                    Sign in to your existing account
                  </div>
                </TabsContent>

                <TabsContent value="register" className="space-y-4">
                  <div className="text-center text-sm text-muted-foreground">
                    Create a new account to get started
                  </div>
                </TabsContent>
              </Tabs>

              {/* OAuth Login Options */}
              <div className="space-y-3">
                <div className="text-center text-sm font-medium text-gray-700">
                  Continue with
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleOAuthLogin("google")}
                    disabled={isLoading}
                    className="h-11 bg-white hover:bg-gray-50 border-gray-300"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Chrome className="w-4 h-4 mr-2" />
                    )}
                    Google
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleOAuthLogin("github")}
                    disabled={isLoading}
                    className="h-11 bg-gray-900 hover:bg-gray-800 text-white border-gray-900"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Github className="w-4 h-4 mr-2" />
                    )}
                    GitHub
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleOAuthLogin("apple")}
                    disabled={isLoading}
                    className="h-11 bg-black hover:bg-gray-900 text-white border-black"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Apple className="w-4 h-4 mr-2" />
                    )}
                    Apple
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => handleOAuthLogin("microsoft")}
                    disabled={isLoading}
                    className="h-11 bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Mail className="w-4 h-4 mr-2" />
                    )}
                    Microsoft
                  </Button>
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with mobile</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <div className="flex">
                  <div className="flex items-center px-3 bg-muted border border-r-0 rounded-l-md">
                    <span className="text-sm font-medium">+91</span>
                  </div>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    value={mobileNumber}
                    onChange={(e) =>
                      setMobileNumber(formatMobileNumber(e.target.value))
                    }
                    className="rounded-l-none"
                    maxLength={10}
                  />
                </div>
                {mobileNumber && !validateMobileNumber(mobileNumber) && (
                  <p className="text-xs text-destructive">
                    Please enter a valid 10-digit mobile number
                  </p>
                )}
              </div>

              <div className="bg-fresh-50 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Shield className="w-4 h-4 text-fresh-600" />
                  <span className="text-sm font-medium text-fresh-700">
                    Secure & Fast
                  </span>
                </div>
                <p className="text-xs text-fresh-600">
                  We'll send a 6-digit OTP to verify your mobile number. Your
                  data is secure and encrypted.
                </p>
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                  {error}
                </div>
              )}

              <Button
                onClick={sendOTP}
                disabled={!validateMobileNumber(mobileNumber) || isLoading}
                className="w-full bg-fresh-500 hover:bg-fresh-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )}
              </Button>
            </>
          )}

          {/* OTP Verification Step */}
          {authStep === "otp" && (
            <>
              <div className="text-center space-y-2">
                <div className="text-sm text-muted-foreground">OTP sent to</div>
                <div className="font-medium">+91 {mobileNumber}</div>
                <Badge
                  variant="outline"
                  className="text-fresh-600 border-fresh-200"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  OTP Sent
                </Badge>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otp">Enter 6-digit OTP</Label>
                <Input
                  id="otp"
                  type="number"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                  className="text-center text-lg tracking-wider"
                  maxLength={6}
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">
                  Didn't receive OTP?
                </span>
                <Button
                  variant="link"
                  onClick={resendOTP}
                  disabled={countdown > 0}
                  className="p-0 h-auto text-fresh-600"
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                </Button>
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                  {error}
                </div>
              )}

              <Button
                onClick={verifyOTP}
                disabled={!validateOTP(otp) || isLoading}
                className="w-full bg-fresh-500 hover:bg-fresh-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify OTP"
                )}
              </Button>
            </>
          )}

          {/* Profile Completion Step (for new users) */}
          {authStep === "profile" && (
            <>
              <div className="text-center space-y-2">
                <div className="text-sm text-muted-foreground">
                  Complete your profile
                </div>
                <div className="font-medium">+91 {mobileNumber}</div>
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-200"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                  {error}
                </div>
              )}

              <Button
                onClick={completeRegistration}
                disabled={!name.trim() || isLoading}
                className="w-full bg-fresh-500 hover:bg-fresh-600"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AuthModal;
