import "./global.css";
import React, { createContext, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { registerServiceWorker } from "./lib/pwa";
import PWAInstall from "./components/PWAInstall";
import PWAUpdateNotification from "./components/PWAUpdateNotification";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Basket from "./pages/Basket";
import WalletPage from "./pages/Wallet";
import More from "./pages/More";
import Placeholder from "./pages/Placeholder";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProductManagement from "./pages/admin/ProductManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import MapsView from "./pages/admin/MapsView";
import CustomerManagement from "./pages/admin/CustomerManagement";
import AdminSettings from "./pages/admin/AdminSettings";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import ProductDetail from "./pages/ProductDetail";
import APITest from "./pages/APITest";
import ImageUploadTest from "./pages/ImageUploadTest";
import ImportExportTest from "./pages/ImportExportTest";
import MapsTest from "./pages/MapsTest";
import { Category, Product } from "@shared/api";
import api from "./lib/api";
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();
export const MyContext = createContext(null);
const App = () => {
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const clientId = '962116096492-bp5679jabt5kl5m25h64usdimnv88l8n.apps.googleusercontent.com';
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <BrowserRouter>
        <MyContext.Provider value={{data, setData}}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/categories/:categoryId" element={<Categories />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product" element={<ProductDetail />} />
            <Route path="/basket" element={<Basket />} />
            <Route path="/wallet" element={<WalletPage />} />
            <Route path="/more" element={<More />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminDashboard />}>
              <Route index element={<ProductManagement />} />
            </Route>
            <Route path="/admin/categories" element={<AdminDashboard />}>
              <Route index element={<CategoryManagement />} />
            </Route>
            <Route path="/admin/orders" element={<AdminDashboard />}>
              <Route index element={<OrderManagement />} />
            </Route>
            <Route path="/admin/maps" element={<AdminDashboard />}>
              <Route index element={<MapsView />} />
            </Route>
            <Route path="/admin/customers" element={<AdminDashboard />}>
              <Route index element={<CustomerManagement />} />
            </Route>
            <Route path="/admin/analytics" element={<AdminDashboard />}>
              <Route
                index
                element={
                  <Placeholder
                    title="Analytics Coming Soon"
                    description="View sales reports, performance metrics and insights."
                    icon="📊"
                  />
                }
              />
            </Route>
            <Route path="/admin/settings" element={<AdminDashboard />}>
              <Route index element={<AdminSettings />} />
            </Route>

            {/* API Test Route */}
            <Route path="/api-test" element={<APITest />} />

            {/* Image Upload Test Route */}
            <Route path="/image-upload-test" element={<ImageUploadTest />} />

            {/* Import Export Test Route */}
            <Route path="/import-export-test" element={<ImportExportTest />} />

            {/* Maps Test Route */}
            <Route path="/maps-test" element={<MapsTest />} />

            {/* Placeholder routes */}
            <Route
              path="/about"
              element={
                <Placeholder
                  title="About Us Coming Soon"
                  description="Learn more about FreshMart and our mission to deliver fresh groceries."
                  icon="ℹ️"
                />
              }
            />
            <Route
              path="/contact"
              element={
                <Placeholder
                  title="Contact Us Coming Soon"
                  description="Get in touch with our customer support team."
                  icon="📞"
                />
              }
            />
            <Route
              path="/help"
              element={
                <Placeholder
                  title="Help & Support Coming Soon"
                  description="Find answers to frequently asked questions and get help."
                  icon="❓"
                />
              }
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
          </MyContext.Provider>

          {/* PWA Components */}
          <PWAInstall />
          <PWAUpdateNotification />
        </BrowserRouter>
      </AuthProvider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
