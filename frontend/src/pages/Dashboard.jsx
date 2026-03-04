import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI, petAPI, appointmentAPI, vaccinationAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";

/**
 * Dashboard Page
 * 
 * Displays different content based on user role
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
    return <div className="container">Loading...</div>;
  }

  // Admin Dashboard
  if (user?.role === 'ADMIN') {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p>Welcome back, {user?.firstName}!</p>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats?.totalUsers || 0}</div>
            <div className="stat-label">Total Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats?.totalRegularUsers || 0}</div>
            <div className="stat-label">Regular Users</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats?.totalDoctors || 0}</div>
            <div className="stat-label">Doctors</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats?.totalTrainers || 0}</div>
            <div className="stat-label">Trainers</div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="card-header">Quick Actions</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="/admin/users" className="btn btn-primary">Manage Users</a>
            <a href="/admin/doctors" className="btn btn-primary">Manage Doctors</a>
            <a href="/admin/trainers" className="btn btn-primary">Manage Trainers</a>
            <a href="/admin/adoption" className="btn btn-primary">Review Adoption Posts</a>
          </div>
        </div>
      </div>
    );
  }

  // User Dashboard
  if (user?.role === 'USER') {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">User Dashboard</h1>
          <p>Welcome back, {user?.firstName}!</p>
        </div>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats?.totalPets || 0}</div>
            <div className="stat-label">My Pets</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats?.upcomingAppointments || 0}</div>
            <div className="stat-label">Upcoming Appointments</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats?.dueVaccinations || 0}</div>
            <div className="stat-label">Vaccinations Due</div>
          </div>
        </div>
        
        <div className="card">
          <h3 className="card-header">Quick Actions</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <a href="/pets" className="btn btn-primary">My Pets</a>
            <a href="/appointments" className="btn btn-primary">Book Appointment</a>
            <a href="/vaccinations" className="btn btn-primary">Vaccinations</a>
            <a href="/adoption" className="btn btn-primary">Adoption</a>
              <Link to="/chatbot" className="btn btn-primary">Help_Chat</Link>


          </div>
        </div>
      </div>
    );
  }

  // Doctor Dashboard
  if (user?.role === 'DOCTOR') {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Doctor Dashboard</h1>
          <p>Welcome back, Dr. {user?.lastName}!</p>
        </div>
        
        <div className="card">
          <h3 className="card-header">Quick Actions</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="/doctor/appointments" className="btn btn-primary">View Appointments</a>
          </div>
        </div>
      </div>
    );
  }

  // Trainer Dashboard
  if (user?.role === 'TRAINER') {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Trainer Dashboard</h1>
          <p>Welcome back, {user?.firstName}!</p>
        </div>
        
        <div className="card">
          <h3 className="card-header">Quick Actions</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="/trainer/packages" className="btn btn-primary">My Packages</a>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default Dashboard;
