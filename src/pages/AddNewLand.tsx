import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import RapidAPIMap from "@/components/RapidAPIMap";

// Indian states list
const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
  "Uttarakhand", "West Bengal"
];

const formSchema = z.object({
  title: z.string().min(1, "Please enter a title for your land"),
  location: z.string().min(1, "Please enter land location (city/village, district, state)"),
  district: z.string().min(1, "Please select district"),
  state: z.string().min(1, "Please select state"),
  priceModel: z.enum(["fixed", "percentage"]).default("fixed"),
  price: z.string().optional(),
  sharingModel: z.string().optional(),
  area: z.string().min(1, "Please enter land area"),
  suitable: z.string().min(1, "Please enter suitable crops"),
  water: z.string().min(1, "Please describe water availability"),
  electricity: z.string().min(1, "Please describe electricity status"),
  soil: z.string().min(1, "Please describe soil type"),
  roadConnectivity: z.string().min(1, "Please select road connectivity type"),
  hasElectricity: z.boolean(),
  waterBody: z.string().min(1, "Please select nearby water body type"),
  soilTestingFile: z.any().optional(),
  gpsMapFile: z.any().optional(),
  fertilityIndex: z.string().min(1, "Please enter fertility index"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  certification: z.string().optional(),
  season: z.string().optional(),
  status: z.enum(['available', 'rented']).default('available'),
});

const AddNewLand = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mapLocation, setMapLocation] = useState({ lat: 28.6139, lng: 77.2090 }); // Default to Delhi

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      location: "",
      district: "",
      state: "",
      priceModel: "fixed",
      price: "",
      sharingModel: "",
      area: "",
      suitable: "",
      water: "",
      electricity: "",
      soil: "",
      roadConnectivity: "",
      hasElectricity: false,
      waterBody: "",
      fertilityIndex: "",
      latitude: undefined,
      longitude: undefined,
      certification: "",
      season: "",
      status: "available",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      
      // Get existing lands from localStorage or initialize empty array
      const existingLands = JSON.parse(localStorage.getItem('landListings') || '[]');
      
      // Format the land data to match the Land.tsx structure
      const newLand = {
        id: Date.now(),
        title: values.title,
        location: values.location,
        district: values.district,
        state: values.state,
        priceModel: values.priceModel,
        price: values.priceModel === "fixed" ? `₹${values.price}/acre/year` : null,
        sharingModel: values.priceModel === "percentage" ? values.sharingModel : null,
        water: values.water,
        electricity: values.electricity,
        soil: values.soil,
        image: "/api/placeholder/400/300", // Default placeholder image
        area: values.area,
        suitable: values.suitable,
        // Additional metadata for internal use
        roadConnectivity: values.roadConnectivity,
        hasElectricity: values.hasElectricity,
        waterBody: values.waterBody,
        fertilityIndex: values.fertilityIndex,
        latitude: values.latitude,
        longitude: values.longitude,
        certification: values.certification,
        season: values.season,
        status: values.status,
        dateAdded: new Date().toISOString(),
      };
      
      // Save updated list back to localStorage
      localStorage.setItem('landListings', JSON.stringify([...existingLands, newLand]));
      
      toast({
        title: "Success!",
        description: "Land details have been saved successfully.",
      });
      
      form.reset();

      // Navigate back to dashboard
      window.location.href = '/landowner-dashboard';
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save land details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 flex justify-center">
      <Card className="w-[60%]">
        <CardHeader>
          <CardTitle>Add New Land</CardTitle>
          <CardDescription>
            Fill in the details about your agricultural land
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Land Title</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Agricultural Plot - Sector 7" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Land Area</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 3.2 acres" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="priceModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pricing Model</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pricing model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="fixed">Fixed Rental</SelectItem>
                          <SelectItem value="percentage">Profit Sharing</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {form.watch("priceModel") === "fixed" ? (
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rental Price (₹/acre/year)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 25000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="sharingModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profit Sharing Ratio (Landowner-Farmer)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sharing ratio" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="50-50">50-50</SelectItem>
                          <SelectItem value="60-40">60-40</SelectItem>
                          <SelectItem value="70-30">70-30</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location (City/Village)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Nashik, Maharashtra" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {indianStates.map((state) => (
                            <SelectItem key={state} value={state}>
                              {state}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Nashik" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="water"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Water Availability</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bore well + Canal" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="electricity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Electricity Status</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 3-phase connection" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="soil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soil Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Black cotton soil" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="suitable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Suitable Crops</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Cotton, Soybean, Wheat" {...field} />
                    </FormControl>
                    <FormDescription>
                      List the crops that grow well on this land
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Map Location Picker */}
              <div className="space-y-2">
                <Label>Precise Location (Search or use GPS)</Label>
                <RapidAPIMap
                  center={mapLocation}
                  onLocationSelect={(location) => {
                    setMapLocation(location);
                    form.setValue("latitude", location.lat);
                    form.setValue("longitude", location.lng);
                  }}
                  height="400px"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="certification"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Certification (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select certification" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="organic">Organic Certified</SelectItem>
                          <SelectItem value="natural">Natural Farming</SelectItem>
                          <SelectItem value="traditional">Traditional</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="season"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Farming Season (Optional)</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select season" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="rice">Rice Season</SelectItem>
                          <SelectItem value="wheat">Wheat Season</SelectItem>
                          <SelectItem value="year-round">Year Round</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="roadConnectivity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Road Connectivity</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select road connectivity type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="highway">Highway Access</SelectItem>
                        <SelectItem value="main-road">Main Road</SelectItem>
                        <SelectItem value="village-road">Village Road</SelectItem>
                        <SelectItem value="no-road">No Direct Road Access</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="hasElectricity"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Electricity Availability</FormLabel>
                      <FormDescription>
                        Does the land have electricity connection?
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="waterBody"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nearby Water Body</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select water body type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="river">River</SelectItem>
                        <SelectItem value="lake">Lake</SelectItem>
                        <SelectItem value="well">Well</SelectItem>
                        <SelectItem value="canal">Canal</SelectItem>
                        <SelectItem value="none">No Water Body Nearby</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="soilTestingFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Soil Testing Report</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload soil testing results (PDF, DOC, or image files)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="gpsMapFile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>GPS/Drone Mapping</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload GPS coordinates or drone mapping images
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="fertilityIndex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fertility Index</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Enter fertility index (0-100)"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the fertility index based on past performance
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Add Land"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddNewLand;