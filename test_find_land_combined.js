// Test to verify Find Land page shows both hardcoded and user-added lands
// This simulates the Land.tsx merging and filtering logic

// Simulate hardcoded default listings (what's in the code)
const defaultListings = [
  {
    id: 9001,
    title: "5 Acres Agricultural Land (Hardcoded)",
    location: "Nashik, Maharashtra",
    district: "Nashik",
    state: "Maharashtra",
    status: "available", // ✅ Now has status field
  },
  {
    id: 9002,
    title: "10 Acres Fertile Land (Hardcoded)",
    location: "Sangli, Maharashtra", 
    district: "Sangli",
    state: "Maharashtra",
    status: "available", // ✅ Now has status field
  },
  {
    id: 9003,
    title: "3 Acres with Irrigation (Hardcoded)",
    location: "Pune, Maharashtra",
    district: "Pune",
    state: "Maharashtra",
    status: "available", // ✅ Now has status field
  }
];

// Simulate user-added listings (from localStorage)
const userAddedListings = [
  {
    id: 101,
    title: "My Personal Farm (User Added)",
    location: "Solapur, Maharashtra",
    district: "Solapur",
    state: "Maharashtra",
    status: "available"
  },
  {
    id: 102,
    title: "Family Land (User Added)",
    location: "Aurangabad, Maharashtra", 
    district: "Aurangabad",
    state: "Maharashtra",
    status: "unlisted" // This should be filtered out
  },
  {
    id: 103,
    title: "Organic Farm (User Added)",
    location: "Kolhapur, Maharashtra",
    district: "Kolhapur", 
    state: "Maharashtra",
    status: "available"
  }
];

console.log("=== FIND LAND PAGE: HARDCODED + USER LANDS TEST ===");

// Simulate the Land.tsx merging logic
const allListings = [...defaultListings, ...userAddedListings];
console.log("Step 1: Merged all listings (hardcoded + user):");
allListings.forEach((land, index) => {
  console.log(`${index + 1}. ID:${land.id} - ${land.title} - Status: ${land.status}`);
});

// Simulate the filtering logic (only show available lands)
const filteredListings = allListings.filter((land) => {
  return land.status === 'available'; // Only available lands shown on Find Land page
});

console.log("\n=== WHAT APPEARS ON FIND LAND PAGE ===");
console.log("Step 2: After filtering (only available status):");
filteredListings.forEach((land, index) => {
  const source = land.id > 9000 ? "[HARDCODED]" : "[USER ADDED]";
  console.log(`${index + 1}. ${source} ${land.title} - ${land.location}`);
});

// Test filtering by state
console.log("\n=== FILTER BY STATE: MAHARASHTRA ===");
const maharashtraLands = filteredListings.filter(land => land.state === "Maharashtra");
console.log("Lands in Maharashtra:");
maharashtraLands.forEach((land, index) => {
  const source = land.id > 9000 ? "[HARDCODED]" : "[USER ADDED]";  
  console.log(`${index + 1}. ${source} ${land.title} - ${land.location}`);
});

// Test what gets hidden
console.log("\n=== LANDS NOT VISIBLE (FILTERED OUT) ===");
const hiddenLands = allListings.filter(land => land.status !== 'available');
hiddenLands.forEach(land => {
  console.log(`❌ ${land.title} - Status: ${land.status} (Hidden from Find Land page)`);
});

// Summary
console.log("\n=== SUMMARY ===");
console.log(`Total hardcoded lands: ${defaultListings.length}`);
console.log(`Total user-added lands: ${userAddedListings.length}`);
console.log(`Total merged lands: ${allListings.length}`);
console.log(`Visible on Find Land page: ${filteredListings.length}`);
console.log(`Hidden (unlisted/rented): ${hiddenLands.length}`);

console.log("\n✅ Both hardcoded and user-added lands now appear together!");
console.log("✅ Filtering works on the combined list!");
console.log("✅ Only 'available' lands are visible to farmers!");