import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, Chrome, Github, Apple, Loader2 } from "lucide-react";

interface OAuthButtonsProps {
  onOAuthSuccess: (userData: any) => void;
  isLoading?: boolean;
  onLoading?: (loading: boolean) => void;
}

export function OAuthButtons({
  onOAuthSuccess,
  isLoading,
  onLoading,
}: OAuthButtonsProps) {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(
    null,
  );

  const handleOAuthLogin = async (provider: string) => {
    if (isLoading) return;

    setLoadingProvider(provider);
    onLoading?.(true);

    try {
      // Simulate OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // In a real implementation, this would redirect to OAuth provider
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
      onOAuthSuccess(mockUserData);
    } catch (error) {
      console.error(`OAuth ${provider} login failed:`, error);
      // In real implementation, show error toast/message
    } finally {
      setLoadingProvider(null);
      onLoading?.(false);
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

  const oauthProviders = [
    {
      id: "google",
      name: "Continue with Google",
      icon: Chrome,
      bgColor: "bg-white hover:bg-gray-50",
      textColor: "text-gray-700",
      borderColor: "border-gray-300",
    },
    {
      id: "github",
      name: "Continue with GitHub",
      icon: Github,
      bgColor: "bg-gray-900 hover:bg-gray-800",
      textColor: "text-white",
      borderColor: "border-gray-900",
    },
    {
      id: "apple",
      name: "Continue with Apple",
      icon: Apple,
      bgColor: "bg-black hover:bg-gray-900",
      textColor: "text-white",
      borderColor: "border-black",
    },
    {
      id: "microsoft",
      name: "Continue with Microsoft",
      icon: Mail,
      bgColor: "bg-blue-600 hover:bg-blue-700",
      textColor: "text-white",
      borderColor: "border-blue-600",
    },
  ];

  return (
    <div className="space-y-3">
      {oauthProviders.map((provider) => {
        const Icon = provider.icon;
        const isProviderLoading = loadingProvider === provider.id;

        return (
          <Button
            key={provider.id}
            variant="outline"
            onClick={() => handleOAuthLogin(provider.id)}
            disabled={isLoading}
            className={`w-full h-12 ${provider.bgColor} ${provider.textColor} ${provider.borderColor} border-2 transition-all duration-200`}
          >
            {isProviderLoading ? (
              <Loader2 className="w-5 h-5 mr-3 animate-spin" />
            ) : (
              <Icon className="w-5 h-5 mr-3" />
            )}
            <span className="font-medium">
              {isProviderLoading ? "Connecting..." : provider.name}
            </span>
          </Button>
        );
      })}
    </div>
  );
}

export default OAuthButtons;
