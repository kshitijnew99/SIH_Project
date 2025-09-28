// API service layer for KisanConnect frontend
const API_BASE_URL = 'http://localhost:5001/api';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('userToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

// ==================== AUTHENTICATION API ====================

export const authAPI = {
  // Register new user
  register: async (userData: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    role: 'farmer' | 'landowner' | 'admin';
    // Role-specific fields
    aadhaar?: string;
    district?: string;
    address?: string;
    employeeId?: string;
    department?: string;
    designation?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData)
    });
    
    const result = await handleResponse(response);
    
    // Store token and user data
    if (result.success && result.token) {
      localStorage.setItem('userToken', result.token);
      localStorage.setItem('userData', JSON.stringify(result.user));
    }
    
    return result;
  },

  // Login user
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ email, password })
    });
    
    const result = await handleResponse(response);
    
    // Store token and user data
    if (result.success && result.token) {
      localStorage.setItem('userToken', result.token);
      localStorage.setItem('userData', JSON.stringify(result.user));
    }
    
    return result;
  },

  // Get current user profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    const result = await handleResponse(response);
    
    // Update stored user data
    if (result.success && result.user) {
      localStorage.setItem('userData', JSON.stringify(result.user));
    }
    
    return result;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    // Also clear any role-specific data
    localStorage.removeItem('selectedRole');
    localStorage.removeItem('registeredUsers');
    localStorage.removeItem('landListings');
  }
};

// ==================== LANDS API ====================

export const landsAPI = {
  // Get all lands with filters
  getAllLands: async (filters?: {
    status?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const url = `${API_BASE_URL}/lands${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return await handleResponse(response);
  },

  // Get user's own lands
  getMyLands: async () => {
    const response = await fetch(`${API_BASE_URL}/lands/my`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return await handleResponse(response);
  },

  // Create new land listing
  createLand: async (landData: {
    title: string;
    description: string;
    location: string;
    area: number;
    price: number;
    soilType?: string;
    waterSource?: string;
    crops?: string[];
  }) => {
    const response = await fetch(`${API_BASE_URL}/lands`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(landData)
    });
    
    return await handleResponse(response);
  }
};

// ==================== ADMIN API ====================

export const adminAPI = {
  // Get platform statistics
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/stats`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return await handleResponse(response);
  },

  // Get pending verifications
  getVerifications: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/verifications`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return await handleResponse(response);
  },

  // Get all users for management
  getUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return await handleResponse(response);
  },

  // Toggle user status (suspend/activate)
  toggleUserStatus: async (userId: string, newStatus: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/status`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status: newStatus })
    });
    
    return await handleResponse(response);
  },

  // Get all agreements for management
  getAgreements: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/agreements`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return await handleResponse(response);
  },

  // Approve agreement
  approveAgreement: async (agreementId: string, approvalNotes?: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/agreements/${agreementId}/approve`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ approvalNotes })
    });
    
    return await handleResponse(response);
  },

  // Reject agreement
  rejectAgreement: async (agreementId: string, rejectionReason: string) => {
    const response = await fetch(`${API_BASE_URL}/admin/agreements/${agreementId}/reject`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ rejectionReason })
    });
    
    return await handleResponse(response);
  },

  // Notification Management
  getNotifications: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/notifications`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return await handleResponse(response);
  },

  createNotification: async (notificationData: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/notifications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(notificationData)
    });
    
    return await handleResponse(response);
  },

  // Issue Management
  getIssues: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/issues`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return await handleResponse(response);
  },

  updateIssue: async (issueId: string, updateData: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/issues/${issueId}/update`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(updateData)
    });
    
    return await handleResponse(response);
  },

  // Policy Management
  getPolicies: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/policies`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return await handleResponse(response);
  },

  createPolicy: async (policyData: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/policies`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(policyData)
    });
    
    return await handleResponse(response);
  },

  updatePolicy: async (policyId: string, policyData: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/policies/${policyId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(policyData)
    });
    
    return await handleResponse(response);
  }
};

// ==================== UTILITY FUNCTIONS ====================

export const apiUtils = {
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    return !!(token && userData);
  },

  // Get current user data
  getCurrentUser: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  // Check if backend is healthy
  healthCheck: async () => {
    try {
      const response = await fetch('http://localhost:5001/health');
      return await response.json();
    } catch (error) {
      throw new Error('Backend server is not running');
    }
  },

  // Sync localStorage data with backend (migration helper)
  syncLocalStorageData: async () => {
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const userData = JSON.parse(localStorage.getItem('userData') || 'null');
      
      console.log('Local storage data:', {
        registeredUsers: registeredUsers.length,
        currentUser: userData?.email || 'none'
      });
      
      // TODO: Implement migration logic if needed
      return {
        success: true,
        message: 'Data sync check completed',
        localUsers: registeredUsers.length
      };
    } catch (error) {
      console.error('Data sync error:', error);
      return {
        success: false,
        message: 'Data sync failed'
      };
    }
  }
};

// ==================== ERROR HANDLING ====================

export class APIError extends Error {
  constructor(message: string, public status?: number, public code?: string) {
    super(message);
    this.name = 'APIError';
  }
}

// Export default API object
const api = {
  auth: authAPI,
  lands: landsAPI,
  admin: adminAPI,
  utils: apiUtils
};

export default api;