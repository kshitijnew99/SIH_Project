import { useState, useEffect } from "react";
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
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "National Capital Territory of Delhi",
  "Puducherry"
];

const districtsByState: { [key: string]: string[] } = {
  "Andhra Pradesh": [
    "Alluri Sitharama Raju",
    "Anakapalli",
    "Ananthapuramu",
    "Annamayya",
    "Bapatla",
    "Chittoor",
    "Dr. B.R. Ambedkar Konaseema",
    "East Godavari",
    "Eluru",
    "Guntur",
    "Kakinada",
    "Krishna",
    "Kurnool",
    "Nandyal",
    "NTR",
    "Palnadu",
    "Parvathipuram Manyam",
    "Prakasam",
    "Srikakulam",
    "Sri Potti Sriramulu Nellore",
    "Sri Sathya Sai",
    "Tirupati",
    "Visakhapatnam",
    "Vizianagaram",
    "West Godavari",
    "YSR"
  ],
  "Arunachal Pradesh": [
    "Anjaw",
    "Changlang",
    "East Kameng",
    "East Siang",
    "Itanagar capital complex",
    "Kamle",
    "Kra Daadi",
    "Kurung Kumey",
    "Lepa Rada",
    "Lohit",
    "Longding",
    "Lower Dibang Valley",
    "Lower Siang",
    "Lower Subansiri",
    "Namsai",
    "Pakke-Kessang",
    "Papum Pare",
    "Shi Yomi",
    "Siang",
    "Tawang",
    "Tirap",
    "Upper Dibang Valley",
    "Upper Siang",
    "Upper Subansiri",
    "West Kameng",
    "West Siang"
  ],
  "Assam": [
    "Baksa",
    "Barpeta",
    "Bongaigaon",
    "Cachar",
    "Charaideo",
    "Chirang",
    "Darrang",
    "Dhemaji",
    "Dhubri",
    "Dibrugarh",
    "Dima Hasao",
    "Goalpara",
    "Golaghat",
    "Hailakandi",
    "Jorhat",
    "Kamrup",
    "Kamrup Metropolitan",
    "Karbi Anglong",
    "Karimganj",
    "Kokrajhar",
    "Lakhimpur",
    "Majuli",
    "Morigaon",
    "Nagaon",
    "Nalbari",
    "Sivasagar",
    "Sonitpur",
    "South Salmara Mankachar",
    "Tinsukia",
    "Udalguri",
    "West Karbi Anglong"
  ],
  "Bihar": [
    "Araria",
    "Arwal",
    "Aurangabad",
    "Banka",
    "Begusarai",
    "Bhagalpur",
    "Bhojpur",
    "Buxar",
    "Darbhanga",
    "East Champaran",
    "Gaya",
    "Gopalganj",
    "Jamui",
    "Jehanabad",
    "Kaimur",
    "Katihar",
    "Khagaria",
    "Kishanganj",
    "Lakhisarai",
    "Madhepura",
    "Madhubani",
    "Munger",
    "Muzaffarpur",
    "Nalanda",
    "Nawada",
    "Patna",
    "Purnia",
    "Rohtas",
    "Saharsa",
    "Samastipur",
    "Saran",
    "Sheikhpura",
    "Sheohar",
    "Sitamarhi",
    "Siwan",
    "Supaul",
    "Vaishali",
    "West Champaran"
  ],
  "Chhattisgarh": [
    "Balod",
    "Baloda Bazar",
    "Balrampur-Ramanujganj",
    "Bastar",
    "Bemetara",
    "Bijapur",
    "Bilaspur",
    "Dantewada",
    "Dhamtari",
    "Durg",
    "Gariaband",
    "Gaurela-Pendra-Marwahi",
    "Janjgir-Champa",
    "Jashpur",
    "Kabirdham",
    "Kanker",
    "Khairagarh-Chhuikhadan-Gandai",
    "Kondagaon",
    "Korba",
    "Korea",
    "Mahasamund",
    "Manendragarh-Chirmiri-Bharatpur",
    "Mohla-Manpur-Ambagarh Chowki",
    "Mungeli",
    "Narayanpur",
    "Raigarh",
    "Raipur",
    "Rajnandgaon",
    "Sarangarh-Bilaigarh",
    "Shakti",
    "Sukma",
    "Surajpur",
    "Surguja"
  ],
  "Goa": [
    "North Goa",
    "South Goa"
  ],
  "Gujarat": [
    "Ahmedabad",
    "Amreli",
    "Anand",
    "Aravalli",
    "Banaskantha",
    "Bharuch",
    "Bhavnagar",
    "Botad",
    "Chhota Udaipur",
    "Dahod",
    "Dang",
    "Devbhumi Dwarka",
    "Gandhinagar",
    "Gir Somnath",
    "Jamnagar",
    "Junagadh",
    "Kheda",
    "Kutch",
    "Mahisagar",
    "Mehsana",
    "Morbi",
    "Narmada",
    "Navsari",
    "Panchmahal",
    "Patan",
    "Porbandar",
    "Rajkot",
    "Sabarkantha",
    "Surat",
    "Surendranagar",
    "Tapi",
    "Vadodara",
    "Valsad"
  ],
  "Haryana": [
    "Ambala",
    "Bhiwani",
    "Charkhi Dadri",
    "Faridabad",
    "Fatehabad",
    "Gurugram",
    "Hisar",
    "Jhajjar",
    "Jind",
    "Kaithal",
    "Karnal",
    "Kurukshetra",
    "Mahendragarh",
    "Nuh",
    "Palwal",
    "Panchkula",
    "Panipat",
    "Rewari",
    "Rohtak",
    "Sirsa",
    "Sonipat",
    "Yamunanagar"
  ],
  "Himachal Pradesh": [
    "Bilaspur",
    "Chamba",
    "Hamirpur",
    "Kangra",
    "Kinnaur",
    "Kullu",
    "Lahaul and Spiti",
    "Mandi",
    "Shimla",
    "Sirmaur",
    "Solan",
    "Una"
  ],
  "Jharkhand": [
    "Bokaro",
    "Chatra",
    "Deoghar",
    "Dhanbad",
    "Dumka",
    "East Singhbhum",
    "Garhwa",
    "Giridih",
    "Godda",
    "Gumla",
    "Hazaribag",
    "Jamtara",
    "Khunti",
    "Koderma",
    "Latehar",
    "Lohardaga",
    "Pakur",
    "Palamu",
    "Ramgarh",
    "Ranchi",
    "Sahibganj",
    "Seraikela-Kharsawan",
    "Simdega",
    "West Singhbhum"
  ],
  "Karnataka": [
    "Bagalakote",
    "Ballari",
    "Belagavi",
    "Bengaluru Rural",
    "Bengaluru Urban",
    "Bidar",
    "Chamarajanagara",
    "Chikkaballapura",
    "Chikkamagaluru",
    "Chitradurga",
    "Dakshina Kannada",
    "Davanagere",
    "Dharwada",
    "Gadaga",
    "Kalaburagi",
    "Hassan",
    "Haveri",
    "Kodagu",
    "Kolar",
    "Koppala",
    "Mandya",
    "Mysuru",
    "Raichuru",
    "Ramanagara",
    "Shivamogga",
    "Tumakuru",
    "Udupi",
    "Uttara Kannada",
    "Vijayanagara",
    "Vijayapura",
    "Yadgiri"
  ],
  "Kerala": [
    "Alappuzha",
    "Ernakulam",
    "Idukki",
    "Kannur",
    "Kasaragod",
    "Kollam",
    "Kottayam",
    "Kozhikode",
    "Malappuram",
    "Palakkad",
    "Pathanamthitta",
    "Thiruvananthapuram",
    "Thrissur",
    "Wayanad"
  ],
  "Madhya Pradesh": [
    "Agar Malwa",
    "Alirajpur",
    "Anuppur",
    "Ashoknagar",
    "Balaghat",
    "Barwani",
    "Betul",
    "Bhind",
    "Bhopal",
    "Burhanpur",
    "Chhatarpur",
    "Chhindwara",
    "Damoh",
    "Datia",
    "Dewas",
    "Dhar",
    "Dindori",
    "Guna",
    "Gwalior",
    "Harda",
    "Hoshangabad",
    "Indore",
    "Jabalpur",
    "Jhabua",
    "Katni",
    "Khandwa",
    "Khargone",
    "Mandla",
    "Mandsaur",
    "Morena",
    "Narsinghpur",
    "Neemuch",
    "Niwari",
    "Panna",
    "Raisen",
    "Rajgarh",
    "Ratlam",
    "Rewa",
    "Sagar",
    "Satna",
    "Sehore",
    "Seoni",
    "Shahdol",
    "Shajapur",
    "Sheopur",
    "Shivpuri",
    "Sidhi",
    "Singrauli",
    "Tikamgarh",
    "Ujjain",
    "Umaria",
    "Vidisha"
  ],
  "Maharashtra": [
    "Ahmednagar",
    "Akola",
    "Amravati",
    "Beed",
    "Bhandara",
    "Buldhana",
    "Chandrapur",
    "Osmanabad",
    "Dhule",
    "Gadchiroli",
    "Gondia",
    "Hingoli",
    "Jalgaon",
    "Jalna",
    "Kolhapur",
    "Latur",
    "Mumbai City",
    "Mumbai Suburban",
    "Nanded",
    "Nandurbar",
    "Nagpur",
    "Nashik",
    "Palghar",
    "Parbhani",
    "Pune",
    "Raigad",
    "Ratnagiri",
    "Aurangabad",
    "Sangli",
    "Satara",
    "Sindhudurg",
    "Solapur",
    "Thane",
    "Wardha",
    "Washim",
    "Yavatmal"
  ],
  "Manipur": [
    "Bishnupur",
    "Chandel",
    "Churachandpur",
    "Imphal East",
    "Imphal West",
    "Jiribam",
    "Kakching",
    "Kamjong",
    "Kangpokpi",
    "Noney",
    "Pherzawl",
    "Senapati",
    "Tamenglong",
    "Tengnoupal",
    "Thoubal",
    "Ukhrul"
  ],
  "Meghalaya": [
    "East Garo Hills",
    "East Khasi Hills",
    "East Jaintia Hills",
    "Eastern West Khasi Hills",
    "North Garo Hills",
    "Ri Bhoi",
    "South Garo Hills",
    "South West Garo Hills",
    "South West Khasi Hills",
    "West Garo Hills",
    "West Jaintia Hills",
    "West Khasi Hills"
  ],
  "Mizoram": [
    "Aizawl",
    "Champhai",
    "Hnahthial",
    "Khawzawl",
    "Kolasib",
    "Lawngtlai",
    "Lunglei",
    "Mamit",
    "Saiha",
    "Saitual",
    "Serchhip"
  ],
  "Nagaland": [
    "Chümoukedima",
    "Dimapur",
    "Kiphire",
    "Kohima",
    "Longleng",
    "Mokokchung",
    "Mon",
    "Niuland",
    "Noklak",
    "Peren",
    "Phek",
    "Shamator",
    "Tseminyü",
    "Tuensang",
    "Wokha",
    "Zunheboto"
  ],
  "Odisha": [
    "Angul",
    "Boudh",
    "Bhadrak",
    "Balangir",
    "Bargarh",
    "Balasore",
    "Cuttack",
    "Debagarh",
    "Dhenkanal",
    "Ganjam",
    "Gajapati",
    "Jharsuguda",
    "Jajpur",
    "Jagatsinghpur",
    "Khordha",
    "Kendujhar",
    "Kalahandi",
    "Kandhamal",
    "Koraput",
    "Kendrapara",
    "Malkangiri",
    "Mayurbhanj",
    "Nabarangpur",
    "Nuapada",
    "Nayagarh",
    "Puri",
    "Rayagada",
    "Sambalpur",
    "Subarnapur",
    "Sundargarh"
  ],
  "Punjab": [
    "Amritsar",
    "Barnala",
    "Bathinda",
    "Firozpur",
    "Faridkot",
    "Fatehgarh Sahib",
    "Fazilka",
    "Gurdaspur",
    "Hoshiarpur",
    "Jalandhar",
    "Kapurthala",
    "Ludhiana",
    "Malerkotla",
    "Mansa",
    "Moga",
    "Sri Muktsar Sahib",
    "Pathankot",
    "Patiala",
    "Rupnagar",
    "Sahibzada Ajit Singh Nagar",
    "Sangrur",
    "Shahid Bhagat Singh Nagar",
    "Tarn Taran"
  ],
  "Rajasthan": [
    "Ajmer",
    "Alwar",
    "Bikaner",
    "Barmer",
    "Banswara",
    "Bharatpur",
    "Baran",
    "Bundi",
    "Bhilwara",
    "Churu",
    "Chittorgarh",
    "Dausa",
    "Dholpur",
    "Dungarpur",
    "Sri Ganganagar",
    "Hanumangarh",
    "Jhunjhunu",
    "Jalore",
    "Jodhpur",
    "Jaipur",
    "Jaisalmer",
    "Jhalawar",
    "Karauli",
    "Kota",
    "Nagaur",
    "Pali",
    "Pratapgarh",
    "Rajsamand",
    "Sikar",
    "Sawai Madhopur",
    "Sirohi",
    "Tonk",
    "Udaipur"
  ],
  "Sikkim": [
    "East Sikkim",
    "North Sikkim",
    "Pakyong",
    "Soreng",
    "South Sikkim",
    "West Sikkim"
  ],
  "Tamil Nadu": [
    "Ariyalur",
    "Chengalpattu",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Kanchipuram",
    "Kanyakumari",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Mayiladuthurai",
    "Nagapattinam",
    "Nilgiris",
    "Namakkal",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Ranipet",
    "Salem",
    "Sivaganga",
    "Tenkasi",
    "Tiruppur",
    "Tiruchirappalli",
    "Theni",
    "Tirunelveli",
    "Thanjavur",
    "Thoothukudi",
    "Tirupattur",
    "Tiruvallur",
    "Tiruvarur",
    "Tiruvannamalai",
    "Vellore",
    "Viluppuram",
    "Virudhunagar"
  ],
  "Telangana": [
    "Adilabad",
    "Bhadradri Kothagudem",
    "Hanamkonda",
    "Hyderabad",
    "Jagtial",
    "Jangaon",
    "Jayashankar Bhupalpally",
    "Jogulamba Gadwal",
    "Kamareddy",
    "Karimnagar",
    "Khammam",
    "Kumuram Bheem Asifabad",
    "Mahabubabad",
    "Mahbubnagar",
    "Mancherial",
    "Medak",
    "Medchal–Malkajgiri",
    "Mulugu",
    "Nalgonda",
    "Narayanpet",
    "Nagarkurnool",
    "Nirmal",
    "Nizamabad",
    "Peddapalli",
    "Rajanna Sircilla",
    "Ranga Reddy",
    "Sangareddy",
    "Siddipet",
    "Suryapet",
    "Vikarabad",
    "Wanaparthy",
    "Warangal",
    "Yadadri Bhuvanagiri"
  ],
  "Tripura": [
    "Dhalai",
    "Gomati",
    "Khowai",
    "North Tripura",
    "Sepahijala",
    "South Tripura",
    "Unakoti",
    "West Tripura"
  ],
  "Uttar Pradesh": [
    "Agra",
    "Aligarh",
    "Ambedkar Nagar",
    "Amethi",
    "Amroha",
    "Auraiya",
    "Ayodhya",
    "Azamgarh",
    "Bagpat",
    "Bahraich",
    "Ballia",
    "Balrampur",
    "Banda",
    "Barabanki",
    "Bareilly",
    "Basti",
    "Bhadohi",
    "Bijnor",
    "Budaun",
    "Bulandshahr",
    "Chandauli",
    "Chitrakoot",
    "Deoria",
    "Etah",
    "Etawah",
    "Farrukhabad",
    "Fatehpur",
    "Firozabad",
    "Gautam Buddha Nagar",
    "Ghaziabad",
    "Ghazipur",
    "Gonda",
    "Gorakhpur",
    "Hamirpur",
    "Hapur",
    "Hardoi",
    "Hathras",
    "Jalaun",
    "Jaunpur",
    "Jhansi",
    "Kannauj",
    "Kanpur Dehat",
    "Kanpur Nagar",
    "Kasganj",
    "Kaushambi",
    "Kushinagar",
    "Lakhimpur Kheri",
    "Lalitpur",
    "Lucknow",
    "Maharajganj",
    "Mahoba",
    "Mainpuri",
    "Mathura",
    "Mau",
    "Meerut",
    "Mirzapur",
    "Moradabad",
    "Muzaffarnagar",
    "Pilibhit",
    "Pratapgarh",
    "Prayagraj",
    "Raebareli",
    "Rampur",
    "Saharanpur",
    "Sambhal",
    "Sant Kabir Nagar",
    "Shahjahanpur",
    "Shamli",
    "Shravasti",
    "Siddharthnagar",
    "Sitapur",
    "Sonbhadra",
    "Sultanpur",
    "Unnao",
    "Varanasi"
  ],
  "Uttarakhand": [
    "Almora",
    "Bageshwar",
    "Chamoli",
    "Champawat",
    "Dehradun",
    "Haridwar",
    "Nainital",
    "Pauri Garhwal",
    "Pithoragarh",
    "Rudraprayag",
    "Tehri Garhwal",
    "Udham Singh Nagar",
    "Uttarkashi"
  ],
  "West Bengal": [
    "Alipurduar",
    "Bankura",
    "Birbhum",
    "Cooch Behar",
    "Dakshin Dinajpur",
    "Darjeeling",
    "Hooghly",
    "Howrah",
    "Jalpaiguri",
    "Jhargram",
    "Kalimpong",
    "Kolkata",
    "Maldah",
    "Murshidabad",
    "Nadia",
    "North 24 Parganas",
    "Paschim Bardhaman",
    "Paschim Medinipur",
    "Purba Bardhaman",
    "Purba Medinipur",
    "Purulia",
    "South 24 Parganas",
    "Uttar Dinajpur"
  ],
  "Andaman and Nicobar": [
    "Nicobar",
    "North and Middle Andaman",
    "South Andaman"
  ],
  "Chandigarh": [
    "Chandigarh"
  ],
  "Dadra and Nagar Haveli and Daman and Diu": [
    "Daman",
    "Diu",
    "Dadra and Nagar Haveli"
  ],
  "Jammu and Kashmir": [
    "Anantnag",
    "Budgam",
    "Bandipore",
    "Baramulla",
    "Doda",
    "Ganderbal",
    "Jammu",
    "Kathua",
    "Kishtwar",
    "Kulgam",
    "Kupwara",
    "Poonch",
    "Pulwama",
    "Rajouri",
    "Ramban",
    "Reasi",
    "Samba",
    "Shopian",
    "Srinagar",
    "Udhampur"
  ],
  "Ladakh": [
    "Kargil",
    "Leh"
  ],
  "Lakshadweep": [
    "Lakshadweep"
  ],
  "National Capital Territory of Delhi": [
    "Central Delhi",
    "East Delhi",
    "New Delhi",
    "North Delhi",
    "North East Delhi",
    "North West Delhi",
    "Shahdara district",
    "South Delhi",
    "South East Delhi",
    "South West Delhi",
    "West Delhi"
  ],
  "Puducherry": [
    "Karaikal",
    "Mahé",
    "Puducherry",
    "Yanam"
  ]
};

