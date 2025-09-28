import React, { useState } from 'react';
import { ArrowLeft, Plus, MapPin, Phone, Mail, Building2, Calendar, Users, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface ContactDetails {
  name: string;
  phone: string;
  email: string;
  office: string;
}

interface OpportunityFormData {
  opportunityName: string;
  state: string;
  district: string;
  selectedCrop: string;
  description: string;
  contactDetails: ContactDetails;
  organizationName: string;
  opportunityType: string;
  requirements: string;
  benefits: string;
  applicationDeadline: string;
  validFrom: string;
  validTo: string;
}

const indianStates = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 
  'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 
  'Uttarakhand', 'West Bengal'
];

const stateDistricts: { [key: string]: string[] } = {
  'Punjab': ['Amritsar', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Ferozepur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Kapurthala', 'Ludhiana', 'Mansa', 'Moga', 'Muktsar', 'Pathankot', 'Patiala', 'Rupnagar', 'Sangrur', 'SAS Nagar', 'Shaheed Bhagat Singh Nagar', 'Tarn Taran'],
  'Haryana': ['Ambala', 'Bhiwani', 'Charkhi Dadri', 'Faridabad', 'Fatehabad', 'Gurugram', 'Hisar', 'Jhajjar', 'Jind', 'Kaithal', 'Karnal', 'Kurukshetra', 'Mahendragarh', 'Nuh', 'Palwal', 'Panchkula', 'Panipat', 'Rewari', 'Rohtak', 'Sirsa', 'Sonipat', 'Yamunanagar'],
  'Gujarat': ['Ahmedabad', 'Amreli', 'Anand', 'Aravalli', 'Banaskantha', 'Bharuch', 'Bhavnagar', 'Botad', 'Chhota Udepur', 'Dahod', 'Dang', 'Devbhoomi Dwarka', 'Gandhinagar', 'Gir Somnath', 'Jamnagar', 'Junagadh', 'Kheda', 'Kutch', 'Mahisagar', 'Mehsana', 'Morbi', 'Narmada', 'Navsari', 'Panchmahal', 'Patan', 'Porbandar', 'Rajkot', 'Sabarkantha', 'Surat', 'Surendranagar', 'Tapi', 'Vadodara', 'Valsad'],
  'Maharashtra': ['Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Buldhana', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Gondia', 'Hingoli', 'Jalgaon', 'Jalna', 'Kolhapur', 'Latur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nandurbar', 'Nashik', 'Osmanabad', 'Palghar', 'Parbhani', 'Pune', 'Raigad', 'Ratnagiri', 'Sangli', 'Satara', 'Sindhudurg', 'Solapur', 'Thane', 'Wardha', 'Washim', 'Yavatmal'],
  'Uttar Pradesh': ['Agra', 'Aligarh', 'Allahabad', 'Ambedkar Nagar', 'Amethi', 'Amroha', 'Auraiya', 'Azamgarh', 'Baghpat', 'Bahraich', 'Ballia', 'Balrampur', 'Banda', 'Barabanki', 'Bareilly', 'Basti', 'Bhadohi', 'Bijnor', 'Budaun', 'Bulandshahr', 'Chandauli', 'Chitrakoot', 'Deoria', 'Etah', 'Etawah', 'Faizabad', 'Farrukhabad', 'Fatehpur', 'Firozabad', 'Gautam Buddha Nagar', 'Ghaziabad', 'Ghazipur', 'Gonda', 'Gorakhpur', 'Hamirpur', 'Hapur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur', 'Jhansi', 'Kannauj', 'Kanpur Dehat', 'Kanpur Nagar', 'Kasganj', 'Kaushambi', 'Kheri', 'Kushinagar', 'Lalitpur', 'Lucknow', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mathura', 'Mau', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Pilibhit', 'Pratapgarh', 'Raebareli', 'Rampur', 'Saharanpur', 'Sambhal', 'Sant Kabir Nagar', 'Shahjahanpur', 'Shamli', 'Shrawasti', 'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao', 'Varanasi']
};

const cropOptions = [
  'Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Maize', 'Bajra', 'Jowar', 'Barley', 
  'Gram', 'Tur/Arhar', 'Moong', 'Urad', 'Masoor', 'Groundnut', 'Sesame', 
  'Niger', 'Safflower', 'Sunflower', 'Soybean', 'Castor', 'Jute', 'Mesta'
];

const opportunityTypes = [
  { value: 'export-contract', label: 'Export Contract' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'government-scheme', label: 'Government Scheme' },
  { value: 'buyback-guarantee', label: 'Buyback Guarantee' },
  { value: 'processing-unit', label: 'Processing Unit' },
  { value: 'research-project', label: 'Research Project' },
  { value: 'training-program', label: 'Training Program' },
  { value: 'general', label: 'General Opportunity' }
];

const AddOpportunity: React.FC = () => {
  const [formData, setFormData] = useState<OpportunityFormData>({
    opportunityName: '',
    state: '',
    district: '',
    selectedCrop: '',
    description: '',
    contactDetails: {
      name: '',
      phone: '',
      email: '',
      office: ''
    },
    organizationName: '',
    opportunityType: 'general',
    requirements: '',
    benefits: '',
    applicationDeadline: '',
    validFrom: '',
    validTo: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
  const { toast } = useToast();

  const handleStateChange = (state: string) => {
    setFormData(prev => ({
      ...prev,
      state,
      district: '' // Reset district when state changes
    }));
    setAvailableDistricts(stateDistricts[state] || []);
  };

  const handleContactChange = (field: keyof ContactDetails, value: string) => {
    setFormData(prev => ({
      ...prev,
      contactDetails: {
        ...prev.contactDetails,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.opportunityName || !formData.state || !formData.district || !formData.selectedCrop || !formData.description) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      if (!formData.contactDetails.name || !formData.contactDetails.phone) {
        toast({
          title: "Contact Details Required",
          description: "Contact name and phone are required",
          variant: "destructive",
        });
        return;
      }

      const token = localStorage.getItem('userToken');
      console.log('Token found:', token ? 'Yes' : 'No', token ? token.substring(0, 10) + '...' : 'None');
      
      if (!token) {
        toast({
          title: "Authentication Error",
          description: "Please login to continue",
          variant: "destructive",
        });
        return;
      }

      console.log('Sending request to create opportunity with data:', formData);

      const response = await fetch('http://localhost:5001/api/admin/opportunities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status, response.statusText);
      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        toast({
          title: "Success!",
          description: "Opportunity created successfully",
          variant: "default",
        });

        // Reset form
        setFormData({
          opportunityName: '',
          state: '',
          district: '',
          selectedCrop: '',
          description: '',
          contactDetails: {
            name: '',
            phone: '',
            email: '',
            office: ''
          },
          organizationName: '',
          opportunityType: 'general',
          requirements: '',
          benefits: '',
          applicationDeadline: '',
          validFrom: '',
          validTo: ''
        });
        setAvailableDistricts([]);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error creating opportunity:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create opportunity",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <Plus className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">Add New Opportunity</h1>
          </div>
          <p className="text-gray-600">Create opportunities for farmers from big organizations and government schemes</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Enter the basic details about the opportunity
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="opportunityName">Opportunity Name *</Label>
                  <Input
                    id="opportunityName"
                    value={formData.opportunityName}
                    onChange={(e) => setFormData(prev => ({ ...prev, opportunityName: e.target.value }))}
                    placeholder="e.g., Organic Wheat Export Contract"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="organizationName">Organization Name</Label>
                  <Input
                    id="organizationName"
                    value={formData.organizationName}
                    onChange={(e) => setFormData(prev => ({ ...prev, organizationName: e.target.value }))}
                    placeholder="e.g., Punjab Agri Export Corporation"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="opportunityType">Opportunity Type</Label>
                <Select
                  value={formData.opportunityType}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, opportunityType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select opportunity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {opportunityTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Location & Crop */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Location & Crop Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select
                    value={formData.state}
                    onValueChange={handleStateChange}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianStates.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="district">District *</Label>
                  <Select
                    value={formData.district}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, district: value }))}
                    disabled={!formData.state}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableDistricts.map((district) => (
                        <SelectItem key={district} value={district}>
                          {district}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="selectedCrop">Crop *</Label>
                  <Select
                    value={formData.selectedCrop}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, selectedCrop: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      {cropOptions.map((crop) => (
                        <SelectItem key={crop} value={crop}>
                          {crop}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description & Details */}
          <Card>
            <CardHeader>
              <CardTitle>Opportunity Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detailed description of the opportunity..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea
                    id="requirements"
                    value={formData.requirements}
                    onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                    placeholder="e.g., Minimum 10 acres, organic certification..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="benefits">Benefits</Label>
                  <Textarea
                    id="benefits"
                    value={formData.benefits}
                    onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
                    placeholder="e.g., ₹2,800 per quintal, advance payment..."
                    rows={3}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactName">Contact Person Name *</Label>
                  <Input
                    id="contactName"
                    value={formData.contactDetails.name}
                    onChange={(e) => handleContactChange('name', e.target.value)}
                    placeholder="Contact person name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Phone Number *</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactDetails.phone}
                    onChange={(e) => handleContactChange('phone', e.target.value)}
                    placeholder="+91-98765-43210"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactDetails.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    placeholder="contact@organization.com"
                  />
                </div>
                <div>
                  <Label htmlFor="contactOffice">Office Address</Label>
                  <Input
                    id="contactOffice"
                    value={formData.contactDetails.office}
                    onChange={(e) => handleContactChange('office', e.target.value)}
                    placeholder="Office address or location"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Validity Period */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Validity Period
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="validFrom">Valid From</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData(prev => ({ ...prev, validFrom: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="validTo">Valid To</Label>
                  <Input
                    id="validTo"
                    type="date"
                    value={formData.validTo}
                    onChange={(e) => setFormData(prev => ({ ...prev, validTo: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="applicationDeadline">Application Deadline</Label>
                  <Input
                    id="applicationDeadline"
                    type="date"
                    value={formData.applicationDeadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, applicationDeadline: e.target.value }))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <Users className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Create Opportunity
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOpportunity;