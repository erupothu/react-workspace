import React from "react";
import { Chrome, Github, Apple, Mail, Shield } from "lucide-react";

interface OAuthProviderIconProps {
  provider: string;
  size?: number;
  className?: string;
}

export function OAuthProviderIcon({ 
  provider, 
  size = 16, 
  className = "" 
}: OAuthProviderIconProps) {
  const iconProps = {
    width: size,
    height: size,
    className
  };

  switch (provider) {
    case "google":
      return <Chrome {...iconProps} />;
    case "github":
      return <Github {...iconProps} />;
    case "apple":
      return <Apple {...iconProps} />;
    case "microsoft":
      return <Mail {...iconProps} />;
    default:
      return <Shield {...iconProps} />;
  }
}

export default OAuthProviderIcon;
