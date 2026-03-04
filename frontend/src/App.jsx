import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Pets from './pages/Pets';
import AllExpenses from './pages/AllExpenses';
import ExpensesDashboard from './pages/ExpensesDashboard';
import Appointments from './pages/Appointments';
import Vaccinations from './pages/Vaccinations';
import TrainerPackages from './pages/TrainerPackages';
import MyPackages from './pages/MyPackages';
import DoctorAppointments from './pages/DoctorAppointments';
import Products from './pages/Products';
import AdminProducts from './pages/AdminProducts';
import Medications from './pages/Medications';
import DoctorRecords from './pages/DoctorRecords';
import Chatbot from "./pages/Chatbot";

/**
 * Main App Component
 * 
 * Defines all routes with role-based access control
 */
function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes - All authenticated users */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Dashboard />
              </>
            </ProtectedRoute>
          }
        />
        
        {/* User Routes */}
        <Route
          path="/pets"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <>
                <Navbar />
                <Pets />
              </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/pets/:petId/expenses"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <>
                <Navbar />
                <ExpensesDashboard />
              </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/appointments"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <>
                <Navbar />
                <Appointments />
              </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/vaccinations"
          element={
            <ProtectedRoute allowedRoles={['USER','DOCTOR']}>
              <>
                <Navbar />
                <Vaccinations />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/medications"
          element={
            <ProtectedRoute allowedRoles={['USER','DOCTOR']}>
              <>
                <Navbar />
                <Medications />
              </>
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/records/:petId"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <>
                <Navbar />
                <DoctorRecords />
              </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/expenses"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <>
                <Navbar />
                <AllExpenses />
              </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/adoption/*"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <>
                <Navbar />
                <div className="container">
                  <h1>Pet Adoption</h1>
                  <p>Adoption posts will be implemented here</p>
                </div>
              </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/trainers"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <>
                <Navbar />
                <TrainerPackages />
              </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/products"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <>
                <Navbar />
                <Products />
              </>
            </ProtectedRoute>
          }
        />
        
          <Route path="/chatbot" element={<Chatbot />} />

        
        {/* Admin Routes */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN','DOCTOR']}>
              <>
                <Navbar />
                <div className="container">
                  <h1>User Management</h1>
                  <p>User jnm</p>
                </div>
              </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/doctors"
          element={
            <ProtectedRoute allowedRoles={['ADMIN','DOCTOR']}>
              <>
                <Navbar />
                <div className="container">
                  <h1>Doctor Management</h1>
                  <p>Doctor mj</p>
                </div>
              </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/trainers"
          element={
            <ProtectedRoute allowedRoles={['ADMIN','DOCTOR']}>
              <>
                <Navbar />
                <div className="container">
                  <h1>Trainer Management</h1>
                  <p>Trainer management here</p>
                </div>
              </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/adoption"
          element={
            <ProtectedRoute allowedRoles={['ADMIN','DOCTOR']}>
              <>
                <Navbar />
                <div className="container">
                  <h1>Adoption Post Review</h1>
                  <p>Adoption post review will be implemented here</p>
                </div>
              </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <>
                <Navbar />
                <AdminProducts />
              </>
            </ProtectedRoute>
          }
        />
        
        {/* Doctor Routes */}
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <>
                <Navbar />
                <DoctorAppointments />
              </>
            </ProtectedRoute>
          }
        />
        
        {/* Trainer Routes */}
        <Route
          path="/trainer/packages"
          element={
            <ProtectedRoute allowedRoles={['TRAINER']}>
              <>
                <Navbar />
                <MyPackages />
              </>
            </ProtectedRoute>
          }
        />
        
        {/* Default Route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
