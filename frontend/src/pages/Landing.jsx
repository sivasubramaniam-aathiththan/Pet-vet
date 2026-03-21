import { Link } from 'react-router-dom';

/**
 * Landing Page
 * 
 * Shows overview/benefits of the PetCare app
 * with login option
 */

const Landing = () => {
  const benefits = [
    {
      icon: '🐾',
      title: 'Pet Management',
      description: 'Easily manage all your pets in one place with detailed profiles and health records.'
    },
    {
      icon: '🏥',
      title: 'Health Tracking',
      description: 'Track vaccinations, medications, and appointments to keep your pets healthy.'
    },
    {
      icon: '📅',
      title: 'Easy Scheduling',
      description: 'Book appointments with veterinarians and trainers seamlessly.'
    },
    {
      icon: '🛒',
      title: 'Pet Products',
      description: 'Browse and purchase quality pet products with convenient shopping cart.'
    },
    {
      icon: '💰',
      title: 'Expense Tracking',
      description: 'Keep track of all pet-related expenses for better budget management.'
    },
    {
      icon: '🎓',
      title: 'Training Packages',
      description: 'Enroll your pets in professional training programs with expert trainers.'
    }
  ];

  const features = [
    'Multi-role support (User, Doctor, Trainer, Admin)',
    'Real-time appointment scheduling',
    'Comprehensive health records',
    'Online product store',
    'Expense management dashboard',
    'Secure authentication'
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-logo">🐾</div>
          <h1 className="hero-title">Welcome to PetCare</h1>
          <p className="hero-subtitle">
            Your all-in-one solution for pet management, health tracking, and more!
          </p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary btn-lg">
              🔐 Login to Continue
            </Link>
            <Link to="/register" className="btn btn-outline btn-lg">
              📝 Register
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <h2 className="section-title">Why Choose PetCare?</h2>
          <p className="section-subtitle">
            Everything you need to keep your pets happy and healthy
          </p>
          
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card">
                <div className="benefit-icon">{benefit.icon}</div>
                <h3 className="benefit-title">{benefit.title}</h3>
                <p className="benefit-description">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Powerful Features</h2>
          <div className="features-list">
            {features.map((feature, index) => (
              <div key={index} className="feature-item">
                <span className="feature-check">✓</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to Get Started?</h2>
          <p className="cta-text">
            Join thousands of pet owners who trust PetCare for their pet management needs.
          </p>
          <Link to="/login" className="btn btn-primary btn-lg">
            🚀 Login Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <p>© 2024 PetCare. All rights reserved. 🐾</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
