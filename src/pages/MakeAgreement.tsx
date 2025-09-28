import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  ArrowLeft, 
  FileText, 
  Users, 
  MapPin, 
  Calendar,
  PenTool,
  CheckCircle,
  User,
  Sprout,
  Building2,
  Phone,
  Mail,
  CreditCard,
  AlertCircle
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
// Note: SignatureCanvas will be installed separately

const MakeAgreement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const landId = searchParams.get('landId');
  
  const [selectedLand, setSelectedLand] = useState(null);
  
  const [formData, setFormData] = useState({
    // Farmer Information
    farmerName: '',
    farmerPhone: '',
    farmerEmail: '',
    farmerAddress: '',
    farmerAadhaar: '',
    farmerExperience: '',
    
    // Landowner Information
    landownerName: '',
    landownerPhone: '',
    landownerEmail: '',
    landownerAddress: '',
    landownerAadhaar: '',
    
    // Land Information
    landLocation: '',
    landArea: '',
    landType: '',
    soilType: '',
    waterSource: '',
    landValue: '',
    
    // Agreement Information
    agreementType: '',
    cropType: '',
    duration: '',
    startDate: '',
    endDate: '',
    sharePercentage: '',
    rentAmount: '',
    advanceAmount: '',
    terms: '',
    responsibilities: '',
    
    // Legal Information
    witnessName: '',
    witnessPhone: '',
    agreesToTerms: false,
    farmerSignature: null,
    landownerSignature: null
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3; // Simplified: Farmer Info -> Agreement Terms -> Signatures
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default/sample land listings data (same as in Land.tsx)
  const defaultListings = [
    {
      id: 9001,
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
      area: "5 acres",
      suitable: "Cotton, Soybean, Wheat",
      status: "available",
      ownerName: "Rajesh Patil",
      ownerPhone: "+91 9876543210",
      ownerEmail: "rajesh.patil@example.com"
    },
    {
      id: 9002,
      title: "10 Acres Fertile Land",
      location: "Sangli, Maharashtra", 
      district: "Sangli",
      state: "Maharashtra",
      priceModel: "sharing",
      price: null,
      sharingModel: "60-40%",
      water: "River irrigation",
      electricity: "Available",
      soil: "Alluvial soil",
      area: "10 acres",
      suitable: "Sugarcane, Wheat, Onion",
      status: "available",
      ownerName: "Sunita Deshmukh",
      ownerPhone: "+91 9876543211",
      ownerEmail: "sunita.deshmukh@example.com"
    },
    {
      id: 9003,
      title: "3 Acres Organic Farm",
      location: "Kolhapur, Maharashtra",
      district: "Kolhapur", 
      state: "Maharashtra",
      priceModel: "fixed",
      price: "₹18,000/acre/year",
      sharingModel: null,
      water: "Drip irrigation",
      electricity: "Solar powered",
      soil: "Red laterite soil",
      area: "3 acres",
      suitable: "Organic vegetables, Spices",
      status: "available",
      ownerName: "Amit Kadam",
      ownerPhone: "+91 9876543212", 
      ownerEmail: "amit.kadam@example.com"
    }
  ];

  // Fetch land data when component mounts
  useEffect(() => {
    if (landId) {
      // First try to find in default listings
      const foundLand = defaultListings.find(land => land.id === parseInt(landId));
      
      if (foundLand) {
        setSelectedLand(foundLand);
        // Pre-fill form data with land information
        setFormData(prev => ({
          ...prev,
          landLocation: foundLand.location,
          landArea: foundLand.area,
          landType: foundLand.suitable,
          soilType: foundLand.soil,
          waterSource: foundLand.water,
          landownerName: foundLand.ownerName || '',
          landownerPhone: foundLand.ownerPhone || '',
          landownerEmail: foundLand.ownerEmail || '',
        }));
      } else {
        // Try to fetch from API
        fetchLandFromAPI(landId);
      }
    }
  }, [landId]);

  const fetchLandFromAPI = async (landId) => {
    try {
      const response = await fetch(`http://localhost:5001/api/lands/${landId}`);
      if (response.ok) {
        const landData = await response.json();
        setSelectedLand(landData);
        // Pre-fill form data with API land information
        setFormData(prev => ({
          ...prev,
          landLocation: landData.location || landData.district + ", " + landData.state,
          landArea: landData.area + " acres",
          landType: landData.cropTypes?.join(", ") || landData.suitable,
          soilType: landData.soilType,
          waterSource: landData.waterAvailability,
          landownerName: landData.ownerName || '',
          landownerPhone: landData.ownerPhone || '',
          landownerEmail: landData.ownerEmail || '',
        }));
      }
    } catch (error) {
      console.error('Error fetching land data:', error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Signature handling simplified for digital signatures

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation - Only check farmer info and agreement terms
    if (!formData.farmerName || !formData.agreementType) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.agreesToTerms) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the terms and conditions.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Signatures are already saved in formData via text inputs

      // Send to backend API
      const token = localStorage.getItem('userToken');
      const response = await fetch('http://localhost:5001/api/agreements/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          status: 'pending',
          createdAt: new Date().toISOString()
        })
      });

      const result = await response.json();
      
      if (result.success) {
        toast({
          title: "Agreement Created Successfully! ✅",
          description: "Your agreement has been submitted and is pending review.",
        });
        
        // Redirect to a success page or back to land page
        setTimeout(() => {
          navigate('/land');
        }, 2000);
      } else {
        throw new Error(result.message || 'Failed to create agreement');
      }
      
    } catch (error) {
      console.error('Agreement creation error:', error);
      toast({
        title: "Failed to Create Agreement",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStepTitle = (step) => {
    switch (step) {
      case 1: return "Farmer Information";
      case 2: return "Landowner Information";
      case 3: return "Land Details";
      case 4: return "Agreement Terms";
      case 5: return "Signatures & Review";
      default: return "Agreement Form";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/land')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Find Land
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                <FileText className="text-white h-4 w-4" />
              </div>
              <span className="font-semibold text-gray-900">Create Land Agreement</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              {getStepTitle(currentStep)}
            </h1>
            <Badge variant="outline">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* Step 1: Farmer Information */}
          {currentStep === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Farmer Information
                </CardTitle>
                <CardDescription>
                  Please provide farmer details for the agreement
                </CardDescription>
                {selectedLand && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                    <p className="text-sm text-green-800">
                      ✓ Creating agreement for: <strong>{selectedLand.title}</strong> in {selectedLand.location}
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      Land and landowner information will be automatically filled in the next steps.
                    </p>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="farmerName">Full Name *</Label>
                    <Input
                      id="farmerName"
                      value={formData.farmerName}
                      onChange={(e) => handleInputChange('farmerName', e.target.value)}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="farmerPhone">Phone Number *</Label>
                    <Input
                      id="farmerPhone"
                      value={formData.farmerPhone}
                      onChange={(e) => handleInputChange('farmerPhone', e.target.value)}
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="farmerEmail">Email Address</Label>
                    <Input
                      id="farmerEmail"
                      type="email"
                      value={formData.farmerEmail}
                      onChange={(e) => handleInputChange('farmerEmail', e.target.value)}
                      placeholder="Enter email address"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="farmerAadhaar">Aadhaar Number *</Label>
                    <Input
                      id="farmerAadhaar"
                      value={formData.farmerAadhaar}
                      onChange={(e) => handleInputChange('farmerAadhaar', e.target.value)}
                      placeholder="Enter 12-digit Aadhaar number"
                      maxLength={12}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="farmerAddress">Address *</Label>
                  <Textarea
                    id="farmerAddress"
                    value={formData.farmerAddress}
                    onChange={(e) => handleInputChange('farmerAddress', e.target.value)}
                    placeholder="Enter complete address"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="farmerExperience">Farming Experience</Label>
                  <Input
                    id="farmerExperience"
                    value={formData.farmerExperience}
                    onChange={(e) => handleInputChange('farmerExperience', e.target.value)}
                    placeholder="Years of farming experience"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Agreement Terms */}
          {currentStep === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Agreement Terms
                </CardTitle>
                <CardDescription>
                  Define the terms and conditions of the agreement
                </CardDescription>
                {selectedLand && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                    <p className="text-sm text-blue-800">
                      ✓ Creating agreement for: <strong>{selectedLand.title}</strong> at {selectedLand.location}
                    </p>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="agreementType">Agreement Type *</Label>
                    <Select onValueChange={(value) => handleInputChange('agreementType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select agreement type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="crop-sharing">Crop Sharing</SelectItem>
                        <SelectItem value="fixed-rent">Fixed Rent</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="lease">Lease Agreement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cropType">Crop Type</Label>
                    <Input
                      id="cropType"
                      value={formData.cropType}
                      onChange={(e) => handleInputChange('cropType', e.target.value)}
                      placeholder="Enter crop type (e.g., Rice, Wheat)"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (months) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder="Enter duration in months"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      required
                    />
                  </div>
                  
                  {formData.agreementType === 'crop-sharing' && (
                    <div className="space-y-2">
                      <Label htmlFor="sharePercentage">Farmer's Share (%)</Label>
                      <Input
                        id="sharePercentage"
                        type="number"
                        max="100"
                        value={formData.sharePercentage}
                        onChange={(e) => handleInputChange('sharePercentage', e.target.value)}
                        placeholder="Enter percentage (e.g., 70)"
                      />
                    </div>
                  )}
                  
                  {formData.agreementType === 'fixed-rent' && (
                    <div className="space-y-2">
                      <Label htmlFor="rentAmount">Rent Amount (₹)</Label>
                      <Input
                        id="rentAmount"
                        type="number"
                        value={formData.rentAmount}
                        onChange={(e) => handleInputChange('rentAmount', e.target.value)}
                        placeholder="Enter rent amount"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="advanceAmount">Advance Amount (₹)</Label>
                    <Input
                      id="advanceAmount"
                      type="number"
                      value={formData.advanceAmount}
                      onChange={(e) => handleInputChange('advanceAmount', e.target.value)}
                      placeholder="Enter advance amount if any"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="terms">Terms and Conditions</Label>
                  <Textarea
                    id="terms"
                    value={formData.terms}
                    onChange={(e) => handleInputChange('terms', e.target.value)}
                    placeholder="Enter specific terms and conditions"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="responsibilities">Responsibilities</Label>
                  <Textarea
                    id="responsibilities"
                    value={formData.responsibilities}
                    onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                    placeholder="Define responsibilities of farmer and landowner"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="witnessName">Witness Name</Label>
                  <Input
                    id="witnessName"
                    value={formData.witnessName}
                    onChange={(e) => handleInputChange('witnessName', e.target.value)}
                    placeholder="Enter witness name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="witnessPhone">Witness Phone</Label>
                  <Input
                    id="witnessPhone"
                    value={formData.witnessPhone}
                    onChange={(e) => handleInputChange('witnessPhone', e.target.value)}
                    placeholder="Enter witness phone number"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Land Details - HIDDEN */}
          {false && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Land Details
                </CardTitle>
                <CardDescription>
                  {selectedLand ? 
                    `Land details have been pre-filled from the selected listing. Please verify and update if needed.` :
                    "Please provide information about the land"
                  }
                </CardDescription>
                {selectedLand && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                    <p className="text-sm text-blue-800">
                      ✓ Land details loaded from: <strong>{selectedLand.title}</strong>
                    </p>
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="landLocation">Land Location *</Label>
                    <Input
                      id="landLocation"
                      value={formData.landLocation}
                      onChange={(e) => handleInputChange('landLocation', e.target.value)}
                      placeholder="Enter land location"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="landArea">Land Area (in acres) *</Label>
                    <Input
                      id="landArea"
                      type="number"
                      value={formData.landArea}
                      onChange={(e) => handleInputChange('landArea', e.target.value)}
                      placeholder="Enter area in acres"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="landType">Land Type *</Label>
                    <Select onValueChange={(value) => handleInputChange('landType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select land type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agricultural">Agricultural</SelectItem>
                        <SelectItem value="irrigated">Irrigated</SelectItem>
                        <SelectItem value="dry">Dry Land</SelectItem>
                        <SelectItem value="organic">Organic Certified</SelectItem>
                        <SelectItem value="mixed">Mixed Use</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="soilType">Soil Type</Label>
                    <Select onValueChange={(value) => handleInputChange('soilType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select soil type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="clay">Clay</SelectItem>
                        <SelectItem value="loam">Loam</SelectItem>
                        <SelectItem value="sandy">Sandy</SelectItem>
                        <SelectItem value="silt">Silt</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="waterSource">Water Source</Label>
                    <Select onValueChange={(value) => handleInputChange('waterSource', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select water source" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="borewell">Borewell</SelectItem>
                        <SelectItem value="canal">Canal</SelectItem>
                        <SelectItem value="river">River</SelectItem>
                        <SelectItem value="rainwater">Rainwater</SelectItem>
                        <SelectItem value="multiple">Multiple Sources</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="landValue">Estimated Land Value (₹)</Label>
                    <Input
                      id="landValue"
                      type="number"
                      value={formData.landValue}
                      onChange={(e) => handleInputChange('landValue', e.target.value)}
                      placeholder="Enter estimated value"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Agreement Terms - REMOVED */}
          {false && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Agreement Terms
                </CardTitle>
                <CardDescription>
                  Define the terms and conditions of the agreement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="agreementType">Agreement Type *</Label>
                    <Select onValueChange={(value) => handleInputChange('agreementType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select agreement type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="crop-sharing">Crop Sharing</SelectItem>
                        <SelectItem value="fixed-rent">Fixed Rent</SelectItem>
                        <SelectItem value="partnership">Partnership</SelectItem>
                        <SelectItem value="lease">Lease Agreement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cropType">Crop Type</Label>
                    <Input
                      id="cropType"
                      value={formData.cropType}
                      onChange={(e) => handleInputChange('cropType', e.target.value)}
                      placeholder="Enter crop type (e.g., Rice, Wheat)"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (months) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      placeholder="Enter duration in months"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      required
                    />
                  </div>
                  
                  {formData.agreementType === 'crop-sharing' && (
                    <div className="space-y-2">
                      <Label htmlFor="sharePercentage">Farmer's Share (%)</Label>
                      <Input
                        id="sharePercentage"
                        type="number"
                        max="100"
                        value={formData.sharePercentage}
                        onChange={(e) => handleInputChange('sharePercentage', e.target.value)}
                        placeholder="Enter percentage (e.g., 70)"
                      />
                    </div>
                  )}
                  
                  {formData.agreementType === 'fixed-rent' && (
                    <div className="space-y-2">
                      <Label htmlFor="rentAmount">Rent Amount (₹)</Label>
                      <Input
                        id="rentAmount"
                        type="number"
                        value={formData.rentAmount}
                        onChange={(e) => handleInputChange('rentAmount', e.target.value)}
                        placeholder="Enter rent amount"
                      />
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="advanceAmount">Advance Amount (₹)</Label>
                    <Input
                      id="advanceAmount"
                      type="number"
                      value={formData.advanceAmount}
                      onChange={(e) => handleInputChange('advanceAmount', e.target.value)}
                      placeholder="Enter advance amount if any"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="terms">Terms and Conditions</Label>
                  <Textarea
                    id="terms"
                    value={formData.terms}
                    onChange={(e) => handleInputChange('terms', e.target.value)}
                    placeholder="Enter specific terms and conditions"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="responsibilities">Responsibilities</Label>
                  <Textarea
                    id="responsibilities"
                    value={formData.responsibilities}
                    onChange={(e) => handleInputChange('responsibilities', e.target.value)}
                    placeholder="Define responsibilities of farmer and landowner"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="witnessName">Witness Name</Label>
                  <Input
                    id="witnessName"
                    value={formData.witnessName}
                    onChange={(e) => handleInputChange('witnessName', e.target.value)}
                    placeholder="Enter witness name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="witnessPhone">Witness Phone</Label>
                  <Input
                    id="witnessPhone"
                    value={formData.witnessPhone}
                    onChange={(e) => handleInputChange('witnessPhone', e.target.value)}
                    placeholder="Enter witness phone number"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Signatures & Review */}
          {currentStep === 3 && (
            <div className="space-y-6">
              {/* Agreement Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Agreement Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div><strong>Farmer:</strong> {formData.farmerName}</div>
                    <div><strong>Landowner:</strong> {formData.landownerName}</div>
                    <div><strong>Land Location:</strong> {formData.landLocation}</div>
                    <div><strong>Land Area:</strong> {formData.landArea} acres</div>
                    <div><strong>Agreement Type:</strong> {formData.agreementType}</div>
                    <div><strong>Duration:</strong> {formData.duration} months</div>
                    <div><strong>Start Date:</strong> {formData.startDate}</div>
                    <div><strong>End Date:</strong> {formData.endDate}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Signatures */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PenTool className="h-5 w-5" />
                      Farmer Signature
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 min-h-[150px] flex items-center justify-center">
                      <div className="text-center">
                        <PenTool className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500 mb-4">Click to add digital signature</p>
                        <Input
                          placeholder="Type your full name to sign"
                          value={formData.farmerSignature || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, farmerSignature: e.target.value }))}
                          className="text-center font-script text-lg"
                        />
                        <p className="text-xs text-gray-400 mt-2">By typing your name, you agree to sign digitally</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PenTool className="h-5 w-5" />
                      Landowner Signature
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="border-2 border-gray-300 rounded-lg p-4 bg-gray-50 min-h-[150px] flex items-center justify-center">
                      <div className="text-center">
                        <PenTool className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500 mb-4">Click to add digital signature</p>
                        <Input
                          placeholder="Type your full name to sign"
                          value={formData.landownerSignature || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, landownerSignature: e.target.value }))}
                          className="text-center font-script text-lg"
                        />
                        <p className="text-xs text-gray-400 mt-2">By typing your name, you agree to sign digitally</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Terms Agreement */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="agreesToTerms"
                      checked={formData.agreesToTerms}
                      onCheckedChange={(checked) => handleInputChange('agreesToTerms', checked)}
                    />
                    <Label htmlFor="agreesToTerms" className="text-sm">
                      I agree to the terms and conditions stated in this agreement and confirm that all information provided is accurate.
                    </Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
            >
              Previous
            </Button>
            
            <div className="text-sm text-gray-500">
              Step {currentStep} of {totalSteps}
            </div>
            
            {currentStep < totalSteps ? (
              <Button
                type="button"
                onClick={nextStep}
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Creating Agreement...' : 'Create Agreement'}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default MakeAgreement;