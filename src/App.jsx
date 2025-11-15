import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import WorkspaceName from './pages/WorkspaceName';
import WorkspaceIntro from './pages/WorkspaceIntro';
import Templates from './pages/Templates';
import Sync from './pages/Sync';
import Overview from './pages/Overview';
import TeamSetup from './pages/TeamSetup';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Admin Components
import AdminLayout from './admin/components/AdminLayout';
import FrameworkDashboard from './admin/pages/FrameworkDashboard';
import DomainView from './admin/pages/DomainView';
import CategoryView from './admin/pages/CategoryView';
import SubcategoryView from './admin/pages/SubcategoryView';
import ControlList from './admin/pages/ControlList';
import QuestionList from './admin/pages/QuestionList';
import EvidenceList from './admin/pages/EvidenceList';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes with Layout (Header + Footer) */}
        <Route element={<Layout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/workspace-name" element={<WorkspaceName />} />
          <Route path="/workspace-intro" element={<WorkspaceIntro />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/sync" element={<Sync />} />
          <Route path="/overview" element={<Overview />} />
          <Route path="/team-setup" element={<TeamSetup />} />
          <Route path="/pricing" element={<Pricing />} />
        </Route>

        {/* Auth Routes without Layout (Full Screen) */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Routes with AdminLayout (Sidebar + Content) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<FrameworkDashboard />} />
          <Route path="frameworks" element={<FrameworkDashboard />} />
          <Route path="domains" element={<DomainView />} />
          <Route path="categories" element={<CategoryView />} />
          <Route path="subcategories" element={<SubcategoryView />} />
          <Route path="controls" element={<ControlList />} />
          <Route path="questions" element={<QuestionList />} />
          <Route path="evidence" element={<EvidenceList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;