const Land = () => {
  const [filterState, setFilterState] = useState("all");
  const [filterDistrict, setFilterDistrict] = useState("all");
  const [priceModel, setPriceModel] = useState("fixed"); // "fixed" or "percentage"
  const [priceRange, setPriceRange] = useState("all");
  const [percentageShare, setPercentageShare] = useState("all");
  const [landListings, setLandListings] = useState([]);

  // Default/sample land listings data
  const defaultListings = [
    {
      id: 9001, // Using high IDs to avoid conflicts with user-added lands
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
      status: "available",
    },
    {
      id: 9002,
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
      status: "available",
    },
    {
      id: 9003,
      title: "3 Acres with Irrigation",
      location: "Pune, Maharashtra",
      district: "Pune",
      state: "Maharashtra",
      priceModel: "fixed",
      price: "₹25,000/acre/year",
      sharingModel: null,
      water: "Drip irrigation installed",
      electricity: "Available",
      soil: "Red soil",
      image: "/api/placeholder/400/300",
      area: "3 acres",
      suitable: "Vegetables, Flowers",
      status: "available",
    },
    {
      id: 9004,
      title: "7 Acres Prime Agricultural Land",
      location: "Amritsar, Punjab",
      district: "Amritsar",
      state: "Punjab",
      priceModel: "fixed",
      price: "₹30,000/acre/year",
      sharingModel: null,
      water: "Canal + Tube well",
      electricity: "Available 24/7",
      soil: "Loamy soil",
      image: "/api/placeholder/400/300",
      area: "7 acres",
      suitable: "Wheat, Rice, Vegetables",
      status: "available",
    },
    {
      id: 9005,
      title: "15 Acres Farm Land",
      location: "Indore, Madhya Pradesh",
      district: "Indore",
      state: "Madhya Pradesh",
      priceModel: "fixed",
      price: "₹18,000/acre/year",
      sharingModel: null,
      water: "Bore well",
      electricity: "Available",
      soil: "Black soil",
      image: "/api/placeholder/400/300",
      area: "15 acres",
      suitable: "Soybean, Wheat, Gram",
      status: "available",
    },
    {
      id: 9006,
      title: "4 Acres Organic Farm",
      location: "Coimbatore, Tamil Nadu",
      district: "Coimbatore",
      state: "Tamil Nadu",
      priceModel: "fixed",
      price: "₹22,000/acre/year",
      sharingModel: null,
      water: "Well + Rainwater harvesting",
      electricity: "Solar powered",
      soil: "Red loamy soil",
      image: "/api/placeholder/400/300",
      area: "4 acres",
      suitable: "Coconut, Banana, Vegetables",
      status: "available",
    },
  ];

  // Load land listings from localStorage and merge with defaults
  useEffect(() => {
    const storedListings = JSON.parse(localStorage.getItem('landListings') || '[]');
    const allListings = [...defaultListings, ...storedListings];
    setLandListings(allListings);
  }, []);

  const filteredListings = landListings.filter((land) => {
    // Only show available lands (not unlisted or rented)
    if (land.status !== 'available') return false;
    
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