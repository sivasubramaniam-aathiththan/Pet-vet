import axios from 'axios';

// Base API URL
const API_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, refreshToken, {
            headers: { 'Content-Type': 'application/json' }
          });
          
          const { accessToken, refreshToken: newRefreshToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
          
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  refreshToken: (token) => api.post('/auth/refresh', token),
};

// User API
export const userAPI = {
  getAll: () => api.get('/admin/users'),
  getDoctors: () => api.get('/admin/doctors'),
  getTrainers: () => api.get('/admin/trainers'),
  createStaff: (data) => api.post('/admin/staff', data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  toggleStatus: (id) => api.put(`/admin/users/${id}/toggle-status`),
};

// Pet API
export const petAPI = {
  getAll: () => api.get('/pets'),
  getById: (id) => api.get(`/pets/${id}`),
  create: (data) => api.post('/pets', data),
  update: (id, data) => api.put(`/pets/${id}`, data),
  delete: (id) => api.delete(`/pets/${id}`),
  getCount: () => api.get('/pets/count'),
};

// Appointment API
export const appointmentAPI = {
  getDoctors: () => api.get('/appointments/doctors'),
  getUserAppointments: () => api.get('/appointments/user'),
  getDoctorAppointments: () => api.get('/appointments/doctor'),
  getUpcomingUser: () => api.get('/appointments/user/upcoming'),
  getUpcomingDoctor: () => api.get('/appointments/doctor/upcoming'),
  book: (data) => api.post('/appointments', data),
  updateStatus: (id, status) => api.put(`/appointments/${id}/status?status=${status}`),
  cancel: (id) => api.delete(`/appointments/${id}`),
};

// Vaccination API
export const vaccinationAPI = {
  getByPet: (petId) => api.get(`/vaccinations/pet/${petId}`),
  getAll: () => api.get('/vaccinations'),
  getDueSoon: () => api.get('/vaccinations/due-soon'),
  getOverdue: () => api.get('/vaccinations/overdue'),
  create: (data) => api.post('/vaccinations', data),
  update: (id, data) => api.put(`/vaccinations/${id}`, data),
  delete: (id) => api.delete(`/vaccinations/${id}`),
};

// Medication API
export const medicationAPI = {
  getByPet: (petId) => api.get(`/medications/pet/${petId}`),
  getAll: () => api.get('/medications'),
  create: (data) => api.post('/medications', data),
  update: (id, data) => api.put(`/medications/${id}`, data),
  delete: (id) => api.delete(`/medications/${id}`),
};

// Expense API
export const expenseAPI = {
  getByPet: (petId) => api.get(`/expenses/pet/${petId}`),
  getAll: () => api.get('/expenses'),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
  getMonthlySummary: (petId) => api.get(`/expenses/pet/${petId}/summary/monthly`),
  getCategorySummary: (petId) => api.get(`/expenses/pet/${petId}/summary/category`),
  getTotal: (petId) => api.get(`/expenses/pet/${petId}/total`),
};

// Adoption API
export const adoptionAPI = {
  getApproved: () => api.get('/adoption/approved'),
  getPending: () => api.get('/adoption/pending'),
  getMyPosts: () => api.get('/adoption/my-posts'),
  create: (data) => api.post('/adoption', data),
  approve: (id) => api.put(`/adoption/${id}/approve`),
  reject: (id) => api.put(`/adoption/${id}/reject`),
  delete: (id) => api.delete(`/adoption/${id}`),
};

// Trainer Package API
export const trainerPackageAPI = {
  getActive: () => api.get('/trainer-packages/active'),
  getMyPackages: () => api.get('/trainer-packages/my-packages'),
  getByTrainer: (trainerId) => api.get(`/trainer-packages/trainer/${trainerId}`),
  create: (data) => api.post('/trainer-packages', data),
  update: (id, data) => api.put(`/trainer-packages/${id}`, data),
  delete: (id) => api.delete(`/trainer-packages/${id}`),
  toggleStatus: (id) => api.put(`/trainer-packages/${id}/toggle-status`),
};

// Product API
export const productAPI = {
  getActive: () => api.get('/products/active'),
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  getByCategory: (category) => api.get(`/products/category/${category}`),
  search: (name) => api.get(`/products/search?name=${name}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  toggleStatus: (id) => api.put(`/products/${id}/toggle-status`),
  getCategories: () => api.get('/products/categories'),
};

// Admin Dashboard API
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
};

export default api;
