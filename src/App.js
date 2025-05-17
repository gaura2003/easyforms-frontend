import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import GlobalStyle from './styles/GlobalStyle';
import theme from './styles/theme';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateForm from './pages/CreateForm';
import FormDetail from './pages/FormDetail';
import Submissions from './pages/Submissions';
import Account from './pages/Account';
import Pricing from './pages/Pricing';
import NotFound from './pages/NotFound';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pricing" element={<Pricing />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/forms/create" element={
              <ProtectedRoute>
                <CreateForm />
              </ProtectedRoute>
            } />
            
            <Route path="/forms/:formId" element={
              <ProtectedRoute>
                <FormDetail />
              </ProtectedRoute>
            } />
            
            <Route path="/forms/:formId/submissions" element={
              <ProtectedRoute>
                <Submissions />
              </ProtectedRoute>
            } />
            
            <Route path="/account" element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
