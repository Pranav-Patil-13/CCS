import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  BriefcaseBusiness, FileCheck as FileCheckCorner, LayoutDashboard, Link2, Search, 
  Settings as Settings$1, ShieldCheck, User as User$1, Users, LogOut, 
  CheckSquare as SquareCheckBig, Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isCompany = location.pathname.includes("/company");
  
  const navItems = isCompany ?
  (!user?.companyId ?
  [] :
  [
  {
    label: "Overview",
    icon: LayoutDashboard,
    path: "/company/dashboard"
  },
  {
    label: "Requests",
    icon: FileCheckCorner,
    path: "/company/requests"
  },
  {
    label: "Employees",
    icon: Users,
    path: "/company/employees"
  },
  {
    label: "Evaluations",
    icon: ShieldCheck,
    path: "/company/reports"
  },
  {
    label: "Candidates",
    icon: BriefcaseBusiness,
    path: "/company/candidates"
  },
  {
    label: "Team Access",
    icon: Lock,
    path: "/company/team"
  },
  {
    label: "Settings",
    icon: Settings$1,
    path: "/company/settings"
  }]) :
  [
  {
    label: "Profile",
    icon: User$1,
    path: "/employee/dashboard"
  },
  {
    label: "History",
    icon: BriefcaseBusiness,
    path: "/employee/history"
  },
  {
    label: "Verifications",
    icon: SquareCheckBig,
    path: "/employee/verifications"
  },
  {
    label: "Share",
    icon: Link2,
    path: "/employee/share"
  },
  {
    label: "Settings",
    icon: Settings$1,
    path: "/employee/settings"
  }];

  return (
    <div className="dashboard-layout">
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-brand-name">CCS</span>
          <span className="sidebar-brand-sub">Career Credibility Score</span>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <a key={item.path} href={item.path} onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
              }} className={`sidebar-link ${isActive ? "active" : ""}`}>
                <Icon size={20} />
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
        <div className="sidebar-footer">
          <button onClick={logout} className="sidebar-link sidebar-logout">
            <LogOut size={20} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-search">
            <Search size={16} />
            <span>Search people, requests, records</span>
          </div>
          <div className="header-profile">
            <span className="header-role-badge">
              {isCompany ? "Company Dashboard" : "Employee Dashboard"}
            </span>
            <div className={`avatar${user?.photoUrl ? " avatar--photo" : ""}`} title={user?.name} style={user?.photoUrl ? { backgroundImage: `url(${user.photoUrl})` } : {}}>
              {!user?.photoUrl && (user?.initials || "U")}
            </div>
          </div>
        </header>

        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
