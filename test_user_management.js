// Test script for User Management functionality
const API_BASE_URL = 'http://localhost:5001/api';

// Test data - Admin login
const adminCredentials = {
  email: 'admin@gov.in',
  password: 'admin123'
};

let adminToken = null;

// Helper function to make API calls
async function apiCall(endpoint, method = 'GET', body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options = {
    method,
    headers
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result = await response.json();
    
    console.log(`\n🔗 ${method} ${endpoint}`);
    console.log(`📊 Status: ${response.status}`);
    console.log(`📄 Response:`, result);
    
    return result;
  } catch (error) {
    console.error(`❌ Error calling ${endpoint}:`, error.message);
    return null;
  }
}

// Test sequence
async function testUserManagement() {
  console.log('🧪 Testing User Management API Endpoints');
  console.log('=' .repeat(50));
  
  // 1. Admin Login
  console.log('\n1️⃣ Admin Login');
  const loginResult = await apiCall('/auth/login', 'POST', adminCredentials);
  
  if (loginResult && loginResult.success) {
    adminToken = loginResult.token;
    console.log('✅ Admin login successful');
  } else {
    console.log('❌ Admin login failed');
    return;
  }
  
  // 2. Get Admin Stats
  console.log('\n2️⃣ Get Admin Statistics');
  await apiCall('/admin/stats', 'GET', null, adminToken);
  
  // 3. Get All Users
  console.log('\n3️⃣ Get All Users for Management');
  const usersResult = await apiCall('/admin/users', 'GET', null, adminToken);
  
  let testUserId = null;
  if (usersResult && usersResult.success && usersResult.users.length > 0) {
    // Find a non-admin user to test status toggle
    const nonAdminUser = usersResult.users.find(user => user.role !== 'admin');
    if (nonAdminUser) {
      testUserId = nonAdminUser.id;
      console.log(`✅ Found test user: ${nonAdminUser.name} (${nonAdminUser.email})`);
    }
  }
  
  // 4. Test User Status Toggle (if we have a test user)
  if (testUserId) {
    console.log('\n4️⃣ Test User Status Toggle');
    
    // Suspend user
    console.log('   📝 Suspending user...');
    await apiCall(`/admin/users/${testUserId}/status`, 'POST', { status: 'suspended' }, adminToken);
    
    // Activate user
    console.log('   📝 Activating user...');
    await apiCall(`/admin/users/${testUserId}/status`, 'POST', { status: 'active' }, adminToken);
  } else {
    console.log('\n4️⃣ No non-admin users found for status toggle test');
  }
  
  // 5. Get Pending Verifications
  console.log('\n5️⃣ Get Pending Verifications');
  await apiCall('/admin/verifications', 'GET', null, adminToken);
  
  console.log('\n🎉 User Management API Test Complete!');
  console.log('=' .repeat(50));
}

// Run the test
testUserManagement().catch(console.error);