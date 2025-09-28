// Test admin authentication flow
const testAdminFlow = () => {
  console.log('Testing admin authentication flow...');
  
  // Check current localStorage state
  const userData = localStorage.getItem('userData');
  const userToken = localStorage.getItem('userToken');
  
  console.log('Current userData:', userData);
  console.log('Current userToken:', userToken ? 'Present' : 'Not found');
  
  if (userData && userToken) {
    try {
      const parsedData = JSON.parse(userData);
      console.log('Parsed user data:', parsedData);
      console.log('User role:', parsedData.role);
      
      // Test dashboard path logic
      const getDashboardPath = (role) => {
        switch (role) {
          case 'admin': return '/admin-dashboard';
          case 'farmer': return '/farmer-dashboard';
          case 'landowner': return '/landowner-dashboard';
          default: return '/';
        }
      };
      
      console.log('Dashboard path for', parsedData.role + ':', getDashboardPath(parsedData.role));
      
    } catch (error) {
      console.error('Error parsing userData:', error);
    }
  } else {
    console.log('No authentication data found');
  }
};

// Auto-run test
testAdminFlow();