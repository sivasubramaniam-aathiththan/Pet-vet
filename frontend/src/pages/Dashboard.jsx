import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI, petAPI, appointmentAPI, vaccinationAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";

/**
 * Dashboard Page
 * 
 * Displays different content based on user role
 * Professional styled dashboard with animated stats
 */
const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      if (user?.role === 'ADMIN') {
        const response = await adminAPI.getDashboard();
        setStats(response.data.data);
      } else if (user?.role === 'USER') {
        // Fetch user-specific stats
        const [petsRes, appointmentsRes, vaccinationsRes] = await Promise.all([
          petAPI.getCount(),
          appointmentAPI.getUpcomingUser(),
          vaccinationAPI.getDueSoon(),
        ]);
        
        setStats({
          totalPets: petsRes.data.data,
          upcomingAppointments: appointmentsRes.data.data?.length || 0,
          dueVaccinations: vaccinationsRes.data.data?.length || 0,
        });
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-container" style={{ padding: '4rem' }}>
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  if (user?.role === 'ADMIN') {
    return (
      <div className="dashboard container">
        <div className="dashboard-header animate-fadeInUp">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, {user?.firstName}! Here's what's happening today.</p>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card animate-fadeInUp stagger-1">
            <div className="stat-card-icon primary">👥</div>
            <div className="stat-value">{stats?.totalUsers || 0}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card animate-fadeInUp stagger-2">
            <div className="stat-card-icon success">🧑‍💼</div>
            <div className="stat-value">{stats?.totalRegularUsers || 0}</div>
            <div className="stat-label">Regular Users</div>
          </div>
          <div className="stat-card animate-fadeInUp stagger-3">
            <div className="stat-card-icon warning">👨‍⚕️</div>
            <div className="stat-value">{stats?.totalDoctors || 0}</div>
            <div className="stat-label">Doctors</div>
          </div>
          <div className="stat-card animate-fadeInUp stagger-4">
            <div className="stat-card-icon info">🎓</div>
            <div className="stat-value">{stats?.totalTrainers || 0}</div>
            <div className="stat-label">Trainers</div>
          </div>
        </div>
        
        <div className="card animate-fadeInUp stagger-5">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <Link to="/admin/users" className="quick-action-btn">
              <span>👥</span> Manage Users
            </Link>
            <Link to="/admin/doctors" className="quick-action-btn">
              <span>👨‍⚕️</span> Manage Doctors
            </Link>
            <Link to="/admin/trainers" className="quick-action-btn">
              <span>🎓</span> Manage Trainers
            </Link>
            <Link to="/admin/adoption" className="quick-action-btn">
              <span>🏠</span> Review Adoption Posts
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // User Dashboard
  if (user?.role === 'USER') {
    return (
      <div className="dashboard container">
        <div className="dashboard-header animate-fadeInUp">
          <h1 className="dashboard-title">User Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, {user?.firstName}! Here's your pet management overview.</p>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card animate-fadeInUp stagger-1">
            <div className="stat-card-icon primary">🐾</div>
            <div className="stat-value">{stats?.totalPets || 0}</div>
            <div className="stat-label">My Pets</div>
          </div>
          <div className="stat-card animate-fadeInUp stagger-2">
            <div className="stat-card-icon success">📅</div>
            <div className="stat-value">{stats?.upcomingAppointments || 0}</div>
            <div className="stat-label">Upcoming Appointments</div>
          </div>
          <div className="stat-card animate-fadeInUp stagger-3">
            <div className="stat-card-icon warning">💉</div>
            <div className="stat-value">{stats?.dueVaccinations || 0}</div>
            <div className="stat-label">Vaccinations Due</div>
          </div>
        </div>
        
        <div className="card animate-fadeInUp stagger-4">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <Link to="/pets" className="quick-action-btn">
              <span>🐾</span> My Pets
            </Link>
            <Link to="/appointments" className="quick-action-btn">
              <span>📅</span> Book Appointment
            </Link>
            <Link to="/vaccinations" className="quick-action-btn">
              <span>💉</span> Vaccinations
            </Link>
            <Link to="/adoption" className="quick-action-btn">
              <span>🏠</span> Adoption
            </Link>
            <Link to="/chatbot" className="quick-action-btn">
              <span>🤖</span> Help Chat
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Doctor Dashboard
  if (user?.role === 'DOCTOR') {
    return (
      <div className="dashboard container">
        <div className="dashboard-header animate-fadeInUp">
          <h1 className="dashboard-title">Doctor Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, Dr. {user?.lastName}! Here's your schedule overview.</p>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card-gradient primary animate-fadeInUp stagger-1">
            <div className="stat-card-icon">📅</div>
            <div className="stat-value">{stats?.todayAppointments || 0}</div>
            <div className="stat-label">Today's Appointments</div>
          </div>
          <div className="stat-card-gradient success animate-fadeInUp stagger-2">
            <div className="stat-card-icon">✅</div>
            <div className="stat-value">{stats?.completedAppointments || 0}</div>
            <div className="stat-label">Completed Today</div>
          </div>
        </div>
        
        <div className="card animate-fadeInUp stagger-3">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <Link to="/doctor/appointments" className="quick-action-btn">
              <span>📅</span> View Appointments
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Trainer Dashboard
  if (user?.role === 'TRAINER') {
    return (
      <div className="dashboard container">
        <div className="dashboard-header animate-fadeInUp">
          <h1 className="dashboard-title">Trainer Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back, {user?.firstName}! Here's your training overview.</p>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card-gradient info animate-fadeInUp stagger-1">
            <div className="stat-card-icon">📦</div>
            <div className="stat-value">{stats?.totalPackages || 0}</div>
            <div className="stat-label">My Packages</div>
          </div>
          <div className="stat-card-gradient success animate-fadeInUp stagger-2">
            <div className="stat-card-icon">✅</div>
            <div className="stat-value">{stats?.activeClients || 0}</div>
            <div className="stat-label">Active Clients</div>
          </div>
        </div>
        
        <div className="card animate-fadeInUp stagger-3">
          <div className="card-header">
            <h3 className="card-title">Quick Actions</h3>
          </div>
          <div className="quick-actions">
            <Link to="/trainer/packages" className="quick-action-btn">
              <span>📦</span> My Packages
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Dashboard;
