// Test frontend-backend connection
const testAdminAPI = async () => {
  console.log('Testing admin API connection...');
  
  // Test with a known valid token
  const testToken = 'token_11_1759043170039_lyii3r';
  
  try {
    console.log('Testing stats API...');
    const statsResponse = await fetch('http://localhost:5001/api/admin/stats', {
      headers: {
        'Authorization': `Bearer ${testToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const statsData = await statsResponse.json();
    console.log('Stats API response:', statsData);
    
    console.log('Testing verifications API...');
    const verificationsResponse = await fetch('http://localhost:5001/api/admin/verifications', {
      headers: {
        'Authorization': `Bearer ${testToken}`,
        'Content-Type': 'application/json'
      }
    });
    
    const verificationsData = await verificationsResponse.json();
    console.log('Verifications API response:', verificationsData);
    
    // Test with localStorage token
    const storedToken = localStorage.getItem('userToken');
    console.log('Stored token:', storedToken ? 'Present' : 'Not found');
    
    if (storedToken) {
      const userStatsResponse = await fetch('http://localhost:5001/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      const userStatsData = await userStatsResponse.json();
      console.log('User stats API response:', userStatsData);
    }
    
  } catch (error) {
    console.error('API test error:', error);
  }
};

testAdminAPI();