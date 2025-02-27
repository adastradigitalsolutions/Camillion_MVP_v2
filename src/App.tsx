import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Search from './pages/Search';
import Training from './pages/Training';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import Onboarding from './pages/Onboarding';
import Subscription from './pages/Subscription';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem('user');
  const onboardingCompleted = localStorage.getItem('onboardingCompleted');
  
  if (!user) {
    return <Navigate to="/" replace />;
  }
  
  // Redirect to onboarding if not completed
  if (!onboardingCompleted && window.location.pathname !== '/onboarding') {
    return <Navigate to="/onboarding" replace />;
  }
  
  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <Router>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          } />
          <Route path="/subscription" element={
            <ProtectedRoute>
              <Subscription />
            </ProtectedRoute>
          } />
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/search" element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          } />
          <Route path="/training" element={
            <ProtectedRoute>
              <Training />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;