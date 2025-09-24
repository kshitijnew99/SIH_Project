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

  // Sample market data - Extended 40x for better filter testing
  const marketData = {
    wheat: [
      // Original data
      { mandi: "Indore", state: "Madhya Pradesh", price: 2250, change: 50, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Bhopal", state: "Madhya Pradesh", price: 2200, change: -30, trend: "down", lastUpdate: "1 hour ago" },
      { mandi: "Amritsar", state: "Punjab", price: 2350, change: 0, trend: "stable", lastUpdate: "3 hours ago" },
      { mandi: "Ludhiana", state: "Punjab", price: 2320, change: 20, trend: "up", lastUpdate: "30 mins ago" },
      { mandi: "Nashik", state: "Maharashtra", price: 2180, change: -10, trend: "down", lastUpdate: "1 hour ago" },
      
      // Madhya Pradesh mandis
      { mandi: "Ujjain", state: "Madhya Pradesh", price: 2280, change: 35, trend: "up", lastUpdate: "45 mins ago" },
      { mandi: "Gwalior", state: "Madhya Pradesh", price: 2190, change: -15, trend: "down", lastUpdate: "2 hours ago" },
      { mandi: "Jabalpur", state: "Madhya Pradesh", price: 2270, change: 40, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Dewas", state: "Madhya Pradesh", price: 2240, change: 25, trend: "up", lastUpdate: "3 hours ago" },
      { mandi: "Ratlam", state: "Madhya Pradesh", price: 2210, change: -20, trend: "down", lastUpdate: "90 mins ago" },
      { mandi: "Mandsaur", state: "Madhya Pradesh", price: 2290, change: 45, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Neemuch", state: "Madhya Pradesh", price: 2260, change: 30, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Shajapur", state: "Madhya Pradesh", price: 2220, change: -10, trend: "down", lastUpdate: "4 hours ago" },
      { mandi: "Sehore", state: "Madhya Pradesh", price: 2275, change: 38, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Morena", state: "Madhya Pradesh", price: 2185, change: -25, trend: "down", lastUpdate: "3 hours ago" },

      // Punjab mandis
      { mandi: "Bathinda", state: "Punjab", price: 2340, change: 15, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Mansa", state: "Punjab", price: 2330, change: 10, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Sangrur", state: "Punjab", price: 2345, change: 18, trend: "up", lastUpdate: "45 mins ago" },
      { mandi: "Patiala", state: "Punjab", price: 2325, change: 8, trend: "up", lastUpdate: "1.5 hours ago" },
      { mandi: "Faridkot", state: "Punjab", price: 2335, change: 12, trend: "up", lastUpdate: "3 hours ago" },
      { mandi: "Muktsar", state: "Punjab", price: 2315, change: -5, trend: "down", lastUpdate: "2 hours ago" },
      { mandi: "Barnala", state: "Punjab", price: 2355, change: 22, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Moga", state: "Punjab", price: 2328, change: 11, trend: "up", lastUpdate: "90 mins ago" },

      // Maharashtra mandis
      { mandi: "Pune", state: "Maharashtra", price: 2195, change: -8, trend: "down", lastUpdate: "2 hours ago" },
      { mandi: "Aurangabad", state: "Maharashtra", price: 2170, change: -18, trend: "down", lastUpdate: "1 hour ago" },
      { mandi: "Solapur", state: "Maharashtra", price: 2160, change: -22, trend: "down", lastUpdate: "3 hours ago" },
      { mandi: "Latur", state: "Maharashtra", price: 2175, change: -15, trend: "down", lastUpdate: "45 mins ago" },
      { mandi: "Ahmednagar", state: "Maharashtra", price: 2185, change: -12, trend: "down", lastUpdate: "2.5 hours ago" },
      { mandi: "Jalgaon", state: "Maharashtra", price: 2200, change: -5, trend: "down", lastUpdate: "1 hour ago" },
      { mandi: "Kolhapur", state: "Maharashtra", price: 2165, change: -20, trend: "down", lastUpdate: "4 hours ago" },

      // Haryana mandis
      { mandi: "Karnal", state: "Haryana", price: 2310, change: 28, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Panipat", state: "Haryana", price: 2305, change: 25, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Ambala", state: "Haryana", price: 2300, change: 20, trend: "up", lastUpdate: "1.5 hours ago" },
      { mandi: "Sirsa", state: "Haryana", price: 2295, change: 18, trend: "up", lastUpdate: "3 hours ago" },
      { mandi: "Hisar", state: "Haryana", price: 2312, change: 30, trend: "up", lastUpdate: "45 mins ago" },
      { mandi: "Rohtak", state: "Haryana", price: 2298, change: 22, trend: "up", lastUpdate: "2 hours ago" },

      // Uttar Pradesh mandis
      { mandi: "Meerut", state: "Uttar Pradesh", price: 2265, change: 35, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Agra", state: "Uttar Pradesh", price: 2255, change: 28, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Varanasi", state: "Uttar Pradesh", price: 2245, change: 22, trend: "up", lastUpdate: "3 hours ago" },
      { mandi: "Lucknow", state: "Uttar Pradesh", price: 2260, change: 32, trend: "up", lastUpdate: "1.5 hours ago" },
      { mandi: "Kanpur", state: "Uttar Pradesh", price: 2250, change: 25, trend: "up", lastUpdate: "2.5 hours ago" },
      { mandi: "Allahabad", state: "Uttar Pradesh", price: 2240, change: 18, trend: "up", lastUpdate: "4 hours ago" },

      // Rajasthan mandis
      { mandi: "Jaipur", state: "Rajasthan", price: 2230, change: 15, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Bikaner", state: "Rajasthan", price: 2225, change: 12, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Jodhpur", state: "Rajasthan", price: 2235, change: 18, trend: "up", lastUpdate: "1.5 hours ago" },
      { mandi: "Udaipur", state: "Rajasthan", price: 2220, change: 8, trend: "up", lastUpdate: "3 hours ago" },
      { mandi: "Kota", state: "Rajasthan", price: 2240, change: 20, trend: "up", lastUpdate: "2 hours ago" },

      // Gujarat mandis
      { mandi: "Ahmedabad", state: "Gujarat", price: 2205, change: -2, trend: "down", lastUpdate: "1 hour ago" },
      { mandi: "Rajkot", state: "Gujarat", price: 2215, change: 5, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Vadodara", state: "Gujarat", price: 2210, change: 2, trend: "up", lastUpdate: "1.5 hours ago" },
      { mandi: "Surat", state: "Gujarat", price: 2200, change: -5, trend: "down", lastUpdate: "3 hours ago" },
    ],
    
    rice: [
      // Original data
      { mandi: "Vijayawada", state: "Andhra Pradesh", price: 3200, change: 100, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Kolkata", state: "West Bengal", price: 3150, change: 50, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Cuttack", state: "Odisha", price: 3000, change: -20, trend: "down", lastUpdate: "30 mins ago" },
      { mandi: "Patna", state: "Bihar", price: 2950, change: 0, trend: "stable", lastUpdate: "1 hour ago" },

      // Andhra Pradesh mandis
      { mandi: "Guntur", state: "Andhra Pradesh", price: 3180, change: 80, trend: "up", lastUpdate: "45 mins ago" },
      { mandi: "Nellore", state: "Andhra Pradesh", price: 3220, change: 110, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Kurnool", state: "Andhra Pradesh", price: 3170, change: 75, trend: "up", lastUpdate: "1.5 hours ago" },
      { mandi: "Visakhapatnam", state: "Andhra Pradesh", price: 3190, change: 85, trend: "up", lastUpdate: "3 hours ago" },
      { mandi: "Tirupati", state: "Andhra Pradesh", price: 3160, change: 70, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Anantapur", state: "Andhra Pradesh", price: 3195, change: 90, trend: "up", lastUpdate: "1 hour ago" },

      // West Bengal mandis
      { mandi: "Howrah", state: "West Bengal", price: 3140, change: 45, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Durgapur", state: "West Bengal", price: 3130, change: 35, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Siliguri", state: "West Bengal", price: 3120, change: 25, trend: "up", lastUpdate: "3 hours ago" },
      { mandi: "Asansol", state: "West Bengal", price: 3135, change: 40, trend: "up", lastUpdate: "1.5 hours ago" },
      { mandi: "Coochbehar", state: "West Bengal", price: 3125, change: 30, trend: "up", lastUpdate: "2.5 hours ago" },

      // Odisha mandis
      { mandi: "Bhubaneswar", state: "Odisha", price: 2980, change: -30, trend: "down", lastUpdate: "1 hour ago" },
      { mandi: "Berhampur", state: "Odisha", price: 2990, change: -25, trend: "down", lastUpdate: "2 hours ago" },
      { mandi: "Rourkela", state: "Odisha", price: 2985, change: -28, trend: "down", lastUpdate: "1.5 hours ago" },
      { mandi: "Sambalpur", state: "Odisha", price: 2995, change: -22, trend: "down", lastUpdate: "3 hours ago" },

      // Bihar mandis
      { mandi: "Muzaffarpur", state: "Bihar", price: 2940, change: -8, trend: "down", lastUpdate: "1 hour ago" },
      { mandi: "Gaya", state: "Bihar", price: 2955, change: 2, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Bhagalpur", state: "Bihar", price: 2945, change: -5, trend: "down", lastUpdate: "1.5 hours ago" },
      { mandi: "Darbhanga", state: "Bihar", price: 2960, change: 5, trend: "up", lastUpdate: "3 hours ago" },

      // Telangana mandis
      { mandi: "Hyderabad", state: "Telangana", price: 3100, change: 60, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Warangal", state: "Telangana", price: 3080, change: 45, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Nizamabad", state: "Telangana", price: 3090, change: 55, trend: "up", lastUpdate: "1.5 hours ago" },
      { mandi: "Karimnagar", state: "Telangana", price: 3070, change: 40, trend: "up", lastUpdate: "3 hours ago" },

      // Tamil Nadu mandis
      { mandi: "Chennai", state: "Tamil Nadu", price: 3250, change: 120, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Coimbatore", state: "Tamil Nadu", price: 3230, change: 105, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Madurai", state: "Tamil Nadu", price: 3240, change: 115, trend: "up", lastUpdate: "1.5 hours ago" },
      { mandi: "Salem", state: "Tamil Nadu", price: 3220, change: 95, trend: "up", lastUpdate: "3 hours ago" },
      { mandi: "Trichy", state: "Tamil Nadu", price: 3235, change: 110, trend: "up", lastUpdate: "2 hours ago" },

      // Karnataka mandis
      { mandi: "Bangalore", state: "Karnataka", price: 3300, change: 150, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Mysore", state: "Karnataka", price: 3280, change: 135, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Hubli", state: "Karnataka", price: 3290, change: 145, trend: "up", lastUpdate: "1.5 hours ago" },
      { mandi: "Mangalore", state: "Karnataka", price: 3270, change: 125, trend: "up", lastUpdate: "3 hours ago" },

      // Punjab mandis
      { mandi: "Amritsar", state: "Punjab", price: 3050, change: 20, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Ludhiana", state: "Punjab", price: 3040, change: 15, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Jalandhar", state: "Punjab", price: 3045, change: 18, trend: "up", lastUpdate: "1.5 hours ago" },

      // Haryana mandis
      { mandi: "Kurukshetra", state: "Haryana", price: 3030, change: 12, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Karnal", state: "Haryana", price: 3035, change: 15, trend: "up", lastUpdate: "2 hours ago" },

      // Uttar Pradesh mandis
      { mandi: "Varanasi", state: "Uttar Pradesh", price: 2970, change: 8, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Gorakhpur", state: "Uttar Pradesh", price: 2965, change: 5, trend: "up", lastUpdate: "2 hours ago" },
    ],

    cotton: [
      // Original data
      { mandi: "Ahmedabad", state: "Gujarat", price: 7500, change: 200, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Nagpur", state: "Maharashtra", price: 7300, change: -50, trend: "down", lastUpdate: "1 hour ago" },
      { mandi: "Warangal", state: "Telangana", price: 7400, change: 100, trend: "up", lastUpdate: "3 hours ago" },

      // Gujarat mandis
      { mandi: "Rajkot", state: "Gujarat", price: 7480, change: 180, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Surendranagar", state: "Gujarat", price: 7520, change: 220, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Bhavnagar", state: "Gujarat", price: 7460, change: 160, trend: "up", lastUpdate: "1.5 hours ago" },
      { mandi: "Junagadh", state: "Gujarat", price: 7490, change: 190, trend: "up", lastUpdate: "3 hours ago" },
      { mandi: "Vadodara", state: "Gujarat", price: 7510, change: 210, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Surat", state: "Gujarat", price: 7470, change: 170, trend: "up", lastUpdate: "4 hours ago" },

      // Maharashtra mandis
      { mandi: "Akola", state: "Maharashtra", price: 7280, change: -70, trend: "down", lastUpdate: "1 hour ago" },
      { mandi: "Amravati", state: "Maharashtra", price: 7290, change: -60, trend: "down", lastUpdate: "2 hours ago" },
      { mandi: "Yavatmal", state: "Maharashtra", price: 7270, change: -80, trend: "down", lastUpdate: "1.5 hours ago" },
      { mandi: "Wardha", state: "Maharashtra", price: 7310, change: -40, trend: "down", lastUpdate: "3 hours ago" },
      { mandi: "Buldhana", state: "Maharashtra", price: 7285, change: -65, trend: "down", lastUpdate: "2 hours ago" },
      { mandi: "Washim", state: "Maharashtra", price: 7275, change: -75, trend: "down", lastUpdate: "4 hours ago" },

      // Telangana mandis
      { mandi: "Hyderabad", state: "Telangana", price: 7420, change: 120, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Nizamabad", state: "Telangana", price: 7390, change: 90, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Adilabad", state: "Telangana", price: 7410, change: 110, trend: "up", lastUpdate: "1.5 hours ago" },
      { mandi: "Khammam", state: "Telangana", price: 7380, change: 80, trend: "up", lastUpdate: "3 hours ago" },

      // Andhra Pradesh mandis
      { mandi: "Guntur", state: "Andhra Pradesh", price: 7350, change: 50, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Kurnool", state: "Andhra Pradesh", price: 7360, change: 60, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Anantapur", state: "Andhra Pradesh", price: 7340, change: 40, trend: "up", lastUpdate: "1.5 hours ago" },

      // Karnataka mandis
      { mandi: "Raichur", state: "Karnataka", price: 7330, change: 30, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Gulbarga", state: "Karnataka", price: 7320, change: 20, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Bijapur", state: "Karnataka", price: 7335, change: 35, trend: "up", lastUpdate: "1.5 hours ago" },

      // Tamil Nadu mandis
      { mandi: "Coimbatore", state: "Tamil Nadu", price: 7450, change: 150, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Salem", state: "Tamil Nadu", price: 7440, change: 140, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Erode", state: "Tamil Nadu", price: 7430, change: 130, trend: "up", lastUpdate: "1.5 hours ago" },

      // Madhya Pradesh mandis
      { mandi: "Khandwa", state: "Madhya Pradesh", price: 7250, change: -100, trend: "down", lastUpdate: "1 hour ago" },
      { mandi: "Burhanpur", state: "Madhya Pradesh", price: 7260, change: -90, trend: "down", lastUpdate: "2 hours ago" },

      // Haryana mandis
      { mandi: "Sirsa", state: "Haryana", price: 7550, change: 250, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Fatehabad", state: "Haryana", price: 7540, change: 240, trend: "up", lastUpdate: "2 hours ago" },

      // Punjab mandis
      { mandi: "Bathinda", state: "Punjab", price: 7580, change: 280, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Mansa", state: "Punjab", price: 7570, change: 270, trend: "up", lastUpdate: "2 hours ago" },

      // Rajasthan mandis
      { mandi: "Ganganagar", state: "Rajasthan", price: 7380, change: 80, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Hanumangarh", state: "Rajasthan", price: 7370, change: 70, trend: "up", lastUpdate: "2 hours ago" },
    ],

    soybean: [
      // Original data
      { mandi: "Indore", state: "Madhya Pradesh", price: 4500, change: 150, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Latur", state: "Maharashtra", price: 4450, change: 0, trend: "stable", lastUpdate: "2 hours ago" },
      { mandi: "Rajkot", state: "Gujarat", price: 4400, change: -30, trend: "down", lastUpdate: "30 mins ago" },

      // Madhya Pradesh mandis
      { mandi: "Bhopal", state: "Madhya Pradesh", price: 4480, change: 130, trend: "up", lastUpdate: "45 mins ago" },
      { mandi: "Ujjain", state: "Madhya Pradesh", price: 4520, change: 170, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Dewas", state: "Madhya Pradesh", price: 4490, change: 140, trend: "up", lastUpdate: "1.5 hours ago" },
      { mandi: "Ratlam", state: "Madhya Pradesh", price: 4510, change: 160, trend: "up", lastUpdate: "3 hours ago" },
      { mandi: "Mandsaur", state: "Madhya Pradesh", price: 4470, change: 120, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Neemuch", state: "Madhya Pradesh", price: 4505, change: 155, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Shajapur", state: "Madhya Pradesh", price: 4485, change: 135, trend: "up", lastUpdate: "4 hours ago" },
      { mandi: "Sehore", state: "Madhya Pradesh", price: 4495, change: 145, trend: "up", lastUpdate: "2 hours ago" },

      // Maharashtra mandis
      { mandi: "Nagpur", state: "Maharashtra", price: 4440, change: -10, trend: "down", lastUpdate: "1 hour ago" },
      { mandi: "Akola", state: "Maharashtra", price: 4460, change: 10, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Amravati", state: "Maharashtra", price: 4445, change: -5, trend: "down", lastUpdate: "1.5 hours ago" },
      { mandi: "Yavatmal", state: "Maharashtra", price: 4455, change: 5, trend: "up", lastUpdate: "3 hours ago" },
      { mandi: "Washim", state: "Maharashtra", price: 4435, change: -15, trend: "down", lastUpdate: "2 hours ago" },
      { mandi: "Buldhana", state: "Maharashtra", price: 4465, change: 15, trend: "up", lastUpdate: "4 hours ago" },
      { mandi: "Wardha", state: "Maharashtra", price: 4470, change: 20, trend: "up", lastUpdate: "1 hour ago" },

      // Gujarat mandis
      { mandi: "Ahmedabad", state: "Gujarat", price: 4390, change: -40, trend: "down", lastUpdate: "1 hour ago" },
      { mandi: "Vadodara", state: "Gujarat", price: 4410, change: -20, trend: "down", lastUpdate: "2 hours ago" },
      { mandi: "Surat", state: "Gujarat", price: 4395, change: -35, trend: "down", lastUpdate: "1.5 hours ago" },
      { mandi: "Junagadh", state: "Gujarat", price: 4405, change: -25, trend: "down", lastUpdate: "3 hours ago" },

      // Karnataka mandis
      { mandi: "Bangalore", state: "Karnataka", price: 4550, change: 200, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Mysore", state: "Karnataka", price: 4530, change: 180, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Hubli", state: "Karnataka", price: 4540, change: 190, trend: "up", lastUpdate: "1.5 hours ago" },
      { mandi: "Belgaum", state: "Karnataka", price: 4525, change: 175, trend: "up", lastUpdate: "3 hours ago" },

      // Telangana mandis
      { mandi: "Hyderabad", state: "Telangana", price: 4480, change: 130, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Nizamabad", state: "Telangana", price: 4475, change: 125, trend: "up", lastUpdate: "2 hours ago" },

      // Rajasthan mandis
      { mandi: "Kota", state: "Rajasthan", price: 4420, change: 70, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Jhalawar", state: "Rajasthan", price: 4415, change: 65, trend: "up", lastUpdate: "2 hours ago" },

      // Chhattisgarh mandis
      { mandi: "Raipur", state: "Chhattisgarh", price: 4380, change: 30, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Bilaspur", state: "Chhattisgarh", price: 4375, change: 25, trend: "up", lastUpdate: "2 hours ago" },
    ],

    maize: [
      // Bihar mandis
      { mandi: "Patna", state: "Bihar", price: 1850, change: 25, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Muzaffarpur", state: "Bihar", price: 1840, change: 20, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Gaya", state: "Bihar", price: 1845, change: 22, trend: "up", lastUpdate: "1.5 hours ago" },
      { mandi: "Bhagalpur", state: "Bihar", price: 1835, change: 18, trend: "up", lastUpdate: "3 hours ago" },

      // Uttar Pradesh mandis
      { mandi: "Meerut", state: "Uttar Pradesh", price: 1880, change: 30, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Agra", state: "Uttar Pradesh", price: 1870, change: 25, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Lucknow", state: "Uttar Pradesh", price: 1875, change: 28, trend: "up", lastUpdate: "1.5 hours ago" },
      { mandi: "Kanpur", state: "Uttar Pradesh", price: 1865, change: 23, trend: "up", lastUpdate: "3 hours ago" },

      // Karnataka mandis
      { mandi: "Bangalore", state: "Karnataka", price: 1920, change: 40, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Mysore", state: "Karnataka", price: 1910, change: 35, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Hubli", state: "Karnataka", price: 1915, change: 38, trend: "up", lastUpdate: "1.5 hours ago" },

      // Madhya Pradesh mandis
      { mandi: "Indore", state: "Madhya Pradesh", price: 1825, change: 15, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Bhopal", state: "Madhya Pradesh", price: 1820, change: 12, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Jabalpur", state: "Madhya Pradesh", price: 1830, change: 18, trend: "up", lastUpdate: "1.5 hours ago" },

      // Rajasthan mandis
      { mandi: "Jaipur", state: "Rajasthan", price: 1860, change: 20, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Jodhpur", state: "Rajasthan", price: 1855, change: 18, trend: "up", lastUpdate: "2 hours ago" },

      // Andhra Pradesh mandis
      { mandi: "Guntur", state: "Andhra Pradesh", price: 1890, change: 32, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Vijayawada", state: "Andhra Pradesh", price: 1885, change: 30, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Nellore", state: "Andhra Pradesh", price: 1895, change: 35, trend: "up", lastUpdate: "1.5 hours ago" },
    ],

    sugarcane: [
      // Uttar Pradesh mandis
      { mandi: "Meerut", state: "Uttar Pradesh", price: 350, change: 5, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Muzaffarnagar", state: "Uttar Pradesh", price: 345, change: 3, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Lucknow", state: "Uttar Pradesh", price: 348, change: 4, trend: "up", lastUpdate: "1.5 hours ago" },
      { mandi: "Bareilly", state: "Uttar Pradesh", price: 342, change: 2, trend: "up", lastUpdate: "3 hours ago" },
      { mandi: "Moradabad", state: "Uttar Pradesh", price: 347, change: 4, trend: "up", lastUpdate: "2 hours ago" },

      // Maharashtra mandis
      { mandi: "Pune", state: "Maharashtra", price: 325, change: -5, trend: "down", lastUpdate: "1 hour ago" },
      { mandi: "Kolhapur", state: "Maharashtra", price: 330, change: -2, trend: "down", lastUpdate: "2 hours ago" },
      { mandi: "Sangli", state: "Maharashtra", price: 328, change: -3, trend: "down", lastUpdate: "1.5 hours ago" },
      { mandi: "Ahmednagar", state: "Maharashtra", price: 332, change: -1, trend: "down", lastUpdate: "3 hours ago" },

      // Karnataka mandis
      { mandi: "Mandya", state: "Karnataka", price: 340, change: 2, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Mysore", state: "Karnataka", price: 338, change: 1, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Bangalore", state: "Karnataka", price: 335, change: -1, trend: "down", lastUpdate: "1.5 hours ago" },

      // Tamil Nadu mandis
      { mandi: "Coimbatore", state: "Tamil Nadu", price: 355, change: 8, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Salem", state: "Tamil Nadu", price: 352, change: 6, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Erode", state: "Tamil Nadu", price: 350, change: 5, trend: "up", lastUpdate: "1.5 hours ago" },

      // Andhra Pradesh mandis
      { mandi: "Visakhapatnam", state: "Andhra Pradesh", price: 345, change: 3, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Guntur", state: "Andhra Pradesh", price: 343, change: 2, trend: "up", lastUpdate: "2 hours ago" },

      // Gujarat mandis
      { mandi: "Ahmedabad", state: "Gujarat", price: 320, change: -8, trend: "down", lastUpdate: "1 hour ago" },
      { mandi: "Surat", state: "Gujarat", price: 322, change: -6, trend: "down", lastUpdate: "2 hours ago" },
    ],

    onion: [
      // Maharashtra mandis
      { mandi: "Nashik", state: "Maharashtra", price: 2500, change: 100, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Pune", state: "Maharashtra", price: 2480, change: 90, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Solapur", state: "Maharashtra", price: 2520, change: 110, trend: "up", lastUpdate: "1.5 hours ago" },
      { mandi: "Aurangabad", state: "Maharashtra", price: 2470, change: 85, trend: "up", lastUpdate: "3 hours ago" },
      { mandi: "Ahmednagar", state: "Maharashtra", price: 2490, change: 95, trend: "up", lastUpdate: "2 hours ago" },

      // Gujarat mandis
      { mandi: "Rajkot", state: "Gujarat", price: 2350, change: 50, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Ahmedabad", state: "Gujarat", price: 2380, change: 70, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Surat", state: "Gujarat", price: 2360, change: 60, trend: "up", lastUpdate: "1.5 hours ago" },
      { mandi: "Vadodara", state: "Gujarat", price: 2370, change: 65, trend: "up", lastUpdate: "3 hours ago" },

      // Karnataka mandis
      { mandi: "Bangalore", state: "Karnataka", price: 2600, change: 150, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Belgaum", state: "Karnataka", price: 2580, change: 140, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Hubli", state: "Karnataka", price: 2590, change: 145, trend: "up", lastUpdate: "1.5 hours ago" },

      // Andhra Pradesh mandis
      { mandi: "Kurnool", state: "Andhra Pradesh", price: 2450, change: 80, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Anantapur", state: "Andhra Pradesh", price: 2440, change: 75, trend: "up", lastUpdate: "2 hours ago" },

      // Tamil Nadu mandis
      { mandi: "Coimbatore", state: "Tamil Nadu", price: 2650, change: 180, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Salem", state: "Tamil Nadu", price: 2630, change: 170, trend: "up", lastUpdate: "2 hours ago" },

      // Madhya Pradesh mandis
      { mandi: "Indore", state: "Madhya Pradesh", price: 2400, change: 60, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Bhopal", state: "Madhya Pradesh", price: 2390, change: 55, trend: "up", lastUpdate: "2 hours ago" },

      // Rajasthan mandis
      { mandi: "Jaipur", state: "Rajasthan", price: 2420, change: 70, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Jodhpur", state: "Rajasthan", price: 2410, change: 65, trend: "up", lastUpdate: "2 hours ago" },
    ],

    potato: [
      // Uttar Pradesh mandis
      { mandi: "Agra", state: "Uttar Pradesh", price: 1250, change: 30, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Meerut", state: "Uttar Pradesh", price: 1240, change: 25, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Kanpur", state: "Uttar Pradesh", price: 1245, change: 28, trend: "up", lastUpdate: "1.5 hours ago" },
      { mandi: "Lucknow", state: "Uttar Pradesh", price: 1235, change: 22, trend: "up", lastUpdate: "3 hours ago" },

      // West Bengal mandis
      { mandi: "Kolkata", state: "West Bengal", price: 1200, change: 15, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Hooghly", state: "West Bengal", price: 1195, change: 12, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Howrah", state: "West Bengal", price: 1205, change: 18, trend: "up", lastUpdate: "1.5 hours ago" },

      // Punjab mandis
      { mandi: "Jalandhar", state: "Punjab", price: 1300, change: 40, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Ludhiana", state: "Punjab", price: 1290, change: 35, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Amritsar", state: "Punjab", price: 1295, change: 38, trend: "up", lastUpdate: "1.5 hours ago" },

      // Bihar mandis
      { mandi: "Patna", state: "Bihar", price: 1180, change: 8, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Muzaffarpur", state: "Bihar", price: 1175, change: 5, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Gaya", state: "Bihar", price: 1185, change: 10, trend: "up", lastUpdate: "1.5 hours ago" },

      // Gujarat mandis
      { mandi: "Ahmedabad", state: "Gujarat", price: 1320, change: 45, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Rajkot", state: "Gujarat", price: 1310, change: 40, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Surat", state: "Gujarat", price: 1315, change: 42, trend: "up", lastUpdate: "1.5 hours ago" },

      // Maharashtra mandis
      { mandi: "Pune", state: "Maharashtra", price: 1280, change: 32, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Nashik", state: "Maharashtra", price: 1275, change: 30, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Aurangabad", state: "Maharashtra", price: 1285, change: 35, trend: "up", lastUpdate: "1.5 hours ago" },

      // Haryana mandis
      { mandi: "Karnal", state: "Haryana", price: 1330, change: 50, trend: "up", lastUpdate: "1 hour ago" },
      { mandi: "Panipat", state: "Haryana", price: 1325, change: 48, trend: "up", lastUpdate: "2 hours ago" },
      { mandi: "Ambala", state: "Haryana", price: 1335, change: 52, trend: "up", lastUpdate: "1.5 hours ago" },
    ],
  };

  const crops = [
    { value: "wheat", label: "Wheat (गेहूं)" },
    { value: "rice", label: "Rice (चावल)" },
    { value: "cotton", label: "Cotton (कपास)" },
    { value: "soybean", label: "Soybean (सोयाबीन)" },
    { value: "maize", label: "Maize (मक्का)" },
    { value: "sugarcane", label: "Sugarcane (गन्ना)" },
    { value: "onion", label: "Onion (प्याज)" },
    { value: "potato", label: "Potato (आलू)" },
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
                    <SelectItem value="Andhra Pradesh">Andhra Pradesh</SelectItem>
                    <SelectItem value="Bihar">Bihar</SelectItem>
                    <SelectItem value="Chhattisgarh">Chhattisgarh</SelectItem>
                    <SelectItem value="Gujarat">Gujarat</SelectItem>
                    <SelectItem value="Haryana">Haryana</SelectItem>
                    <SelectItem value="Karnataka">Karnataka</SelectItem>
                    <SelectItem value="Madhya Pradesh">Madhya Pradesh</SelectItem>
                    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="Odisha">Odisha</SelectItem>
                    <SelectItem value="Punjab">Punjab</SelectItem>
                    <SelectItem value="Rajasthan">Rajasthan</SelectItem>
                    <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                    <SelectItem value="Telangana">Telangana</SelectItem>
                    <SelectItem value="Uttar Pradesh">Uttar Pradesh</SelectItem>
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