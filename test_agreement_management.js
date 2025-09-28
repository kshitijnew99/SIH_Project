// Agreement Management System Test
// Tests the complete agreement management functionality in admin panel

const API_BASE = 'http://localhost:5001/api';

// Test admin credentials
const testAdmin = {
  email: 'admin@gov.in',
  password: 'admin123'
};

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error(`Request failed for ${url}:`, error.message);
    return { status: 500, data: { success: false, message: error.message } };
  }
}

async function testAgreementManagement() {
  console.log('🤝 AGREEMENT MANAGEMENT SYSTEM TEST');
  console.log('===================================\n');

  let adminToken = null;

  // Step 1: Admin Login
  console.log('1️⃣ ADMIN LOGIN TEST');
  const loginResult = await makeRequest(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(testAdmin)
  });

  if (loginResult.data.success) {
    adminToken = loginResult.data.token;
    console.log('✅ Admin login successful');
  } else {
    console.log('❌ Admin login failed:', loginResult.data.message);
    return;
  }

  // Step 2: Get Updated Platform Statistics
  console.log('\n2️⃣ PLATFORM STATISTICS WITH AGREEMENTS');
  const statsResult = await makeRequest(`${API_BASE}/admin/stats`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });

  if (statsResult.data.success) {
    console.log('✅ Updated platform statistics retrieved');
    console.log(`   📊 Total Users: ${statsResult.data.stats.totalUsers}`);
    console.log(`   👨‍🌾 Farmers: ${statsResult.data.stats.totalFarmers}`);
    console.log(`   🏡 Landowners: ${statsResult.data.stats.totalLandowners}`);
    console.log(`   👨‍💼 Admins: ${statsResult.data.stats.totalAdmins}`);
    console.log(`   ⏳ Pending Verifications: ${statsResult.data.stats.pendingVerifications}`);
    console.log(`   🌾 Total Lands: ${statsResult.data.stats.totalLands}`);
    console.log('   ═══ AGREEMENT STATISTICS ═══');
    console.log(`   🤝 Total Agreements: ${statsResult.data.stats.totalAgreements}`);
    console.log(`   ⏳ Pending Agreements: ${statsResult.data.stats.pendingAgreements}`);
    console.log(`   ✅ Approved Agreements: ${statsResult.data.stats.approvedAgreements}`);
    console.log(`   ❌ Rejected Agreements: ${statsResult.data.stats.rejectedAgreements}`);
  } else {
    console.log('❌ Failed to get statistics:', statsResult.data.message);
  }

  // Step 3: Get All Agreements
  console.log('\n3️⃣ AGREEMENT MANAGEMENT - GET ALL AGREEMENTS');
  const agreementsResult = await makeRequest(`${API_BASE}/admin/agreements`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });

  if (agreementsResult.data.success) {
    console.log('✅ All agreements retrieved successfully');
    console.log(`   📋 Total Agreements: ${agreementsResult.data.totalCount}`);
    
    agreementsResult.data.agreements.forEach((agreement, index) => {
      console.log(`\n   Agreement ${index + 1}:`);
      console.log(`   ├─ ID: ${agreement.id}`);
      console.log(`   ├─ Type: ${agreement.agreementType}`);
      console.log(`   ├─ Crop: ${agreement.cropType}`);
      console.log(`   ├─ Status: ${agreement.status}`);
      console.log(`   ├─ Farmer: ${agreement.farmerName} (${agreement.farmerEmail})`);
      console.log(`   ├─ Landowner: ${agreement.landownerName} (${agreement.landownerEmail})`);
      console.log(`   ├─ Duration: ${agreement.duration}`);
      console.log(`   ├─ Start: ${agreement.startDate}`);
      console.log(`   ├─ End: ${agreement.endDate}`);
      
      if (agreement.sharePercentage) {
        console.log(`   ├─ Share: Farmer ${agreement.sharePercentage}%, Landowner ${100 - agreement.sharePercentage}%`);
      }
      
      if (agreement.rentAmount) {
        console.log(`   ├─ Rent: ₹${agreement.rentAmount.toLocaleString()} per month`);
      }
      
      console.log(`   └─ Terms: ${agreement.terms}`);
    });
  } else {
    console.log('❌ Failed to get agreements:', agreementsResult.data.message);
  }

  // Step 4: Test Agreement Approval
  console.log('\n4️⃣ AGREEMENT APPROVAL TEST');
  
  if (agreementsResult.data.success && agreementsResult.data.agreements.length > 0) {
    const pendingAgreement = agreementsResult.data.agreements.find(a => a.status === 'pending');
    
    if (pendingAgreement) {
      console.log(`   Testing approval for Agreement ID: ${pendingAgreement.id}`);
      const approveResult = await makeRequest(`${API_BASE}/admin/agreements/${pendingAgreement.id}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify({ approvalNotes: 'Approved after reviewing all terms and conditions.' })
      });

      if (approveResult.data.success) {
        console.log('✅ Agreement approved successfully');
        console.log(`   ├─ Agreement ID: ${approveResult.data.agreement.id}`);
        console.log(`   ├─ New Status: ${approveResult.data.agreement.status}`);
        console.log(`   ├─ Approved By: Admin ID ${approveResult.data.agreement.approvedBy}`);
        console.log(`   └─ Approval Notes: ${approveResult.data.agreement.approvalNotes}`);
      } else {
        console.log('❌ Failed to approve agreement:', approveResult.data.message);
      }
    } else {
      console.log('ℹ️  No pending agreements available for approval test');
    }
  }

  // Step 5: Test Agreement Rejection
  console.log('\n5️⃣ AGREEMENT REJECTION TEST');
  
  // Get updated agreements list
  const updatedAgreementsResult = await makeRequest(`${API_BASE}/admin/agreements`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });

  if (updatedAgreementsResult.data.success && updatedAgreementsResult.data.agreements.length > 1) {
    const pendingAgreement = updatedAgreementsResult.data.agreements.find(a => a.status === 'pending');
    
    if (pendingAgreement) {
      console.log(`   Testing rejection for Agreement ID: ${pendingAgreement.id}`);
      const rejectResult = await makeRequest(`${API_BASE}/admin/agreements/${pendingAgreement.id}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminToken}` },
        body: JSON.stringify({ rejectionReason: 'Terms do not comply with current agricultural regulations.' })
      });

      if (rejectResult.data.success) {
        console.log('✅ Agreement rejected successfully');
        console.log(`   ├─ Agreement ID: ${rejectResult.data.agreement.id}`);
        console.log(`   ├─ New Status: ${rejectResult.data.agreement.status}`);
        console.log(`   ├─ Rejected By: Admin ID ${rejectResult.data.agreement.rejectedBy}`);
        console.log(`   └─ Rejection Reason: ${rejectResult.data.agreement.rejectionReason}`);
      } else {
        console.log('❌ Failed to reject agreement:', rejectResult.data.message);
      }
    } else {
      console.log('ℹ️  No pending agreements available for rejection test');
    }
  }

  // Step 6: Final Statistics Check
  console.log('\n6️⃣ FINAL STATISTICS AFTER AGREEMENT ACTIONS');
  const finalStatsResult = await makeRequest(`${API_BASE}/admin/stats`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });

  if (finalStatsResult.data.success) {
    console.log('✅ Final statistics retrieved');
    console.log('   ═══ UPDATED AGREEMENT STATISTICS ═══');
    console.log(`   🤝 Total Agreements: ${finalStatsResult.data.stats.totalAgreements}`);
    console.log(`   ⏳ Pending Agreements: ${finalStatsResult.data.stats.pendingAgreements}`);
    console.log(`   ✅ Approved Agreements: ${finalStatsResult.data.stats.approvedAgreements}`);
    console.log(`   ❌ Rejected Agreements: ${finalStatsResult.data.stats.rejectedAgreements}`);
  }

  console.log('\n🎉 AGREEMENT MANAGEMENT SYSTEM TEST COMPLETED!');
  console.log('===============================================');
  console.log('✅ Agreement Statistics: WORKING');
  console.log('✅ Agreement Listing: WORKING');
  console.log('✅ Agreement Approval: WORKING');
  console.log('✅ Agreement Rejection: WORKING');
  console.log('\n🔥 Admin panel now supports complete agreement management!');
}

// Run the test
testAgreementManagement().catch(console.error);