import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CodeAnalyzer from './pages/CodeAnalyzer';
import ProblemSolver from './pages/ProblemSolver';
import Settings from './pages/Settings';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import { supabase } from './lib/supabase';
import toast from 'react-hot-toast';

// Component to handle email verification and password reset
const AuthHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');

      // Handle email verification
      if (token && type === 'signup') {
        try {
          // Verify the email token
          const { error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: 'signup'
          });
          
          if (error) throw error;
          
          toast.success('Email verified successfully!');
          navigate('/app/dashboard', { replace: true });
        } catch (error: any) {
          toast.error('Email verification failed');
          navigate('/', { replace: true });
        }
      }
      
      // Handle password reset
      else if (type === 'recovery' && (accessToken || token)) {
        try {
          // Set the session for password reset
          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });
            
            if (error) throw error;
          }
          
          // Redirect to reset password page
          navigate('/reset-password', { replace: true });
        } catch (error: any) {
          toast.error('Invalid reset link');
          navigate('/', { replace: true });
        }
      }
      
      // Handle other auth callbacks
      else if (accessToken && refreshToken) {
        try {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) throw error;
          
          navigate('/app/dashboard', { replace: true });
        } catch (error: any) {
          toast.error('Authentication failed');
          navigate('/', { replace: true });
        }
      }
      
      // No valid auth parameters, redirect to home
      else {
        navigate('/', { replace: true });
      }
    };

    // Only run if we have search parameters
    if (searchParams.toString()) {
      handleAuthCallback();
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-dark border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-lg font-medium">Processing authentication...</p>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300">
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1F2937',
                color: '#E5E7EB',
                border: '1px solid #374151',
              },
            }}
          />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth/callback" element={<AuthHandler />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/app/*" element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="analyzer" element={<CodeAnalyzer />} />
                    <Route path="solver" element={<ProblemSolver />} />
                    <Route path="settings" element={<Settings />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;