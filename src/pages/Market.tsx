import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Minus, MapPin, Calendar, IndianRupee, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Market = () => {
  const [selectedCrop, setSelectedCrop] = useState("wheat");
  const [selectedState, setSelectedState] = useState("all");

  // Sample market data
  const marketData = {
    wheat: [
      { mandi: "Indore", state: "Madhya Pradesh", price: 2250, change: 50, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Bhopal", state: "Madhya Pradesh", price: 2200, change: -30, trend: "down", lastUpdate: "1 hour ago" },
      { mandi: "Amritsar", state: "Punjab", price: 2350, change: 0, trend: "stable", lastUpdate: "3 hours ago" },
      { mandi: "Ludhiana", state: "Punjab", price: 2320, change: 20, trend: "up", lastUpdate: "30 mins ago" },
      { mandi: "Nashik", state: "Maharashtra", price: 2180, change: -10, trend: "down", lastUpdate: "1 hour ago" },
    ],
    rice: [
      { mandi: "Vijayawada", state: "Andhra Pradesh", price: 3200, change: 100, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Kolkata", state: "West Bengal", price: 3150, change: 50, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Cuttack", state: "Odisha", price: 3000, change: -20, trend: "down", lastUpdate: "30 mins ago" },
      { mandi: "Patna", state: "Bihar", price: 2950, change: 0, trend: "stable", lastUpdate: "1 hour ago" },
    ],
    cotton: [
      { mandi: "Ahmedabad", state: "Gujarat", price: 7500, change: 200, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Nagpur", state: "Maharashtra", price: 7300, change: -50, trend: "down", lastUpdate: "1 hour ago" },
      { mandi: "Warangal", state: "Telangana", price: 7400, change: 100, trend: "up", lastUpdate: "3 hours ago" },
    ],
    soybean: [
      { mandi: "Indore", state: "Madhya Pradesh", price: 4500, change: 150, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Latur", state: "Maharashtra", price: 4450, change: 0, trend: "stable", lastUpdate: "2 hours ago" },
      { mandi: "Rajkot", state: "Gujarat", price: 4400, change: -30, trend: "down", lastUpdate: "30 mins ago" },
    ],
  };

  const crops = [
    { value: "wheat", label: "Wheat (गेहूं)" },
    { value: "rice", label: "Rice (चावल)" },
    { value: "cotton", label: "Cotton (कपास)" },
    { value: "soybean", label: "Soybean (सोयाबीन)" },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-600";
  };

  const currentData = marketData[selectedCrop as keyof typeof marketData] || [];
  const filteredData = selectedState === "all" 
    ? currentData 
    : currentData.filter(item => item.state === selectedState);

  const bestPrice = Math.max(...filteredData.map(item => item.price));
  const avgPrice = Math.round(filteredData.reduce((sum, item) => sum + item.price, 0) / filteredData.length);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Live Market Prices
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get real-time prices from different mandis across India. Make informed decisions and maximize your profits.
            </p>
          </div>

          {/* Filters and Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Select Crop</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedCrop} onValueChange={setSelectedCrop}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {crops.map(crop => (
                      <SelectItem key={crop.value} value={crop.value}>
                        {crop.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Filter by State</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                    <SelectItem value="Punjab">Punjab</SelectItem>
                    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="Gujarat">Gujarat</SelectItem>
                    <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                    <SelectItem value="West Bengal">West Bengal</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-green-700">Best Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-700">{bestPrice}</span>
                  <span className="text-sm text-green-600">/quintal</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Average Price</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{avgPrice}</span>
                  <span className="text-sm text-muted-foreground">/quintal</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Market Price Table */}
          <Card>
            <CardHeader>
              <CardTitle>Mandi Prices</CardTitle>
              <CardDescription>
                Compare prices across different mandis to get the best deal for your crop
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3">Mandi</th>
                      <th className="text-left p-3">State</th>
                      <th className="text-left p-3">Price (₹/quintal)</th>
                      <th className="text-left p-3">Change</th>
                      <th className="text-left p-3">Trend</th>
                      <th className="text-left p-3">Last Update</th>
                      <th className="text-left p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{item.mandi}</span>
                          </div>
                        </td>
                        <td className="p-3 text-muted-foreground">{item.state}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-1">
                            <IndianRupee className="h-4 w-4" />
                            <span className="font-bold text-lg">{item.price}</span>
                            {item.price === bestPrice && (
                              <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                Best
                              </span>
                            )}
                          </div>
                        </td>
                        <td className={`p-3 ${getChangeColor(item.change)}`}>
                          <div className="flex items-center gap-1">
                            {item.change > 0 && <ArrowUpRight className="h-4 w-4" />}
                            {item.change < 0 && <ArrowDownRight className="h-4 w-4" />}
                            {item.change !== 0 ? `₹${Math.abs(item.change)}` : "-"}
                          </div>
                        </td>
                        <td className="p-3">{getTrendIcon(item.trend)}</td>
                        <td className="p-3 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {item.lastUpdate}
                          </div>
                        </td>
                        <td className="p-3">
                          <Button size="sm" variant="outline">
                            Contact Mandi
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Price Trend Analysis */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Price Intelligence</CardTitle>
              <CardDescription>
                Make smarter selling decisions with our market insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Best Time to Sell
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Prices are trending upward in Punjab mandis. Consider selling in Amritsar for the best rates.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Nearest High-Price Mandi
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Based on your location, Indore mandi offers competitive prices with lower transportation costs.
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-accent" />
                    Price Forecast
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Expected to remain stable for the next week. Good time to plan your harvest and sale.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Market;