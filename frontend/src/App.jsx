import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

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
          path="/pets/*"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <>
                <Navbar />
                <div className="container">
                  <h1>Pet Management</h1>
                  <p>Pet CRUD operations will be implemented here</p>
                </div>
              </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/appointments/*"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <>
                <Navbar />
                <div className="container">
                  <h1>Appointments</h1>
                  <p>Appointment booking will be implemented here</p>
                </div>
              </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/vaccinations/*"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <>
                <Navbar />
                <div className="container">
                  <h1>Vaccinations</h1>
                  <p>Vaccination management will be implemented here</p>
                </div>
              </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/expenses/*"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <>
                <Navbar />
                <div className="container">
                  <h1>Expenses</h1>
                  <p>here expensives</p>
                </div>
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
          path="/trainers/*"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <>
                <Navbar />
                <div className="container">
                  <h1>Trainers</h1>
                  <p>Trainer packages will be displayed here</p>
                </div>
              </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/products/*"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <>
                <Navbar />
                <div className="container">
                  <h1>Products</h1>
                  <p>kmmk</p>
                </div>
              </>
            </ProtectedRoute>
          }
        />
        
        {/* Admin Routes */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
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
            <ProtectedRoute allowedRoles={['ADMIN']}>
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
            <ProtectedRoute allowedRoles={['ADMIN']}>
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
            <ProtectedRoute allowedRoles={['ADMIN']}>
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
                <div className="container">
                  <h1>Product Management</h1>
                  <p>Product management will be implemented here</p>
                </div>
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
                <div className="container">
                  <h1>My Appointments</h1>
                  <p>Doctor appointments will be displayed here</p>
                </div>
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
                <div className="container">
                  <h1>My Packages</h1>
                  <p>Trainer packages management will be implemented here</p>
                </div>
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
