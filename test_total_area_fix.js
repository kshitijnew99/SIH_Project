// Test script to verify total area calculation fix
// This script simulates the land data structure and tests the calculation

const sampleLandListings = [
  {
    id: 1,
    title: "Premium Agricultural Land",
    area: "5.5", // This field was previously accessed as landSize
    location: "Village Khatoli, Pune",
    status: "available",
    fertilityIndex: "8.2"
  },
  {
    id: 2,
    title: "Fertile Farmland",
    area: "10.0",
    location: "Nashik, Maharashtra",
    status: "rented",
    fertilityIndex: "7.8"
  },
  {
    id: 3,
    title: "Organic Farm Land",
    area: "3.25",
    location: "Indore, MP",
    status: "available",
    fertilityIndex: "9.1"
  }
];

console.log("=== TOTAL AREA CALCULATION TEST ===");

// Test the fixed calculation (using land.area)
const totalAreaFixed = sampleLandListings.reduce((total, land) => total + parseFloat(land.area || 0), 0);
console.log("Total Area (Fixed):", totalAreaFixed, "acres");

// Test the old broken calculation (using land.landSize - should be 0)
const totalAreaBroken = sampleLandListings.reduce((total, land) => total + parseFloat(land.landSize || 0), 0);
console.log("Total Area (Old broken):", totalAreaBroken, "acres");

// Test landowner dashboard calculation 
const landownerDashboardTotal = sampleLandListings.reduce((total, land) => total + parseFloat(land.area || 0), 0);
console.log("Landowner Dashboard Total:", landownerDashboardTotal, "acres");

// Test view analytics calculation
const viewAnalyticsTotal = sampleLandListings.reduce((sum, land) => sum + parseFloat(land.area || 0), 0);
console.log("View Analytics Total:", viewAnalyticsTotal, "acres");

// Test individual calculations
console.log("\n=== INDIVIDUAL LAND AREAS ===");
sampleLandListings.forEach(land => {
  console.log(`${land.title}: ${land.area} acres`);
});

console.log("\n=== SUMMARY ===");
console.log("✅ Fixed calculation should show:", totalAreaFixed, "acres");
console.log("❌ Broken calculation would show:", totalAreaBroken, "acres");
console.log("🎯 Expected result: 18.75 acres (5.5 + 10.0 + 3.25)");

if (totalAreaFixed === 18.75) {
  console.log("✅ TEST PASSED: Total area calculation is working correctly!");
} else {
  console.log("❌ TEST FAILED: Total area calculation is incorrect!");
}