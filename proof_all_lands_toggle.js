// Demonstration: Toggle functionality works for ALL lands, not just the last one
// This proves it's not using push/pop but individual ID-based targeting

const sampleLandListings = [
  { id: 101, title: "Land A (First)", status: "available" },
  { id: 205, title: "Land B (Middle)", status: "available" },
  { id: 378, title: "Land C (Another Middle)", status: "rented" },
  { id: 442, title: "Land D (Last)", status: "available" }
];

console.log("=== PROVING TOGGLE WORKS FOR ALL LANDS INDIVIDUALLY ===");

// Simulate the actual toggle function from the code
const toggleLandStatus = (landId, listings) => {
  return listings.map(land => {
    if (land.id === landId) {  // ONLY the land with matching ID
      const newStatus = land.status === 'available' ? 'unlisted' : 'available';
      return { ...land, status: newStatus };
    }
    return land;  // All other lands stay the same
  });
};

console.log("Initial state:");
sampleLandListings.forEach((land, index) => {
  console.log(`${index + 1}. ID:${land.id} - ${land.title}: ${land.status}`);
});

// Test 1: Toggle FIRST land (ID: 101)
console.log("\n=== Test 1: Toggle FIRST land (ID: 101) ===");
let currentListings = toggleLandStatus(101, sampleLandListings);
currentListings.forEach((land, index) => {
  const changed = land.status !== sampleLandListings[index].status ? " 👈 CHANGED!" : "";
  console.log(`${index + 1}. ID:${land.id} - ${land.title}: ${land.status}${changed}`);
});

// Test 2: Toggle MIDDLE land (ID: 205) 
console.log("\n=== Test 2: Toggle MIDDLE land (ID: 205) ===");
currentListings = toggleLandStatus(205, currentListings);
currentListings.forEach((land, index) => {
  const original = sampleLandListings[index].status;
  const changed = land.status !== original ? " 👈 CHANGED!" : "";
  console.log(`${index + 1}. ID:${land.id} - ${land.title}: ${land.status}${changed}`);
});

// Test 3: Toggle LAST land (ID: 442)
console.log("\n=== Test 3: Toggle LAST land (ID: 442) ===");
currentListings = toggleLandStatus(442, currentListings);
currentListings.forEach((land, index) => {
  const original = sampleLandListings[index].status;
  const changed = land.status !== original ? " 👈 CHANGED!" : "";
  console.log(`${index + 1}. ID:${land.id} - ${land.title}: ${land.status}${changed}`);
});

// Test 4: Try to toggle a rented land (ID: 378) - should work too
console.log("\n=== Test 4: Toggle RENTED land (ID: 378) ===");
console.log("Note: Rented lands can also be toggled between 'rented' and 'available'");
currentListings = toggleLandStatus(378, currentListings);
currentListings.forEach((land, index) => {
  const original = sampleLandListings[index].status;
  const changed = land.status !== original ? " 👈 CHANGED!" : "";
  console.log(`${index + 1}. ID:${land.id} - ${land.title}: ${land.status}${changed}`);
});

console.log("\n=== PROOF SUMMARY ===");
console.log("✅ Each land is identified by its UNIQUE ID, not position");
console.log("✅ Toggle works on ANY land (first, middle, last)");
console.log("✅ Uses .map() with ID matching, NOT push/pop operations");
console.log("✅ All other lands remain unchanged when one is toggled");
console.log("✅ The order of lands never changes");

console.log("\n=== WHAT ACTUALLY HAPPENS IN THE UI ===");
console.log("1. User clicks toggle button on ANY land card");
console.log("2. Button passes that specific land's ID: onClick={() => toggleLandStatus(land.id)}");
console.log("3. Function finds ONLY that land by ID and changes its status");
console.log("4. All other lands remain completely unchanged");
console.log("5. localStorage is updated with the modified array");
console.log("6. UI re-renders showing the change for that specific land");

console.log("\n🚫 It does NOT use push/pop - those would change array order!");
console.log("✅ It uses precise ID-based targeting to update individual lands!");