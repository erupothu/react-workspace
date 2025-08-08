import * as React from "react";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PlaceholderProps {
  title: string;
  description: string;
  icon: string;
}

export default function Placeholder({
  title,
  description,
  icon,
}: PlaceholderProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="p-2 md:px-3">
                  <ArrowLeft className="w-4 h-4 mr-0 md:mr-2" />
                  <span className="hidden md:inline">Back</span>
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
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-fresh-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
            <span className="text-3xl md:text-4xl">{icon}</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-fresh-700 mb-3 md:mb-4 px-4">
            {title}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 px-4">
            {description}
          </p>
          <p className="text-xs md:text-sm text-fresh-600 mb-4 md:mb-6 px-4">
            Continue prompting to help us build this page with the specific
            content and functionality you need.
          </p>
          <Link to="/">
            <Button className="bg-fresh-500 hover:bg-fresh-600 h-12 px-6 text-base font-medium">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
