// Test script to demonstrate admin dashboard functionality
// This script shows how new users, verifications, and agreements will appear in admin dashboard

const API_BASE = 'http://localhost:5001/api';

async function testAdminDashboardFlow() {
  console.log('🧪 Testing Admin Dashboard Data Flow\n');
  
  try {
    // Step 1: Register a new farmer
    console.log('1️⃣ Registering a new farmer...');
    const farmerData = {
      fullName: 'Raj Kumar',
      email: 'raj.farmer@test.com',
      phone: '9876543210',
      password: 'password123',
      role: 'farmer',
      aadhaar: '123456789012',
      district: 'Punjab',
      address: '123 Village Road, Punjab'
    };
    
    const farmerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(farmerData)
    });
    const farmer = await farmerResponse.json();
    console.log('✅ Farmer registered:', farmer.user?.name, '(ID:', farmer.user?.id, ')');

    // Step 2: Register a new landowner
    console.log('\n2️⃣ Registering a new landowner...');
    const landownerData = {
      fullName: 'Priya Sharma',
      email: 'priya.landowner@test.com',
      phone: '9876543211',
      password: 'password123',
      role: 'landowner',
      aadhaar: '123456789013',
      district: 'Punjab',
      address: '456 Town Center, Punjab'
    };
    
    const landownerResponse = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(landownerData)
    });
    const landowner = await landownerResponse.json();
    console.log('✅ Landowner registered:', landowner.user?.name, '(ID:', landowner.user?.id, ')');

    // Step 3: Submit verification request (this will appear in admin verification page)
    if (farmer.user?.id) {
      console.log('\n3️⃣ Submitting verification request for farmer...');
      const verificationData = {
        userId: farmer.user.id,
        landId: 1,
        documentType: 'identity_proof',
        documentUrl: '/documents/raj_identity.pdf',
        adminNotes: 'Please verify Aadhaar card'
      };
      
      const verificationResponse = await fetch(`${API_BASE}/verification/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verificationData)
      });
      const verification = await verificationResponse.json();
      console.log('✅ Verification submitted:', verification.verification?.documentType);
    }

    // Step 4: Create agreement (this will appear in admin agreements page)
    if (farmer.user?.id && landowner.user?.id) {
      console.log('\n4️⃣ Creating agreement between farmer and landowner...');
      const agreementData = {
        farmerId: farmer.user.id,
        landownerId: landowner.user.id,
        landId: 1,
        terms: 'Organic farming agreement for wheat cultivation',
        duration: '6 months',
        paymentTerms: '60% profit share to farmer, 40% to landowner'
      };
      
      const agreementResponse = await fetch(`${API_BASE}/agreements/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agreementData)
      });
      const agreement = await agreementResponse.json();
      console.log('✅ Agreement created between:', agreement.agreement?.farmerName, 'and', agreement.agreement?.landowner);
    }

    // Step 5: Check what admin will see
    console.log('\n5️⃣ Testing what admin will see in dashboard...');
    
    // Test admin token (from sample data)
    const adminToken = '1234567890';
    
    // Check users page
    const usersResponse = await fetch(`${API_BASE}/admin/users`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const usersData = await usersResponse.json();
    console.log('👥 Total users visible to admin:', usersData.users?.length || 0);
    console.log('   - Roles:', usersData.users?.map(u => `${u.name} (${u.role})`).join(', ') || 'None');
    
    // Check verifications page
    const verificationsResponse = await fetch(`${API_BASE}/admin/verifications`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const verificationsData = await verificationsResponse.json();
    console.log('📋 Pending verifications visible to admin:', verificationsData.verifications?.length || 0);
    
    // Check agreements page
    const agreementsResponse = await fetch(`${API_BASE}/admin/agreements`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const agreementsData = await agreementsResponse.json();
    console.log('🤝 Total agreements visible to admin:', agreementsData.agreements?.length || 0);

    console.log('\n✅ Test completed! The admin dashboard will show:');
    console.log('   • All registered farmers and landowners in "Manage User Accounts"');
    console.log('   • All pending verification requests in "Review Pending Verifications"');
    console.log('   • All agreements (pending/approved/rejected) in "Manage Agreements"');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAdminDashboardFlow();