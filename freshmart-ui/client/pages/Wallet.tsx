import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Leaf,
  ArrowLeft,
  Wallet,
  CreditCard,
  Gift,
  History,
  Plus,
} from "lucide-react";
import { Link } from "react-router-dom";
import BottomNavigation from "@/components/BottomNavigation";

export default function WalletPage() {
  const walletBalance = 250;

  const transactions = [
    {
      id: 1,
      type: "credit",
      amount: 100,
      description: "Wallet top-up",
      date: "Today, 2:30 PM",
    },
    {
      id: 2,
      type: "debit",
      amount: 65,
      description: "Order #FRM123",
      date: "Yesterday, 6:45 PM",
    },
    {
      id: 3,
      type: "credit",
      amount: 50,
      description: "Referral bonus",
      date: "2 days ago",
    },
    {
      id: 4,
      type: "debit",
      amount: 45,
      description: "Order #FRM122",
      date: "3 days ago",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link to="/" className="md:hidden">
                <Button variant="ghost" size="sm" className="p-2">
                  <ArrowLeft className="w-4 h-4" />
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
            <h2 className="text-lg font-semibold text-fresh-700">My Wallet</h2>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Wallet Balance Card */}
        <Card className="bg-gradient-to-r from-fresh-500 to-fresh-600 text-white mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-fresh-100 mb-2">Available Balance</p>
                <h3 className="text-3xl font-bold">₹{walletBalance}</h3>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Wallet className="w-8 h-8" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="border-fresh-200 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-fresh-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus className="w-6 h-6 text-fresh-600" />
              </div>
              <h4 className="font-medium text-fresh-700 mb-1">Add Money</h4>
              <p className="text-xs text-muted-foreground">
                Top up your wallet
              </p>
            </CardContent>
          </Card>

          <Card className="border-fresh-200 hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-fresh-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Gift className="w-6 h-6 text-fresh-600" />
              </div>
              <h4 className="font-medium text-fresh-700 mb-1">Rewards</h4>
              <p className="text-xs text-muted-foreground">Earn cashback</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Money Section */}
        <Card className="border-fresh-200 mb-6">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-fresh-700 mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Add Money to Wallet
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Enter Amount
                </label>
                <Input
                  type="number"
                  placeholder="₹100"
                  className="border-fresh-200 focus:border-fresh-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[100, 200, 500].map((amount) => (
                  <Button
                    key={amount}
                    variant="outline"
                    className="border-fresh-300 text-fresh-600 hover:bg-fresh-50"
                  >
                    ₹{amount}
                  </Button>
                ))}
              </div>

              <Button className="w-full bg-fresh-500 hover:bg-fresh-600 h-12">
                Add Money
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="border-fresh-200">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-fresh-700 mb-4 flex items-center">
              <History className="w-5 h-5 mr-2" />
              Recent Transactions
            </h3>

            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "credit"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {transaction.type === "credit" ? "+" : "-"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.date}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`font-semibold ${
                      transaction.type === "credit"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "credit" ? "+" : "-"}₹
                    {transaction.amount}
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              className="w-full mt-4 border-fresh-300 text-fresh-600"
            >
              View All Transactions
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}
