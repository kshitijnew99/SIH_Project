import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Droplets, Zap, IndianRupee, Calendar, FileText, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

const districtsByState: { [key: string]: string[] } = {
  "Maharashtra": [
    "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", 
    "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", 
    "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", 
    "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", 
    "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", 
    "Washim", "Yavatmal"
  ],
  "Karnataka": [
    "Bengaluru Urban", "Bengaluru Rural", "Belagavi", "Ballari", "Bidar", "Vijayapura",
    "Chamarajanagar", "Chikballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada",
    "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu",
    "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga",
    "Tumakuru", "Udupi", "Uttara Kannada", "Yadgir"
  ],
  // Add more states and their districts here as needed
};

const Land = () => {
  const [filterState, setFilterState] = useState("all");
  const [filterDistrict, setFilterDistrict] = useState("all");
  const [priceModel, setPriceModel] = useState("fixed"); // "fixed" or "percentage"
  const [priceRange, setPriceRange] = useState("all");
  const [percentageShare, setPercentageShare] = useState("all");

  // Sample land listings data
  const landListings = [
    {
      id: 1,
      title: "5 Acres Agricultural Land",
      location: "Nashik, Maharashtra",
      district: "Nashik",
      state: "Maharashtra",
      priceModel: "fixed",
      price: "₹15,000/acre/year",
      sharingModel: null,
      water: "Bore well + Canal",
      electricity: "Available",
      soil: "Black cotton soil",
      image: "/api/placeholder/400/300",
      area: "5 acres",
      suitable: "Cotton, Soybean, Wheat",
    },
    {
      id: 2,
      title: "10 Acres Fertile Land",
      location: "Sangli, Maharashtra",
      district: "Sangli",
      state: "Maharashtra",
      priceModel: "percentage",
      price: null,
      sharingModel: "60-40",
      water: "River adjacent",
      electricity: "3-phase connection",
      soil: "Alluvial soil",
      image: "/api/placeholder/400/300",
      area: "10 acres",
      suitable: "Sugarcane, Turmeric",
    },
    {
      id: 3,
      title: "3 Acres with Irrigation",
      location: "Pune, Maharashtra",
      district: "Pune",
      state: "Maharashtra",
      price: "₹25,000/acre/year",
      water: "Drip irrigation installed",
      electricity: "Available",
      soil: "Red soil",
      image: "/api/placeholder/400/300",
      area: "3 acres",
      suitable: "Vegetables, Flowers",
    },
    {
      id: 4,
      title: "7 Acres Prime Agricultural Land",
      location: "Amritsar, Punjab",
      district: "Amritsar",
      state: "Punjab",
      price: "₹30,000/acre/year",
      water: "Canal + Tube well",
      electricity: "Available 24/7",
      soil: "Loamy soil",
      image: "/api/placeholder/400/300",
      area: "7 acres",
      suitable: "Wheat, Rice, Vegetables",
    },
    {
      id: 5,
      title: "15 Acres Farm Land",
      location: "Indore, Madhya Pradesh",
      district: "Indore",
      state: "Madhya Pradesh",
      price: "₹18,000/acre/year",
      water: "Bore well",
      electricity: "Available",
      soil: "Black soil",
      image: "/api/placeholder/400/300",
      area: "15 acres",
      suitable: "Soybean, Wheat, Gram",
    },
    {
      id: 6,
      title: "4 Acres Organic Farm",
      location: "Coimbatore, Tamil Nadu",
      district: "Coimbatore",
      state: "Tamil Nadu",
      price: "₹22,000/acre/year",
      water: "Well + Rainwater harvesting",
      electricity: "Solar powered",
      soil: "Red loamy soil",
      image: "/api/placeholder/400/300",
      area: "4 acres",
      suitable: "Coconut, Banana, Vegetables",
    },
  ];

  const filteredListings = landListings.filter((land) => {
    // Filter by state
    if (filterState !== "all" && land.state !== filterState) return false;
    
    // Filter by district
    if (filterDistrict !== "all" && land.district !== filterDistrict) return false;
    
    // Filter by price model and range
    if (priceModel === "fixed") {
      if (priceRange !== "all") {
        const price = parseInt(land.price.replace(/[^0-9]/g, ""));
        const [min, max] = priceRange.split("-").map(num => parseInt(num));
        
        if (priceRange === "0-10000" && price > 10000) return false;
        if (priceRange === "10000-20000" && (price < 10000 || price > 20000)) return false;
        if (priceRange === "20000-30000" && (price < 20000 || price > 30000)) return false;
        if (priceRange === "30000+" && price < 30000) return false;
      }
    } else if (priceModel === "percentage") {
      if (percentageShare !== "all" && land.sharingModel !== percentageShare) return false;
    }
    
    return true;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Find Agricultural Land
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse verified agricultural land available for lease. Connect directly with landowners and generate legal agreements.
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Land
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select 
                    value={filterState} 
                    onValueChange={(value) => {
                      setFilterState(value);
                      setFilterDistrict("all");
                    }}
                  >
                    <SelectTrigger>
                      <MapPin className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">District</Label>
                  <Select 
                    value={filterDistrict} 
                    onValueChange={setFilterDistrict}
                    disabled={filterState === "all"}
                  >
                    <SelectTrigger>
                      <MapPin className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Districts</SelectItem>
                      {filterState !== "all" && districtsByState[filterState]?.map((district) => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priceModel">Price Model</Label>
                  <Select value={priceModel} onValueChange={setPriceModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select price model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">Fixed Rate (₹/acre/year)</SelectItem>
                      <SelectItem value="percentage">Percentage Sharing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {priceModel === "fixed" ? (
                  <div className="space-y-2">
                    <Label htmlFor="priceRange">Price Range (₹/acre/year)</Label>
                    <Select value={priceRange} onValueChange={setPriceRange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select price range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Ranges</SelectItem>
                        <SelectItem value="0-10000">Below ₹10,000</SelectItem>
                        <SelectItem value="10000-20000">₹10,000 - ₹20,000</SelectItem>
                        <SelectItem value="20000-30000">₹20,000 - ₹30,000</SelectItem>
                        <SelectItem value="30000+">Above ₹30,000</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="percentageShare">Percentage Share</Label>
                    <Select value={percentageShare} onValueChange={setPercentageShare}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select percentage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Percentages</SelectItem>
                        <SelectItem value="50-50">50-50 Split</SelectItem>
                        <SelectItem value="60-40">60-40 Split</SelectItem>
                        <SelectItem value="70-30">70-30 Split</SelectItem>
                        <SelectItem value="custom">Custom Split</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div>
                  <Label htmlFor="district">District</Label>
                  <Select value={filterDistrict} onValueChange={setFilterDistrict}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Districts</SelectItem>
                      <SelectItem value="Nashik">Nashik</SelectItem>
                      <SelectItem value="Sangli">Sangli</SelectItem>
                      <SelectItem value="Pune">Pune</SelectItem>
                      <SelectItem value="Amritsar">Amritsar</SelectItem>
                      <SelectItem value="Indore">Indore</SelectItem>
                      <SelectItem value="Coimbatore">Coimbatore</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Price Range</Label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="0-15000">Below ₹15,000</SelectItem>
                      <SelectItem value="15000-25000">₹15,000 - ₹25,000</SelectItem>
                      <SelectItem value="25000+">Above ₹25,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="area">Area (acres)</Label>
                  <Input type="text" placeholder="Enter area" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Land Listings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((land) => (
              <Card key={land.id} className="hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="h-48 bg-gradient-earth opacity-20"></div>
                <CardHeader>
                  <CardTitle className="text-lg">{land.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {land.location}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Droplets className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">{land.water}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">{land.electricity}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Area:</span>
                      <span className="font-medium">{land.area}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Soil:</span>
                      <span className="font-medium text-sm">{land.soil}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Suitable for:</span>
                      <span className="font-medium text-sm text-right">{land.suitable}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border space-y-4">
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-primary" />
                      {land.priceModel === "fixed" ? (
                        <span className="font-medium">{land.price}</span>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-primary">{land.sharingModel}</span>
                          <span className="text-sm text-muted-foreground">Profit Sharing</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="h-5 w-5 text-primary" />
                        <span className="font-bold text-lg">{land.price}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1" variant="outline">
                        View Details
                      </Button>
                      <Button className="flex-1" variant="hero">
                        Contact Owner
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Agreement Generation Section */}
          <Card className="mt-12 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-primary" />
                Automatic Agreement Generation
              </CardTitle>
              <CardDescription>
                Once you finalize terms with the landowner, we'll generate a legal agreement instantly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Our platform ensures transparent and secure transactions with legally binding agreements that include:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-sm">Complete land details and boundaries</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-sm">Rental terms and payment schedule</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-sm">Rights and responsibilities of both parties</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span className="text-sm">Dispute resolution mechanisms</span>
                </li>
              </ul>
              <Button variant="hero">Learn More About Agreements</Button>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Land;