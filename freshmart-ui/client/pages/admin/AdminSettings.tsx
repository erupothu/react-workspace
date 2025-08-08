import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Settings,
  Store,
  CreditCard,
  Truck,
  Mail,
  Bell,
  Shield,
  Users,
  Database,
  Palette,
  Globe,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  Percent,
  Save,
  Upload,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Info,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface StoreSettings {
  name: string;
  description: string;
  logo: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    supportEmail: string;
    website: string;
  };
  businessHours: {
    monday: { open: string; close: string; closed: boolean };
    tuesday: { open: string; close: string; closed: boolean };
    wednesday: { open: string; close: string; closed: boolean };
    thursday: { open: string; close: string; closed: boolean };
    friday: { open: string; close: string; closed: boolean };
    saturday: { open: string; close: string; closed: boolean };
    sunday: { open: string; close: string; closed: boolean };
  };
  currency: string;
  timezone: string;
  language: string;
}

interface PaymentSettings {
  cashOnDelivery: boolean;
  cards: boolean;
  upi: boolean;
  wallets: boolean;
  netBanking: boolean;
  paymentGateway: string;
  minimumOrderAmount: number;
  maximumOrderAmount: number;
  processingFee: number;
  refundPolicy: string;
}

interface DeliverySettings {
  freeDeliveryThreshold: number;
  deliveryFee: number;
  expressDeliveryFee: number;
  deliveryRadius: number;
  estimatedDeliveryTime: string;
  expressDeliveryTime: string;
  deliverySlots: string[];
  packagingFee: number;
  deliveryInstructions: string;
}

interface NotificationSettings {
  emailNotifications: {
    newOrders: boolean;
    lowStock: boolean;
    customerSignups: boolean;
    dailyReports: boolean;
    weeklyReports: boolean;
    monthlyReports: boolean;
  };
  smsNotifications: {
    newOrders: boolean;
    urgentAlerts: boolean;
  };
  pushNotifications: {
    newOrders: boolean;
    lowStock: boolean;
    systemUpdates: boolean;
  };
  notificationRecipients: string[];
}

interface SecuritySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
  };
  apiKeyRotation: number;
  lastBackup: string;
  backupFrequency: string;
}

interface TaxSettings {
  gstEnabled: boolean;
  gstNumber: string;
  defaultTaxRate: number;
  taxIncluded: boolean;
  taxCategories: Array<{
    name: string;
    rate: number;
    products: string[];
  }>;
}

