import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';
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
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';
import AdminDoctors from './pages/AdminDoctors';
import AdminTrainers from './pages/AdminTrainers';

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
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes - All authenticated users */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <div className="page-wrapper">
                  <Dashboard />
                </div>
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
                <div className="page-wrapper">
                  <Pets />
                </div>
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
                <div className="page-wrapper">
                  <ExpensesDashboard />
                </div>
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
                <div className="page-wrapper">
                  <Appointments />
                </div>
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
                <div className="page-wrapper">
                  <Vaccinations />
                </div>
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
                <div className="page-wrapper">
                  <Medications />
                </div>
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
                <div className="page-wrapper">
                  <DoctorRecords />
                </div>
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
                <div className="page-wrapper">
                  <AllExpenses />
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
                <div className="page-wrapper">
                  <div className="container">
                    <div className="card">
                      <div className="card-header">
                        <h2 className="card-title">🏠 Pet Adoption</h2>
                      </div>
                      <p className="text-muted">Adoption features coming soon...</p>
                      <div className="empty-state" style={{ padding: '2rem' }}>
                        <div className="empty-state-icon">🐕</div>
                        <h3 className="empty-state-title">Coming Soon</h3>
                        <p className="empty-state-description">Find your perfect pet companion through our adoption program.</p>
                      </div>
                    </div>
                  </div>
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
                <div className="page-wrapper">
                  <TrainerPackages />
                </div>
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
                <div className="page-wrapper">
                  <Products />
                </div>
              </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/cart"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <>
                <Navbar />
                <div className="page-wrapper">
                  <Cart />
                </div>
              </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={['USER']}>
              <>
                <Navbar />
                <div className="page-wrapper">
                  <Orders />
                </div>
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
                <div className="page-wrapper">
                  <AdminUsers />
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
                <div className="page-wrapper">
                  <AdminDoctors />
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
                <div className="page-wrapper">
                  <AdminTrainers />
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
                <div className="page-wrapper">
                  <div className="container">
                    <div className="card">
                      <h2 className="card-title">🏠 Adoption Post Review</h2>
                      <p className="text-muted">Adoption post review features coming soon...</p>
                    </div>
                  </div>
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
                <div className="page-wrapper">
                  <AdminProducts />
                </div>
              </>
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <>
                <Navbar />
                <div className="page-wrapper">
                  <AdminOrders />
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
                <div className="page-wrapper">
                  <DoctorAppointments />
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
                <div className="page-wrapper">
                  <MyPackages />
                </div>
              </>
            </ProtectedRoute>
          }
        />
        
        {/* Default Route */}
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
