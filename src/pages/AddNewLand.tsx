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

const formSchema = z.object({
  title: z.string().min(1, "Please enter a title for your land"),
  roadConnectivity: z.string().min(1, "Please select road connectivity type"),
  hasElectricity: z.boolean(),
  waterBody: z.string().min(1, "Please select nearby water body type"),
  soilTestingFile: z.any().optional(),
  gpsMapFile: z.any().optional(),
  fertilityIndex: z.string().min(1, "Please enter fertility index"),
  landSize: z.string().min(1, "Please enter land size"),
  address: z.string().min(1, "Please enter land address"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  rentalPrice: z.string().min(1, "Please enter rental price per acre"),
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
      roadConnectivity: "",
      hasElectricity: false,
      waterBody: "",
      fertilityIndex: "",
      landSize: "",
      address: "",
      latitude: undefined,
      longitude: undefined,
      rentalPrice: "",
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
      
      // Format the land data to match the existing card style
      const newLand = {
        id: Date.now(),
        title: values.title || 'Agricultural Plot',
        location: values.address,
        landSize: values.landSize,
        status: 'available',
        rentalPrice: values.rentalPrice,
        certification: values.certification || null,
        season: values.season || null,
        dateAdded: new Date().toISOString(),
        roadConnectivity: values.roadConnectivity,
        hasElectricity: values.hasElectricity,
        waterBody: values.waterBody,
        fertilityIndex: values.fertilityIndex,
        latitude: values.latitude,
        longitude: values.longitude
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
                  name="landSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Land Size (Acres)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" placeholder="e.g., 3.2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rentalPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rental Price (₹/month/acre)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 6000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Village Name, District, State" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Map Location Picker */}
              <div className="space-y-2">
                <Label>Precise Location (Search or use GPS)</Label>
                <RapidAPIMap
                  center={mapLocation}
                  zoom={10}
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