export default function AdminSettings() {
  const [activeTab, setActiveTab] = React.useState("store");
  const [saveStatus, setSaveStatus] = React.useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");

  const [storeSettings, setStoreSettings] = React.useState<StoreSettings>({
    name: "FreshMart",
    description:
      "Your trusted partner for fresh groceries and daily essentials delivered to your doorstep.",
    logo: "/logo.png",
    address: {
      street: "123 Fresh Market Street",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      country: "India",
    },
    contact: {
      phone: "+91 80 1234 5678",
      email: "contact@freshmart.com",
      supportEmail: "support@freshmart.com",
      website: "https://freshmart.com",
    },
    businessHours: {
      monday: { open: "06:00", close: "22:00", closed: false },
      tuesday: { open: "06:00", close: "22:00", closed: false },
      wednesday: { open: "06:00", close: "22:00", closed: false },
      thursday: { open: "06:00", close: "22:00", closed: false },
      friday: { open: "06:00", close: "22:00", closed: false },
      saturday: { open: "06:00", close: "22:00", closed: false },
      sunday: { open: "08:00", close: "20:00", closed: false },
    },
    currency: "INR",
    timezone: "Asia/Kolkata",
    language: "en",
  });

  const [paymentSettings, setPaymentSettings] = React.useState<PaymentSettings>(
    {
      cashOnDelivery: true,
      cards: true,
      upi: true,
      wallets: true,
      netBanking: true,
      paymentGateway: "razorpay",
      minimumOrderAmount: 50,
      maximumOrderAmount: 10000,
      processingFee: 2,
      refundPolicy: "Refunds will be processed within 3-5 business days.",
    },
  );

  const [deliverySettings, setDeliverySettings] =
    React.useState<DeliverySettings>({
      freeDeliveryThreshold: 299,
      deliveryFee: 40,
      expressDeliveryFee: 80,
      deliveryRadius: 25,
      estimatedDeliveryTime: "2-4 hours",
      expressDeliveryTime: "30-60 minutes",
      deliverySlots: [
        "9:00 AM - 12:00 PM",
        "12:00 PM - 3:00 PM",
        "3:00 PM - 6:00 PM",
        "6:00 PM - 9:00 PM",
      ],
      packagingFee: 5,
      deliveryInstructions:
        "Please ensure fresh items are kept refrigerated during delivery.",
    });

  const [notificationSettings, setNotificationSettings] =
    React.useState<NotificationSettings>({
      emailNotifications: {
        newOrders: true,
        lowStock: true,
        customerSignups: true,
        dailyReports: true,
        weeklyReports: true,
        monthlyReports: false,
      },
      smsNotifications: {
        newOrders: true,
        urgentAlerts: true,
      },
      pushNotifications: {
        newOrders: true,
        lowStock: true,
        systemUpdates: false,
      },
      notificationRecipients: ["admin@freshmart.com", "manager@freshmart.com"],
    });

  const [securitySettings, setSecuritySettings] =
    React.useState<SecuritySettings>({
      twoFactorAuth: true,
      sessionTimeout: 60,
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
      },
      apiKeyRotation: 90,
      lastBackup: new Date().toISOString(),
      backupFrequency: "daily",
    });

  const [taxSettings, setTaxSettings] = React.useState<TaxSettings>({
    gstEnabled: true,
    gstNumber: "29ABCDE1234F1Z5",
    defaultTaxRate: 5,
    taxIncluded: false,
    taxCategories: [
      { name: "Essential Items", rate: 0, products: ["rice", "wheat", "milk"] },
      {
        name: "Groceries",
        rate: 5,
        products: ["fruits", "vegetables", "dairy"],
      },
      {
        name: "Processed Foods",
        rate: 12,
        products: ["snacks", "beverages", "packaged"],
      },
      { name: "Luxury Items", rate: 18, products: ["imported", "premium"] },
    ],
  });

  const handleSave = async () => {
    setSaveStatus("saving");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      // Here you would typically save to your backend
      console.log("Saving settings:", {
        store: storeSettings,
        payment: paymentSettings,
        delivery: deliverySettings,
        notifications: notificationSettings,
        security: securitySettings,
        tax: taxSettings,
      });

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const exportSettings = () => {
    const settings = {
      store: storeSettings,
      payment: paymentSettings,
      delivery: deliverySettings,
      notifications: notificationSettings,
      security: securitySettings,
      tax: taxSettings,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(settings, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `freshmart-settings-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
            Admin Settings
          </h1>
          <p className="text-sm lg:text-base text-gray-600">
            Configure your store settings and preferences
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={exportSettings}>
            <Download className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button
            size="sm"
            onClick={handleSave}
            className="bg-fresh-600 hover:bg-fresh-700"
            disabled={saveStatus === "saving"}
          >
            {saveStatus === "saving" ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            <span className="hidden sm:inline">
              {saveStatus === "saving" ? "Saving..." : "Save Changes"}
            </span>
          </Button>
        </div>
      </div>

      {/* Save Status */}
      {saveStatus === "saved" && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Settings saved successfully!
          </AlertDescription>
        </Alert>
      )}

      {saveStatus === "error" && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            Failed to save settings. Please try again.
          </AlertDescription>
        </Alert>
      )}

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="store" className="text-xs lg:text-sm">
            <Store className="w-4 h-4 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Store</span>
          </TabsTrigger>
          <TabsTrigger value="payment" className="text-xs lg:text-sm">
            <CreditCard className="w-4 h-4 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Payment</span>
          </TabsTrigger>
          <TabsTrigger value="delivery" className="text-xs lg:text-sm">
            <Truck className="w-4 h-4 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Delivery</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs lg:text-sm">
            <Bell className="w-4 h-4 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs lg:text-sm">
            <Shield className="w-4 h-4 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="tax" className="text-xs lg:text-sm">
            <Percent className="w-4 h-4 mr-1 lg:mr-2" />
            <span className="hidden sm:inline">Tax</span>
          </TabsTrigger>
        </TabsList>

        {/* Store Settings */}
        <TabsContent value="store" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Store className="w-5 h-5 mr-2" />
                Store Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    value={storeSettings.name}
                    onChange={(e) =>
                      setStoreSettings((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={storeSettings.currency}
                    onValueChange={(value) =>
                      setStoreSettings((prev) => ({ ...prev, currency: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Store Description</Label>
                <Textarea
                  id="description"
                  value={storeSettings.description}
                  onChange={(e) =>
                    setStoreSettings((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={storeSettings.contact.phone}
                    onChange={(e) =>
                      setStoreSettings((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, phone: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={storeSettings.contact.email}
                    onChange={(e) =>
                      setStoreSettings((prev) => ({
                        ...prev,
                        contact: { ...prev.contact, email: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Store Address
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="street">Street Address</Label>
                <Input
                  id="street"
                  value={storeSettings.address.street}
                  onChange={(e) =>
                    setStoreSettings((prev) => ({
                      ...prev,
                      address: { ...prev.address, street: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={storeSettings.address.city}
                    onChange={(e) =>
                      setStoreSettings((prev) => ({
                        ...prev,
                        address: { ...prev.address, city: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    value={storeSettings.address.state}
                    onChange={(e) =>
                      setStoreSettings((prev) => ({
                        ...prev,
                        address: { ...prev.address, state: e.target.value },
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={storeSettings.address.pincode}
                    onChange={(e) =>
                      setStoreSettings((prev) => ({
                        ...prev,
                        address: { ...prev.address, pincode: e.target.value },
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Business Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(storeSettings.businessHours).map(
                  ([day, hours]) => (
                    <div key={day} className="flex items-center space-x-4">
                      <div className="w-24">
                        <Label className="capitalize">{day}</Label>
                      </div>
                      <Switch
                        checked={!hours.closed}
                        onCheckedChange={(checked) =>
                          setStoreSettings((prev) => ({
                            ...prev,
                            businessHours: {
                              ...prev.businessHours,
                              [day]: { ...hours, closed: !checked },
                            },
                          }))
                        }
                      />
                      {!hours.closed && (
                        <>
                          <Input
                            type="time"
                            value={hours.open}
                            onChange={(e) =>
                              setStoreSettings((prev) => ({
                                ...prev,
                                businessHours: {
                                  ...prev.businessHours,
                                  [day]: { ...hours, open: e.target.value },
                                },
                              }))
                            }
                            className="w-32"
                          />
                          <span>to</span>
                          <Input
                            type="time"
                            value={hours.close}
                            onChange={(e) =>
                              setStoreSettings((prev) => ({
                                ...prev,
                                businessHours: {
                                  ...prev.businessHours,
                                  [day]: { ...hours, close: e.target.value },
                                },
                              }))
                            }
                            className="w-32"
                          />
                        </>
                      )}
                      {hours.closed && (
                        <span className="text-gray-500">Closed</span>
                      )}
                    </div>
                  ),
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cod">Cash on Delivery</Label>
                  <Switch
                    id="cod"
                    checked={paymentSettings.cashOnDelivery}
                    onCheckedChange={(checked) =>
                      setPaymentSettings((prev) => ({
                        ...prev,
                        cashOnDelivery: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="cards">Credit/Debit Cards</Label>
                  <Switch
                    id="cards"
                    checked={paymentSettings.cards}
                    onCheckedChange={(checked) =>
                      setPaymentSettings((prev) => ({
                        ...prev,
                        cards: checked,
                      }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="upi">UPI Payments</Label>
                  <Switch
                    id="upi"
                    checked={paymentSettings.upi}
                    onCheckedChange={(checked) =>
                      setPaymentSettings((prev) => ({ ...prev, upi: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="wallets">Digital Wallets</Label>
                  <Switch
                    id="wallets"
                    checked={paymentSettings.wallets}
                    onCheckedChange={(checked) =>
                      setPaymentSettings((prev) => ({
                        ...prev,
                        wallets: checked,
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Order Limits & Fees
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="minOrder">Minimum Order Amount (₹)</Label>
                  <Input
                    id="minOrder"
                    type="number"
                    value={paymentSettings.minimumOrderAmount}
                    onChange={(e) =>
                      setPaymentSettings((prev) => ({
                        ...prev,
                        minimumOrderAmount: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="maxOrder">Maximum Order Amount (₹)</Label>
                  <Input
                    id="maxOrder"
                    type="number"
                    value={paymentSettings.maximumOrderAmount}
                    onChange={(e) =>
                      setPaymentSettings((prev) => ({
                        ...prev,
                        maximumOrderAmount: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="processingFee">Processing Fee (%)</Label>
                <Input
                  id="processingFee"
                  type="number"
                  step="0.1"
                  value={paymentSettings.processingFee}
                  onChange={(e) =>
                    setPaymentSettings((prev) => ({
                      ...prev,
                      processingFee: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Delivery Settings */}
        <TabsContent value="delivery" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="w-5 h-5 mr-2" />
                Delivery Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="freeDelivery">
                    Free Delivery Threshold (₹)
                  </Label>
                  <Input
                    id="freeDelivery"
                    type="number"
                    value={deliverySettings.freeDeliveryThreshold}
                    onChange={(e) =>
                      setDeliverySettings((prev) => ({
                        ...prev,
                        freeDeliveryThreshold: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryFee">Standard Delivery Fee (₹)</Label>
                  <Input
                    id="deliveryFee"
                    type="number"
                    value={deliverySettings.deliveryFee}
                    onChange={(e) =>
                      setDeliverySettings((prev) => ({
                        ...prev,
                        deliveryFee: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="expressDeliveryFee">
                    Express Delivery Fee (₹)
                  </Label>
                  <Input
                    id="expressDeliveryFee"
                    type="number"
                    value={deliverySettings.expressDeliveryFee}
                    onChange={(e) =>
                      setDeliverySettings((prev) => ({
                        ...prev,
                        expressDeliveryFee: Number(e.target.value),
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="deliveryRadius">Delivery Radius (km)</Label>
                  <Input
                    id="deliveryRadius"
                    type="number"
                    value={deliverySettings.deliveryRadius}
                    onChange={(e) =>
                      setDeliverySettings((prev) => ({
                        ...prev,
                        deliveryRadius: Number(e.target.value),
                      }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Delivery Time Slots</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {deliverySettings.deliverySlots.map((slot, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Input value={slot} readOnly className="flex-1" />
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Slot
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="w-5 h-5 mr-2" />
                Email Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notificationSettings.emailNotifications).map(
                ([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label className="capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </Label>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          emailNotifications: {
                            ...prev.emailNotifications,
                            [key]: checked,
                          },
                        }))
                      }
                    />
                  </div>
                ),
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                SMS Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(notificationSettings.smsNotifications).map(
                ([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label className="capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </Label>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) =>
                        setNotificationSettings((prev) => ({
                          ...prev,
                          smsNotifications: {
                            ...prev.smsNotifications,
                            [key]: checked,
                          },
                        }))
                      }
                    />
                  </div>
                ),
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Security Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security to admin accounts
                  </p>
                </div>
                <Switch
                  checked={securitySettings.twoFactorAuth}
                  onCheckedChange={(checked) =>
                    setSecuritySettings((prev) => ({
                      ...prev,
                      twoFactorAuth: checked,
                    }))
                  }
                />
              </div>

              <div>
                <Label htmlFor="sessionTimeout">
                  Session Timeout (minutes)
                </Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) =>
                    setSecuritySettings((prev) => ({
                      ...prev,
                      sessionTimeout: Number(e.target.value),
                    }))
                  }
                />
              </div>

              <div>
                <Label>Password Policy</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">
                      Minimum length:{" "}
                      {securitySettings.passwordPolicy.minLength} characters
                    </span>
                    <Input
                      type="number"
                      value={securitySettings.passwordPolicy.minLength}
                      onChange={(e) =>
                        setSecuritySettings((prev) => ({
                          ...prev,
                          passwordPolicy: {
                            ...prev.passwordPolicy,
                            minLength: Number(e.target.value),
                          },
                        }))
                      }
                      className="w-20"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Require uppercase letters</span>
                    <Switch
                      checked={securitySettings.passwordPolicy.requireUppercase}
                      onCheckedChange={(checked) =>
                        setSecuritySettings((prev) => ({
                          ...prev,
                          passwordPolicy: {
                            ...prev.passwordPolicy,
                            requireUppercase: checked,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Require numbers</span>
                    <Switch
                      checked={securitySettings.passwordPolicy.requireNumbers}
                      onCheckedChange={(checked) =>
                        setSecuritySettings((prev) => ({
                          ...prev,
                          passwordPolicy: {
                            ...prev.passwordPolicy,
                            requireNumbers: checked,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Backup & Recovery
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Last Backup</Label>
                <p className="text-sm text-gray-600">
                  {new Date(securitySettings.lastBackup).toLocaleString()}
                </p>
              </div>

              <div>
                <Label>Backup Frequency</Label>
                <Select
                  value={securitySettings.backupFrequency}
                  onValueChange={(value) =>
                    setSecuritySettings((prev) => ({
                      ...prev,
                      backupFrequency: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download Backup
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Restore Backup
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tax Settings */}
        <TabsContent value="tax" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Percent className="w-5 h-5 mr-2" />
                Tax Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable GST</Label>
                  <p className="text-sm text-gray-500">
                    Enable Goods and Services Tax calculation
                  </p>
                </div>
                <Switch
                  checked={taxSettings.gstEnabled}
                  onCheckedChange={(checked) =>
                    setTaxSettings((prev) => ({ ...prev, gstEnabled: checked }))
                  }
                />
              </div>

              {taxSettings.gstEnabled && (
                <>
                  <div>
                    <Label htmlFor="gstNumber">GST Number</Label>
                    <Input
                      id="gstNumber"
                      value={taxSettings.gstNumber}
                      onChange={(e) =>
                        setTaxSettings((prev) => ({
                          ...prev,
                          gstNumber: e.target.value,
                        }))
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="defaultTaxRate">Default Tax Rate (%)</Label>
                    <Input
                      id="defaultTaxRate"
                      type="number"
                      step="0.1"
                      value={taxSettings.defaultTaxRate}
                      onChange={(e) =>
                        setTaxSettings((prev) => ({
                          ...prev,
                          defaultTaxRate: Number(e.target.value),
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Tax Included in Price</Label>
                    <Switch
                      checked={taxSettings.taxIncluded}
                      onCheckedChange={(checked) =>
                        setTaxSettings((prev) => ({
                          ...prev,
                          taxIncluded: checked,
                        }))
                      }
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {taxSettings.gstEnabled && (
            <Card>
              <CardHeader>
                <CardTitle>Tax Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {taxSettings.taxCategories.map((category, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{category.name}</h4>
                        <Badge>{category.rate}% Tax</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Products: {category.products.join(", ")}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
