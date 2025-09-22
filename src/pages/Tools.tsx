import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Wrench,
  Clock,
  IndianRupee,
  MapPin,
  Phone,
  Star,
  Search,
  Filter,
  User,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect, useCallback } from "react";

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
  // Add more states and their districts here
};

const Tools = () => {
  const allTools = [
    {
      id: 1,
      name: "Tractor (35 HP)",
      owner: "Rajesh Kumar",
      location: "Nashik, Maharashtra",
      price: 800,
      availability: "Available",
      rating: 4.5,
      phone: "+91 98765XXXXX",
      category: "Heavy Machinery",
      ownerType: "Public",
      image: "/placeholder.svg",
      description: "Perfect for plowing and heavy field work. Well-maintained and fuel-efficient.",
      tags: ["Tractor", "Plowing", "Field Work"]
    },
    {
      id: 2,
      name: "Power Tiller",
      owner: "Suresh Patel",
      location: "Pune, Maharashtra",
      price: 500,
      availability: "Available from tomorrow",
      rating: 4.8,
      phone: "+91 87654XXXXX",
      category: "Field Preparation",
      ownerType: "Government",
      image: "/placeholder.svg",
      description: "Ideal for small to medium farms. Easy to operate and maintain.",
      tags: ["Tiller", "Soil Preparation"]
    },
    {
      id: 3,
      name: "Seed Drill Machine",
      owner: "Amit Singh",
      location: "Indore, MP",
      price: 600,
      availability: "Available",
      rating: 4.2,
      phone: "+91 76543XXXXX",
      category: "Seeding Equipment",
      ownerType: "Public",
      image: "/placeholder.svg",
      description: "Precise seed placement. Suitable for wheat, soybeans, and similar crops.",
      tags: ["Seeding", "Precision"]
    },
    {
      id: 4,
      name: "Harvester",
      owner: "Priya Sharma",
      location: "Nagpur, Maharashtra",
      price: 1200,
      availability: "Available next week",
      rating: 4.7,
      phone: "+91 65432XXXXX",
      category: "Heavy Machinery",
      ownerType: "Government",
      image: "/placeholder.svg",
      description: "Modern harvester suitable for wheat and rice. High efficiency and minimal grain loss.",
      tags: ["Harvesting", "Grain", "Rice"]
    },
    {
      id: 5,
      name: "Sprayer System",
      owner: "Mohammed Ali",
      location: "Kolhapur, Maharashtra",
      price: 400,
      availability: "Available",
      rating: 4.4,
      phone: "+91 54321XXXXX",
      category: "Pest Control",
      ownerType: "Public",
      image: "/placeholder.svg",
      description: "Battery-operated sprayer with wide coverage. Perfect for pest control.",
      tags: ["Spraying", "Pest Control"]
    },
    {
      id: 6,
      name: "Rotavator",
      owner: "Ravi Verma",
      location: "Nagpur, Maharashtra",
      price: 600,
      availability: "Available",
      rating: 4.6,
      phone: "+91 43210XXXXX",
      category: "Field Preparation",
      ownerType: "Public",
      image: "/placeholder.svg",
      description: "Efficient soil preparation equipment. Ideal for seedbed preparation.",
      tags: ["Soil Preparation", "Tillage"]
    },
    {
      id: 7,
      name: "Combine Harvester",
      owner: "State Agriculture Dept",
      location: "Amravati, Maharashtra",
      price: 2000,
      availability: "Available next week",
      rating: 4.9,
      phone: "+91 32109XXXXX",
      category: "Heavy Machinery",
      ownerType: "Government",
      image: "/placeholder.svg",
      description: "Modern combine harvester for efficient crop harvesting. Suitable for wheat and rice.",
      tags: ["Harvesting", "Large Scale"]
    },
    {
      id: 8,
      name: "Paddy Transplanter",
      owner: "Kisaan Cooperative",
      location: "Chandrapur, Maharashtra",
      price: 800,
      availability: "Available",
      rating: 4.7,
      phone: "+91 21098XXXXX",
      category: "Planting Equipment",
      ownerType: "Government",
      image: "/placeholder.svg",
      description: "8-row paddy transplanter for efficient rice planting.",
      tags: ["Rice", "Transplanting"]
    },
    {
      id: 9,
      name: "Boom Sprayer",
      owner: "Arun Patil",
      location: "Yavatmal, Maharashtra",
      price: 450,
      availability: "Available tomorrow",
      rating: 4.3,
      phone: "+91 10987XXXXX",
      category: "Pest Control",
      ownerType: "Public",
      image: "/placeholder.svg",
      description: "Wide coverage boom sprayer for efficient pesticide application.",
      tags: ["Spraying", "Large Coverage"]
    },
    {
      id: 10,
      name: "Mini Tractor",
      owner: "Farmers Association",
      location: "Wardha, Maharashtra",
      price: 700,
      availability: "Available",
      rating: 4.5,
      phone: "+91 09876XXXXX",
      category: "Heavy Machinery",
      ownerType: "Government",
      image: "/placeholder.svg",
      description: "Compact tractor suitable for small farms and orchards.",
      tags: ["Small Farm", "Versatile"]
    },
    {
      id: 11,
      name: "Thresher Machine",
      owner: "Dinesh Patel",
      location: "Akola, Maharashtra",
      price: 550,
      availability: "Available",
      rating: 4.4,
      phone: "+91 98760XXXXX",
      category: "Post Harvest",
      ownerType: "Public",
      image: "/placeholder.svg",
      description: "Efficient thresher for wheat and pulse crops.",
      tags: ["Threshing", "Post Harvest"]
    },
    {
      id: 12,
      name: "Laser Land Leveler",
      owner: "State Agri Center",
      location: "Buldhana, Maharashtra",
      price: 1500,
      availability: "Available next week",
      rating: 4.8,
      phone: "+91 87609XXXXX",
      category: "Field Preparation",
      ownerType: "Government",
      image: "/placeholder.svg",
      description: "High-precision laser-guided land leveling equipment.",
      tags: ["Leveling", "Precision Farming"]
    },
    // Variations of existing tools with different details
    {
      id: 13,
      name: "Harvester (Medium)",
      owner: "Kishore Patil",
      location: "Solapur, Maharashtra",
      price: 1000,
      availability: "Available",
      rating: 4.4,
      phone: "+91 76543XXXXX",
      category: "Heavy Machinery",
      ownerType: "Public",
      image: "/placeholder.svg",
      description: "Mid-sized harvester perfect for medium farms. Well-maintained with good efficiency.",
      tags: ["Harvesting", "Medium Scale", "Rice"]
    },
    {
      id: 14,
      name: "Mini Tractor (22 HP)",
      owner: "State Agriculture Dept",
      location: "Dhule, Maharashtra",
      price: 600,
      availability: "Available next week",
      rating: 4.7,
      phone: "+91 65432XXXXX",
      category: "Heavy Machinery",
      ownerType: "Government",
      image: "/placeholder.svg",
      description: "Small but powerful tractor, ideal for small holdings and narrow spaces.",
      tags: ["Small Farm", "Versatile", "Compact"]
    },
    {
      id: 15,
      name: "Power Tiller (Heavy Duty)",
      owner: "Ramesh Jadhav",
      location: "Satara, Maharashtra",
      price: 700,
      availability: "Available",
      rating: 4.6,
      phone: "+91 54321XXXXX",
      category: "Field Preparation",
      ownerType: "Public",
      image: "/placeholder.svg",
      description: "Heavy-duty power tiller with additional attachments. Perfect for tough soil conditions.",
      tags: ["Tiller", "Heavy Duty", "Soil Preparation"]
    },
    {
      id: 16,
      name: "Advanced Seed Drill",
      owner: "Agri Innovation Center",
      location: "Jalgaon, Maharashtra",
      price: 800,
      availability: "Available from tomorrow",
      rating: 4.9,
      phone: "+91 43210XXXXX",
      category: "Seeding Equipment",
      ownerType: "Government",
      image: "/placeholder.svg",
      description: "Modern seed drill with precise depth control and multiple seed box options.",
      tags: ["Seeding", "Precision", "Modern"]
    },
    {
      id: 17,
      name: "Tractor (50 HP)",
      owner: "Farmers Group",
      location: "Sangli, Maharashtra",
      price: 1100,
      availability: "Available",
      rating: 4.8,
      phone: "+91 32109XXXXX",
      category: "Heavy Machinery",
      ownerType: "Government",
      image: "/placeholder.svg",
      description: "High-power tractor suitable for heavy-duty farming operations.",
      tags: ["Tractor", "Heavy Duty", "Powerful"]
    },
    {
      id: 18,
      name: "Battery Sprayer Pro",
      owner: "Vijay Mane",
      location: "Ratnagiri, Maharashtra",
      price: 300,
      availability: "Available",
      rating: 4.3,
      phone: "+91 21098XXXXX",
      category: "Pest Control",
      ownerType: "Public",
      image: "/placeholder.svg",
      description: "Advanced battery-operated sprayer with extended battery life.",
      tags: ["Spraying", "Battery Operated", "Efficient"]
    },
    {
      id: 19,
      name: "Modern Thresher",
      owner: "Agri Development Corp",
      location: "Latur, Maharashtra",
      price: 650,
      availability: "Available next week",
      rating: 4.7,
      phone: "+91 10987XXXXX",
      category: "Post Harvest",
      ownerType: "Government",
      image: "/placeholder.svg",
      description: "High-capacity thresher with minimal grain damage. Suitable for multiple crops.",
      tags: ["Threshing", "Multi-crop", "Modern"]
    },
    {
      id: 20,
      name: "Rotavator (Wide)",
      owner: "Prakash Shah",
      location: "Aurangabad, Maharashtra",
      price: 750,
      availability: "Available",
      rating: 4.5,
      phone: "+91 09876XXXXX",
      category: "Field Preparation",
      ownerType: "Public",
      image: "/placeholder.svg",
      description: "Wide-coverage rotavator for quick and efficient field preparation.",
      tags: ["Soil Preparation", "Wide Coverage", "Efficient"]
    }
  ];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedOwnerType, setSelectedOwnerType] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [tools, setTools] = useState(allTools);

  // Filter and sort tools
  const filterTools = useCallback(() => {
    let filtered = [...allTools];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    // Apply owner type filter
    if (selectedOwnerType !== "all") {
      filtered = filtered.filter(tool => tool.ownerType === selectedOwnerType);
    }

    // Apply location filters
    if (selectedState !== "all") {
      filtered = filtered.filter(tool => {
        const [district, state] = tool.location.split(", ");
        return state === selectedState;
      });

      if (selectedDistrict !== "all") {
        filtered = filtered.filter(tool => {
          const [district] = tool.location.split(", ");
          return district === selectedDistrict;
        });
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    setTools(filtered);
  }, [searchQuery, selectedCategory, selectedOwnerType, selectedState, selectedDistrict, sortBy]);

  // Update filters when filterTools changes
  useEffect(() => {
    filterTools();
  }, [filterTools]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/5 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Rent Farming Equipment
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access affordable farming tools and machinery from your community. Save costs and increase productivity.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search tools, categories, or tags..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-4 flex-wrap">
                <Select value={selectedState} onValueChange={(value) => {
                  setSelectedState(value);
                  setSelectedDistrict("all");
                }}>
                  <SelectTrigger className="w-[180px]">
                    <MapPin className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {indianStates.map((state) => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDistrict} onValueChange={setSelectedDistrict} disabled={selectedState === "all"}>
                  <SelectTrigger className="w-[180px]">
                    <MapPin className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Districts</SelectItem>
                    {selectedState !== "all" && districtsByState[selectedState]?.map((district) => (
                      <SelectItem key={district} value={district}>{district}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedOwnerType} onValueChange={setSelectedOwnerType}>
                  <SelectTrigger className="w-[180px]">
                    <User className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Owned By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Owners</SelectItem>
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Public">Public/Personal</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Heavy Machinery">Heavy Machinery</SelectItem>
                    <SelectItem value="Field Preparation">Field Preparation</SelectItem>
                    <SelectItem value="Seeding Equipment">Seeding Equipment</SelectItem>
                    <SelectItem value="Pest Control">Pest Control</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rating">Top Rated</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-t from-background to-background/0 h-8 z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-background to-background/0 h-8 z-10 pointer-events-none bottom-0" />
            <div className="max-h-[800px] overflow-y-auto px-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 scrollbar-thumb-rounded-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-2">
                {tools.map((tool) => (
              <Card key={tool.id} className="hover:shadow-lg transition-all duration-300 flex flex-col">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start space-x-4">
                    <div className="space-y-1.5">
                      <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                        <Wrench className="h-5 w-5 text-primary flex-shrink-0" />
                        {tool.name}
                      </CardTitle>
                      <CardDescription className="text-sm">Owner: {tool.owner}</CardDescription>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={tool.ownerType === "Government" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {tool.ownerType}
                        </Badge>
                      </div>
                    </div>
                    <Badge variant="outline" className="flex-shrink-0">
                      {tool.category}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    {/* Description */}
                    <p className="text-sm text-muted-foreground min-h-[60px]">
                      {tool.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 min-h-[28px]">
                      {tool.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{tool.location}</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-primary flex-shrink-0" />
                      <span className="font-bold text-lg">₹{tool.price}/day</span>
                    </div>

                    {/* Status and Rating */}
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-green-600">{tool.availability}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <Star className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                        <span className="font-medium">{tool.rating}/5</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Button */}
                  <Button variant="hero" className="w-full">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Owner
                  </Button>
                </CardContent>
              </Card>
            ))}
              </div>
            </div>
          </div>
          
          {tools.length === 0 && (
            <div className="text-center py-8">
              <p className="text-lg text-muted-foreground">No tools found matching your criteria</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Tools;