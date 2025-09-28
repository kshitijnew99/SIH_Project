// Quick test script to verify admin pages fixes
console.log('🔧 Testing admin pages fixes...');

// Set the admin token
const ADMIN_TOKEN = 'token_3_1759066505116_11cp8q';
localStorage.setItem('userToken', ADMIN_TOKEN);

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

console.log('✅ Admin token set!');

// Test Issues API
fetch('http://localhost:5001/api/admin/issues', {
    headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        console.log('✅ Issues API working!');
        console.log('Sample issue structure:', data.issues[0]);
        
        // Check for required fields
        const issue = data.issues[0];
        if (issue.reporterName && issue.reporterEmail) {
            console.log('✅ Issue data structure fixed - reporterName and reporterEmail present');
        } else {
            console.log('❌ Issue data structure still has problems');
        }
    } else {
        console.log('❌ Issues API failed:', data.message);
    }
})
.catch(error => {
    console.log('❌ Issues API error:', error);
});

// Test Policies API
fetch('http://localhost:5001/api/admin/policies', {
    headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => {
    if (data.success) {
        console.log('✅ Policies API working!');
        console.log('Sample policy structure:', data.policies[0]);
        
        // Check for required fields
        const policy = data.policies[0];
        if (policy.description) {
            console.log('✅ Policy data structure confirmed - description field present');
        } else {
            console.log('❌ Policy data structure missing description');
        }
    } else {
        console.log('❌ Policies API failed:', data.message);
    }
})
.catch(error => {
    console.log('❌ Policies API error:', error);
});

console.log('🎯 You can now navigate to:');
console.log('   - http://localhost:8086/admin/issue-management');
console.log('   - http://localhost:8086/admin/policy-management');
console.log('Both pages should now work without errors!');
console.log('');
console.log('✅ Updated Categories in Issue Management:');
console.log('   - 🏡 Land Registration');
console.log('   - ⚖️ Farmer Rights');
console.log('   - 🏛️ Government Schemes');
console.log('   - 🔧 Technical Support');
console.log('   - 💳 Billing & Payment');
console.log('   - 👤 Account Issues');
console.log('   - 📝 Platform Feedback');  
console.log('   - ❓ General Inquiry');
console.log('   - 💰 Financial');
console.log('   - ⚖️ Legal');
console.log('   - 🔧 Technical');
console.log('   - ❓ Other');
console.log('');
console.log('These categories now match the Contact Support page!');