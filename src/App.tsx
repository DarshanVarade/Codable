import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CodeAnalyzer from './pages/CodeAnalyzer';
import ProblemSolver from './pages/ProblemSolver';
import Settings from './pages/Settings';
import AdminPanel from './pages/AdminPanel';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
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
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      const errorCode = searchParams.get('error_code');

      // Handle errors - redirect to reset password page for expired tokens
      if (error) {
        console.error('Auth callback error:', error, errorDescription);
        
        if (errorCode === 'otp_expired' || error === 'access_denied') {
          toast.error('Reset link has expired. Please request a new one.');
          // Redirect to reset password page where user can enter email again
          navigate('/reset-password', { replace: true });
          return;
        }
        
        toast.error(errorDescription || 'Authentication failed');
        navigate('/', { replace: true });
        return;
      }

      // Handle password reset (recovery type)
      if (type === 'recovery' || (accessToken && refreshToken && searchParams.toString().includes('type=recovery'))) {
        try {
          // Set the session for password reset
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken!,
            refresh_token: refreshToken!
          });
          
          if (sessionError) {
            console.error('Session error:', sessionError);
            throw sessionError;
          }
          
          // Redirect to reset password page
          navigate('/reset-password', { replace: true });
          return;
        } catch (error: any) {
          console.error('Password reset session error:', error);
          toast.error('Invalid or expired reset link. Please request a new one.');
          navigate('/reset-password', { replace: true });
          return;
        }
      }

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
          return;
        } catch (error: any) {
          console.error('Email verification error:', error);
          toast.error('Email verification failed');
          navigate('/', { replace: true });
          return;
        }
      }
      
      // Handle other auth callbacks (like magic links)
      if (accessToken && refreshToken) {
        try {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) throw error;
          
          toast.success('Successfully authenticated!');
          navigate('/app/dashboard', { replace: true });
          return;
        } catch (error: any) {
          console.error('Auth session error:', error);
          toast.error('Authentication failed');
          navigate('/', { replace: true });
          return;
        }
      }
      
      // No valid auth parameters, redirect to home
      console.log('No valid auth parameters found, redirecting to home');
      navigate('/', { replace: true });
    };

    // Only run if we have search parameters
    if (searchParams.toString()) {
      handleAuthCallback();
    } else {
      // No parameters at all, redirect to home
      navigate('/', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-primary-dark border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-lg font-medium">Processing authentication...</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          Please wait while we verify your request
        </p>
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
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              </ProtectedRoute>
            } />
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