export const BASE_URL = import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, '') : 'http://localhost:5000';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || `${BASE_URL}/api`;

// Helper to get auth headers
const getHeaders = (token) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth API
  auth: {
    login: async (email, password) => {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const err = await response.json();
        const customErr = new Error(err.message || 'Login failed');
        if (err.isUnverified) {
          customErr.isUnverified = true;
          customErr.email = err.email;
        }
        throw customErr;
      }
      return response.json();
    },
    register: async (name, email, password) => {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ name, email, password }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Registration failed');
      }
      return response.json();
    },
    verifyOTP: async (email, otp) => {
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email, otp }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'OTP verification failed');
      }
      return response.json();
    },
    resendOTP: async (email) => {
      const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ email }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to resend OTP');
      }
      return response.json();
    },
    getMe: async (token) => {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: getHeaders(token),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      return response.json();
    },
  },

  // Services API
  services: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/services`);
      if (!response.ok) throw new Error('Failed to fetch services');
      return response.json();
    },
    create: async (serviceData, token) => {
      const response = await fetch(`${API_BASE_URL}/services`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(serviceData),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to create service');
      }
      return response.json();
    },
    update: async (id, serviceData, token) => {
      const response = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify(serviceData),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to update service');
      }
      return response.json();
    },
    delete: async (id, token) => {
      const response = await fetch(`${API_BASE_URL}/services/${id}`, {
        method: 'DELETE',
        headers: getHeaders(token),
      });
      if (!response.ok) throw new Error('Failed to delete service');
      return response.json();
    },
  },

  // Projects API
  projects: {
    getAll: async (category = '') => {
      const url = category && category !== 'All' 
        ? `${API_BASE_URL}/projects?category=${encodeURIComponent(category)}`
        : `${API_BASE_URL}/projects`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch projects');
      return response.json();
    },
    create: async (projectData, token) => {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: getHeaders(token),
        body: JSON.stringify(projectData),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to create project');
      }
      return response.json();
    },
    update: async (id, projectData, token) => {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: getHeaders(token),
        body: JSON.stringify(projectData),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to update project');
      }
      return response.json();
    },
    delete: async (id, token) => {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
        headers: getHeaders(token),
      });
      if (!response.ok) throw new Error('Failed to delete project');
      return response.json();
    },
  },

  // Orders API
  orders: {
    create: async (formData, token) => {
      // Note: for file uploads, we do NOT set 'Content-Type' header.
      // Fetch will automatically set it to 'multipart/form-data' with the correct boundary when passing FormData.
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers,
        body: formData, // FormData contains fields and files
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to submit order');
      }
      return response.json();
    },
    getAll: async (token) => {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'GET',
        headers: getHeaders(token),
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    },
    getMyOrders: async (token) => {
      const response = await fetch(`${API_BASE_URL}/orders/myorders`, {
        method: 'GET',
        headers: getHeaders(token),
      });
      if (!response.ok) throw new Error('Failed to fetch your orders');
      return response.json();
    },
    updateStatus: async (id, statusOrFormData, token) => {
      const isFormData = statusOrFormData instanceof FormData;
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      let body;
      if (isFormData) {
        body = statusOrFormData;
      } else {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify({ status: statusOrFormData });
      }

      const response = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers,
        body,
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to update order status');
      }
      return response.json();
    },
    pay: async (id, screenshotFormData, token) => {
      const headers = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      const response = await fetch(`${API_BASE_URL}/orders/${id}/pay`, {
        method: 'PUT',
        headers,
        body: screenshotFormData,
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to process payment');
      }
      return response.json();
    },
    fixAmount: async (id, amount, token) => {
      const response = await fetch(`${API_BASE_URL}/orders/${id}/fix-amount`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to fix project amount');
      }
      return response.json();
    },
    acceptAmount: async (id, token) => {
      const response = await fetch(`${API_BASE_URL}/orders/${id}/accept-amount`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to accept project amount');
      }
      return response.json();
    },
    markReviewed: async (id) => {
      const response = await fetch(`${API_BASE_URL}/orders/${id}/review`, {
        method: 'PUT',
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to mark as reviewed');
      }
      return response.json();
    },
    delete: async (id, token) => {
      const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
        method: 'DELETE',
        headers: getHeaders(token),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to delete order');
      }
      return response.json();
    },
  },

  // Feedback API
  feedback: {
    getAll: async () => {
      const response = await fetch(`${API_BASE_URL}/feedback`);
      if (!response.ok) throw new Error('Failed to fetch feedbacks');
      return response.json();
    },
    submit: async (feedbackData) => {
      const response = await fetch(`${API_BASE_URL}/feedback`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(feedbackData),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to submit feedback');
      }
      return response.json();
    },
    delete: async (id, token) => {
      const response = await fetch(`${API_BASE_URL}/feedback/${id}`, {
        method: 'DELETE',
        headers: getHeaders(token),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to delete feedback');
      }
      return response.json();
    },
  },

  // Contact API
  contact: {
    send: async (contactData) => {
      const response = await fetch(`${API_BASE_URL}/contact`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(contactData),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to send contact message');
      }
      return response.json();
    },
  },
};
