import { Outlet } from 'react-router-dom';
import { Building2, ShieldCheck, UserCheck } from 'lucide-react';
import './AuthLayout.css';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-container">
        <section className="auth-brand-panel" aria-label="Career Credibility Score">
          <div className="auth-brand-header">
            <div className="brand-mark" aria-hidden="true">
              <ShieldCheck size={24} />
            </div>
            <div>
              <div className="logo">CCS</div>
              <p>Career Credibility Score</p>
            </div>
          </div>

          <div className="auth-brand-copy">
            <span className="auth-kicker">Verified professional trust</span>
            <h1>Career records built for confident hiring.</h1>
            <p>
              Sign in to manage verified work histories, candidate access, and employee credibility records.
            </p>
          </div>

          <div className="auth-proof-list" aria-label="Platform highlights">
            <div className="auth-proof-item">
              <Building2 size={18} />
              <span>Company verified</span>
            </div>
            <div className="auth-proof-item">
              <UserCheck size={18} />
              <span>Employee controlled</span>
            </div>
          </div>
        </section>

        <section className="auth-content" aria-label="Authentication form">
          <Outlet />
        </section>
      </div>
    </div>
  );
};

export default AuthLayout;
