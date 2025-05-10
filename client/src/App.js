import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './(pages)/home/page';
import AuthPage from './(pages)/auth/page';
import Dashboard from './(pages)/dashboard/page';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import ProfilePage from './(pages)/dashboard/profile';
import UploadPage from './(pages)/dashboard/upload';
import FilesPage from './(pages)/dashboard/files';
import { AuthProvider } from './context/AuthContext';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* Protected routes with nested routes */}
          <Route 
            path="/dashboard/*" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route path="upload" element={<UploadPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="files" element={<FilesPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
