import * as React from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  React.useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-fresh-500 rounded-lg flex items-center justify-center">
              <Leaf className="w-3 h-3 md:w-5 md:h-5 text-white" />
            </div>
            <h1 className="text-lg md:text-xl font-bold text-fresh-600">
              FreshMart
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-fresh-100 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
            <span className="text-3xl md:text-4xl">🛒</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-fresh-700 mb-3 md:mb-4">
            404
          </h1>
          <h2 className="text-lg md:text-xl font-semibold text-fresh-600 mb-3 md:mb-4 px-4">
            Oops! Page not found
          </h2>
          <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 px-4">
            The page you're looking for seems to have gone grocery shopping.
            Let's get you back to fresh deals!
          </p>
          <Link to="/">
            <Button className="bg-fresh-500 hover:bg-fresh-600 h-12 px-6 text-base font-medium">
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
