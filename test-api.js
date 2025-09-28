// Simple test script to verify API connectivity
const testAPI = async () => {
  try {
    console.log('Testing API connectivity...');
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:5001/health');
    const healthData = await healthResponse.json();
    console.log('Health check:', healthData);
    
    // Test registration endpoint
    const registerData = {
      fullName: 'Test Admin User',
      email: 'testadmin@example.com',
      password: 'test123',
      role: 'admin',
      phone: '9876543210',
      employeeId: 'EMP001',
      department: 'Agriculture',
      designation: 'Test Officer'
    };
    
    const registerResponse = await fetch('http://localhost:5001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData)
    });
    
    const registerResult = await registerResponse.json();
    console.log('Registration test:', registerResult);
    
  } catch (error) {
    console.error('API test failed:', error);
  }
};

testAPI();