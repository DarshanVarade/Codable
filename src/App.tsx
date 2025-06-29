import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useSearchParams, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CodeAnalyzer from './pages/CodeAnalyzer';
import ProblemSolver from './pages/ProblemSolver';
import CodableAI from './pages/CodableAI';
import Settings from './pages/Settings';
import AdminPanel from './pages/AdminPanel';
import ResetPassword from './pages/ResetPassword';
import WelcomeGuide from './pages/WelcomeGuide';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { ThemeProvider } from './context/ThemeContext';
import { supabase, auth } from './lib/supabase';
import toast from 'react-hot-toast';

// Component to handle email verification and magic link authentication
const AuthHandler: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Get parameters from both search params and hash
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');
      const errorCode = searchParams.get('error_code');

      // Also check hash parameters (for OAuth flows and magic links)
      const hash = window.location.hash.substring(1);
      const hashParams = new URLSearchParams(hash);
      const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token');
      const hashType = hashParams.get('type') || type;
      const hashError = hashParams.get('error') || error;

      console.log('Auth callback params:', {
        token,
        type: hashType,
        accessToken: accessToken ? 'present' : 'missing',
        refreshToken: refreshToken ? 'present' : 'missing',
        error: hashError,
        errorDescription,
        errorCode
      });

      // Handle errors
      if (hashError || error) {
        console.error('Auth callback error:', hashError || error, errorDescription);
        
        if (errorCode === 'otp_expired' || hashError === 'access_denied') {
          toast.error('Link has expired. Please request a new one.');
        } else {
          toast.error(errorDescription || 'Authentication failed');
        }
        
        navigate('/', { replace: true });
        return;
      }

      // Handle magic link authentication (magiclink type)
      if (hashType === 'magiclink' && accessToken && refreshToken) {
        try {
          console.log('Processing magic link authentication');
          
          // Set the session for magic link authentication
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (sessionError) {
            console.error('Magic link session error:', sessionError);
            throw sessionError;
          }
          
          // Check if this is a new user signup (check for pending user data)
          const pendingSignupData = localStorage.getItem('pendingSignupData');
          if (pendingSignupData) {
            try {
              const userData = JSON.parse(pendingSignupData);
              console.log('Found pending signup data, creating account with:', userData);
              
              // Create the account with the stored data
              const { error: signUpError } = await auth.signUp(userData.email, userData.password, {
                full_name: userData.full_name
              });
              
              if (signUpError && !signUpError.message.includes('User already registered')) {
                console.error('Error creating account:', signUpError);
                throw signUpError;
              }
              
              // Clear the pending data
              localStorage.removeItem('pendingSignupData');
              
              toast.success('Account created successfully! Welcome to Codable!');
            } catch (error: any) {
              console.error('Error processing pending signup:', error);
              // Continue with normal magic link flow even if signup fails
              toast.success('Successfully signed in with magic link!');
            }
          } else {
            console.log('Magic link authentication successful for existing user');
            toast.success('Successfully signed in with magic link!');
          }
          
          // Always redirect to dashboard for magic link authentication
          navigate('/app/dashboard', { replace: true });
          return;
        } catch (error: any) {
          console.error('Magic link authentication error:', error);
          toast.error('Magic link authentication failed. Please try again.');
          navigate('/', { replace: true });
          return;
        }
      }

      // Handle password reset (recovery type)
      if (hashType === 'recovery' && accessToken && refreshToken) {
        try {
          console.log('Processing password reset with valid tokens');
          
          // Set the session for password reset
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (sessionError) {
            console.error('Session error:', sessionError);
            throw sessionError;
          }
          
          console.log('Session set successfully, redirecting to reset password page');
          
          // Redirect to reset password page with a success message
          toast.success('Reset link verified! Please enter your new password.');
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
          console.log('Processing email verification');
          
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
      
      // Handle other auth callbacks (like OAuth or general magic links)
      if (accessToken && refreshToken && !hashType) {
        try {
          console.log('Processing general auth callback');
          
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

    // Only run if we have search parameters or hash
    if (searchParams.toString() || window.location.hash) {
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
                    <Route path="welcome" element={<WelcomeGuide />} />
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="analyzer" element={<CodeAnalyzer />} />
                    <Route path="solver" element={<ProblemSolver />} />
                    <Route path="ai" element={<CodableAI />} />
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