import { useState, useCallback, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { socket } from './socket';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import DataUpload from './components/DataUpload';
import AlertsView from './components/AlertsView';
import PatrolPlanner from './components/PatrolPlanner';
import ProtectedRoute from './components/ProtectedRoute';
import SecurityDashboard from './components/SecurityDashboard';
import SecurityReviewChecklist from './components/SecurityReviewChecklist';
import SecurityTest from './components/SecurityTest';

import OfficerView from './pages/OfficerView';
import CommanderView from './pages/CommanderView';
import AdminView from './pages/AdminView';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Help from './pages/Help';
import Logout from './pages/Logout';
import Login from './pages/Login';
import Unauthorized from './pages/Unauthorized';
import AssetManagement from './components/AssetManagement';
import OfficerManagement from './pages/OfficerManagement';
import Surveillance from './components/Surveillance';
import DutyAssignment from './components/DutyAssignment';
import AIDetection from './components/AIDetection';

import useAuth from './hooks/useAuth';
import { ROLES } from './utils/roleUtils';



import { Page } from './types';
import { INITIAL_ALERTS, INITIAL_REPORTS } from './constants';
import './styles/global.css';

export default function App() {
  const { isAuthenticated, user } = useAuth();
  const [currentPage, setCurrentPage] = useState(Page.Dashboard);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [reports, setReports] = useState(INITIAL_REPORTS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const addAlert = useCallback((newAlert) => {
    setAlerts((prevAlerts) => [newAlert, ...prevAlerts]);
  }, []);

  const addReport = useCallback((newReport) => {
    setReports((prevReports) => [newReport, ...prevReports]);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const onConnect = () => console.log("✅ connected:", socket.id);
    const onHello = (msg) => console.log("hello event:", msg);
    const onError = (err) => console.error("connect_error:", err);
    const onDisconnect = (reason) => console.warn("disconnected:", reason);

    socket.on("connect", onConnect);
    socket.on("hello", onHello);
    socket.on("connect_error", onError);
    socket.on("disconnect", onDisconnect);

    socket.emit("ping", "hi");

    return () => {
      socket.off("connect", onConnect);
      socket.off("hello", onHello);
      socket.off("connect_error", onError);
      socket.off("disconnect", onDisconnect);
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Dashboard:
        return <Dashboard alerts={alerts} reports={reports} />;
      case Page.DataUpload:
        return <DataUpload addAlert={addAlert} setIsLoading={setIsLoading} setError={setError} />;
      case Page.Alerts:
        return <AlertsView />;
      case Page.PatrolPlanner:
        return <PatrolPlanner setIsLoading={setIsLoading} setError={setError} />;
      case Page.Assets:
        return <AssetManagement />;
      case Page.Officers:
        return <OfficerManagement />;
      case Page.Surveillance:
        return <Surveillance />;
      case Page.DutyAssignment:
        return <DutyAssignment />;
      case Page.AIDetection:
        return <AIDetection />;
      default:
        return <Dashboard alerts={alerts} reports={reports} />;
    }
  };

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        {error && (
          <div className="fixed top-5 right-5 bg-red-500/90 text-white py-3 px-4 rounded-lg shadow-lg z-50 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span><strong>Error:</strong> {error}</span>
          </div>
        )}

        <Routes>
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/officer" element={<ProtectedRoute requiredRoles={[ROLES.FIELD_OFFICER]}><OfficerView /></ProtectedRoute>} />
          <Route path="/commander" element={<ProtectedRoute requiredRoles={[ROLES.COMMAND_CENTER]}><CommanderView /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute requiredRoles={[ROLES.ADMIN]}><AdminView /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/help" element={<ProtectedRoute><Help /></ProtectedRoute>} />
          <Route path="/logout" element={<ProtectedRoute><Logout /></ProtectedRoute>} />
          <Route path="/assets" element={<ProtectedRoute><AssetManagement /></ProtectedRoute>} />
          <Route path="/officers" element={<ProtectedRoute><OfficerManagement /></ProtectedRoute>} />
          <Route path="/surveillance" element={<ProtectedRoute><Surveillance /></ProtectedRoute>} />
          <Route path="/duty" element={<ProtectedRoute><DutyAssignment /></ProtectedRoute>} />
          <Route path="/ai-detection" element={<ProtectedRoute><AIDetection /></ProtectedRoute>} />
          <Route path="/security/dashboard" element={<ProtectedRoute requiredRoles={[ROLES.ADMIN]}><SecurityDashboard /></ProtectedRoute>} />
          <Route path="/security/review" element={<ProtectedRoute requiredRoles={[ROLES.ADMIN]}><SecurityReviewChecklist /></ProtectedRoute>} />
          <Route path="/security/test" element={<ProtectedRoute requiredRoles={[ROLES.ADMIN]}><SecurityTest /></ProtectedRoute>} />
          <Route path="/" element={<div>{renderPage()}</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}