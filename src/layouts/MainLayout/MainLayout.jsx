import { Link, Outlet } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <header className="main-header">
        <div className="container">
          <div className="logo">CCS <span className="logo-full-form">Career Credibility Score</span></div>
          <nav className="main-nav">
            <Link to="/login" className="nav-link">Log in</Link>
            <Link to="/signup" className="nav-link nav-link-primary">Sign up</Link>
          </nav>
        </div>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="main-footer">
        <div className="container">
          <p className="text-muted">© 2026 Career Credibility Score. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
