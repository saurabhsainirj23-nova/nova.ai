import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Events from '../pages/Events';
import EventDetails from '../pages/EventDetails';
import GetTicket from '../pages/GetTicket';
import BasicRegistration from '../pages/BasicRegistration';
import TicketRegistration from '../pages/TicketRegistration';
import TicketConfirmation from '../pages/TicketConfirmation';
import AuthPage from '../pages/AuthPage';
import Contact from '../pages/Contact';
import FAQ from '../pages/FAQ';
import Dashboard from '../pages/Dashboard';
import AdminDashboard from '../pages/AdminDashboard';
import EditEvent from '../pages/EditEvent';
import NotFound from '../pages/NotFound';
import MakeAdmin from '../pages/MakeAdmin';
import ManageUsers from '../pages/ManageUsers';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminRoute from '../components/AdminRoute';


const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/basic-registration" element={<BasicRegistration />} />
      <Route path="/get-ticket" element={<GetTicket />} />
      <Route path="/ticket-registration" element={
        <ProtectedRoute>
          <TicketRegistration />
        </ProtectedRoute>
      } />
      <Route path="/ticket-confirmation/:bookingId" element={
        <ProtectedRoute>
          <TicketConfirmation />
        </ProtectedRoute>
      } />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/signup" element={<AuthPage />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faq" element={<FAQ />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/admin" element={
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      } />
      
      <Route path="/events/:id/edit" element={
        <AdminRoute>
          <EditEvent />
        </AdminRoute>
      } />
      
      <Route path="/make-admin" element={
        <ProtectedRoute>
          <MakeAdmin />
        </ProtectedRoute>
      } />
      
      <Route path="/user-management" element={
        <AdminRoute>
          <ManageUsers />
        </AdminRoute>
      } />
      
      <Route path="/manage-users" element={
        <AdminRoute>
          <ManageUsers />
        </AdminRoute>
      } />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
