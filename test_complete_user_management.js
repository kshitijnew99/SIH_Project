// Complete User Management System Test
// Tests all user management endpoints and frontend integration

const API_BASE = 'http://localhost:5001/api';

// Test data
const testAdmin = {
  email: 'admin@gov.in',
  password: 'admin123'
};

const testUsers = [
  {
    fullName: 'Test Farmer 1',
    email: 'farmer1@test.com',
    password: 'test123',
    role: 'farmer',
    phone: '9876543210',
    aadhaar: '1234-5678-9012'
  },
  {
    fullName: 'Test Landowner 1',
    email: 'landowner1@test.com',
    password: 'test123',
    role: 'landowner',
    phone: '9876543211',
    aadhaar: '1234-5678-9013'
  }
];

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

async function testCompleteUserManagement() {
  console.log('🔥 COMPLETE USER MANAGEMENT SYSTEM TEST');
  console.log('==========================================\n');

  let adminToken = null;
  let testUserIds = [];

  // Step 1: Admin Login
  console.log('1️⃣ ADMIN LOGIN TEST');
  const loginResult = await makeRequest(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(testAdmin)
  });

  if (loginResult.data.success) {
    adminToken = loginResult.data.token;
    console.log('✅ Admin login successful');
    console.log(`   Token: ${adminToken.substring(0, 20)}...`);
  } else {
    console.log('❌ Admin login failed:', loginResult.data.message);
    return;
  }

  // Step 2: Register Test Users
  console.log('\n2️⃣ TEST USER REGISTRATION');
  for (let i = 0; i < testUsers.length; i++) {
    const user = testUsers[i];
    const registerResult = await makeRequest(`${API_BASE}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(user)
    });

    if (registerResult.data.success) {
      testUserIds.push(registerResult.data.user.id);
      console.log(`✅ ${user.role} registered: ${user.email}`);
      console.log(`   User ID: ${registerResult.data.user.id}`);
    } else {
      console.log(`❌ ${user.role} registration failed:`, registerResult.data.message);
    }
  }

  // Step 3: Get Platform Statistics
  console.log('\n3️⃣ ADMIN PLATFORM STATISTICS');
  const statsResult = await makeRequest(`${API_BASE}/admin/stats`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });

  if (statsResult.data.success) {
    console.log('✅ Platform statistics retrieved');
    console.log(`   Total Users: ${statsResult.data.stats.totalUsers}`);
    console.log(`   Farmers: ${statsResult.data.stats.farmers}`);
    console.log(`   Landowners: ${statsResult.data.stats.landowners}`);
    console.log(`   Admins: ${statsResult.data.stats.admins}`);
    console.log(`   Pending Verifications: ${statsResult.data.stats.pendingVerifications}`);
    console.log(`   Total Lands: ${statsResult.data.stats.totalLands}`);
  } else {
    console.log('❌ Failed to get statistics:', statsResult.data.message);
  }

  // Step 4: Get All Users (User Management)
  console.log('\n4️⃣ USER MANAGEMENT - GET ALL USERS');
  const usersResult = await makeRequest(`${API_BASE}/admin/users`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });

  if (usersResult.data.success) {
    console.log('✅ All users retrieved successfully');
    console.log(`   Total Users: ${usersResult.data.totalCount}`);
    
    usersResult.data.users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - Role: ${user.role} - Status: ${user.status || 'active'}`);
    });
  } else {
    console.log('❌ Failed to get users:', usersResult.data.message);
  }

  // Step 5: Test User Status Toggle (Suspend/Activate)
  console.log('\n5️⃣ USER STATUS MANAGEMENT');
  
  if (testUserIds.length > 0) {
    const targetUserId = testUserIds[0];
    
    // Test suspend user
    console.log(`   Testing suspend for user ID: ${targetUserId}`);
    const suspendResult = await makeRequest(`${API_BASE}/admin/users/${targetUserId}/status`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'suspended' })
    });

    if (suspendResult.data.success) {
      console.log('✅ User suspended successfully');
      console.log(`   User: ${suspendResult.data.user.name} - New Status: ${suspendResult.data.user.status}`);
    } else {
      console.log('❌ Failed to suspend user:', suspendResult.data.message);
    }

    // Test activate user
    console.log(`   Testing activate for user ID: ${targetUserId}`);
    const activateResult = await makeRequest(`${API_BASE}/admin/users/${targetUserId}/status`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${adminToken}` },
      body: JSON.stringify({ status: 'active' })
    });

    if (activateResult.data.success) {
      console.log('✅ User activated successfully');
      console.log(`   User: ${activateResult.data.user.name} - New Status: ${activateResult.data.user.status}`);
    } else {
      console.log('❌ Failed to activate user:', activateResult.data.message);
    }
  }

  // Step 6: Get Pending Verifications
  console.log('\n6️⃣ VERIFICATION MANAGEMENT');
  const verificationsResult = await makeRequest(`${API_BASE}/admin/verifications`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });

  if (verificationsResult.data.success) {
    console.log('✅ Verification requests retrieved');
    console.log(`   Pending Verifications: ${verificationsResult.data.verifications.length}`);
    
    verificationsResult.data.verifications.forEach(verification => {
      console.log(`   - ${verification.fullName} (${verification.role}) - Status: ${verification.status}`);
    });
  } else {
    console.log('❌ Failed to get verifications:', verificationsResult.data.message);
  }

  // Step 7: Final User List Check
  console.log('\n7️⃣ FINAL USER STATUS CHECK');
  const finalUsersResult = await makeRequest(`${API_BASE}/admin/users`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${adminToken}` }
  });

  if (finalUsersResult.data.success) {
    console.log('✅ Final user status check completed');
    finalUsersResult.data.users.forEach(user => {
      const statusIcon = user.status === 'suspended' ? '🔴' : '🟢';
      console.log(`   ${statusIcon} ${user.name} - ${user.role} - Status: ${user.status || 'active'}`);
    });
  }

  console.log('\n🎉 USER MANAGEMENT SYSTEM TEST COMPLETED!');
  console.log('==========================================');
}

// Run the test
testCompleteUserManagement().catch(console.error);