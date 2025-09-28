// Temporary admin token setup for testing admin pages
// This sets the correct admin token in localStorage so admin pages can access the backend

console.log('Setting up admin token for testing...');

// The actual admin token we got from the backend login
const ADMIN_TOKEN = 'token_3_1759064893056_6n0b9w';

// Store in localStorage
localStorage.setItem('userToken', ADMIN_TOKEN);

// Also store admin user data
const adminUserData = {
  id: 3,
  name: 'Admin',
  fullName: 'Admin Kumar',
  email: 'admin@gov.in',
  phone: '9876543212',
  role: 'admin',
  permanentRole: 'admin',
  employeeId: 'GOV2024001',
  department: 'Agriculture Department',
  designation: 'Assistant Commissioner',
  token: ADMIN_TOKEN
};

localStorage.setItem('userData', JSON.stringify(adminUserData));
localStorage.setItem('selectedRole', 'admin');

console.log('Admin token setup complete!');
console.log('Token:', ADMIN_TOKEN);
console.log('You can now access the admin pages.');