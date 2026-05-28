import { Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout/MainLayout';
import AuthLayout from '../layouts/AuthLayout/AuthLayout';
import DashboardLayout from '../layouts/DashboardLayout/DashboardLayout';

// Public Pages
import Landing from '../pages/Landing/Landing';
import PublicProfile from '../pages/Public/PublicProfile';

// Auth Pages
import Login from '../pages/Auth/Login';
import Signup from '../pages/Auth/Signup';
import LinkedInCallback from '../pages/Auth/LinkedInCallback';

// Company Pages
import CompanyOverview from '../pages/Company/CompanyOverview';
import CompanyEmployees from '../pages/Company/CompanyEmployees';
import VerificationQueue from '../pages/Company/VerificationQueue';
import CompanyEvaluations from '../pages/Company/CompanyEvaluations';
import ExitEvaluation from '../pages/Company/ExitEvaluation';
import CandidateProfiles from '../pages/Company/CandidateProfiles';
import CompanyOnboarding from '../pages/Company/CompanyOnboarding';
import HRManagement from '../pages/Company/HRManagement';
import Settings from '../pages/Settings/Settings';

// Employee Pages
import EmployeeProfile from '../pages/Employee/EmployeeProfile';
import EmploymentHistory from '../pages/Employee/EmploymentHistory';
import VerificationRequests from '../pages/Employee/VerificationRequests';
import ShareProfile from '../pages/Employee/ShareProfile';

// Protected Route Wrapper
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth/linkedin/callback" element={<LinkedInCallback />} />
      </Route>

      <Route path="/share/:shareId" element={<PublicProfile />} />

      <Route element={<DashboardLayout />}>
        {/* Company Routes */}
        <Route path="/company/dashboard" element={<ProtectedRoute allowedRole="company"><CompanyOverview /></ProtectedRoute>} />
        <Route path="/company/employees" element={<ProtectedRoute allowedRole="company"><CompanyEmployees /></ProtectedRoute>} />
        <Route path="/company/requests" element={<ProtectedRoute allowedRole="company"><VerificationQueue /></ProtectedRoute>} />
        <Route path="/company/reports" element={<ProtectedRoute allowedRole="company"><CompanyEvaluations /></ProtectedRoute>} />
        <Route path="/company/evaluate" element={<ProtectedRoute allowedRole="company"><ExitEvaluation /></ProtectedRoute>} />
        <Route path="/company/candidates" element={<ProtectedRoute allowedRole="company"><CandidateProfiles /></ProtectedRoute>} />
        <Route path="/company/onboarding" element={<ProtectedRoute allowedRole="company"><CompanyOnboarding /></ProtectedRoute>} />
        <Route path="/company/team" element={<ProtectedRoute allowedRole="company"><HRManagement /></ProtectedRoute>} />
        <Route path="/company/settings" element={<ProtectedRoute allowedRole="company"><Settings /></ProtectedRoute>} />

        {/* Employee Routes */}
        <Route path="/employee/dashboard" element={<ProtectedRoute allowedRole="employee"><EmployeeProfile /></ProtectedRoute>} />
        <Route path="/employee/history" element={<ProtectedRoute allowedRole="employee"><EmploymentHistory /></ProtectedRoute>} />
        <Route path="/employee/verifications" element={<ProtectedRoute allowedRole="employee"><VerificationRequests /></ProtectedRoute>} />
        <Route path="/employee/share" element={<ProtectedRoute allowedRole="employee"><ShareProfile /></ProtectedRoute>} />
        <Route path="/employee/settings" element={<ProtectedRoute allowedRole="employee"><Settings /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
