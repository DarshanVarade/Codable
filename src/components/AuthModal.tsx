import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff, ArrowLeft, CheckCircle, AlertCircle, RefreshCw, Crown, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { auth, db } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'signin' | 'signup' | 'forgot' | 'reset' | 'verify' | 'instructions' | 'admin' | 'magic-sent' | 'signup-success';

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<AuthStep>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const { signIn, signUp, sendMagicLink, resetPassword, updatePassword, resendVerification } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError(null);

    try {
      if (step === 'signin') {
        const { error } = await signIn(email, password);
        if (error) {
          // Handle specific authentication errors
          if (error.message.includes('Invalid login credentials')) {
            setAuthError('Invalid email or password. Please check your credentials and try again.');
          } else if (error.message.includes('Email not confirmed')) {
            setAuthError('Please verify your email address before signing in. Check your inbox for a verification link.');
            // Optionally show resend verification option
            setTimeout(() => {
              setStep('verify');
            }, 2000);
          } else if (error.message.includes('Too many requests')) {
            setAuthError('Too many login attempts. Please wait a few minutes before trying again.');
          } else {
            setAuthError(error.message || 'An error occurred during sign in.');
          }
          throw error;
        }
        toast.success('Welcome back!');
        onClose();
      } else if (step === 'admin') {
        // Handle admin login
        try {
          // First verify admin credentials using the secure RPC function
          const isValidAdmin = await db.verifyAdminCredentials(email, password);
          
          if (!isValidAdmin) {
            setAuthError('Invalid admin credentials. Please check your email and password.');
            throw new Error('Invalid admin credentials');
          }

          // If admin credentials are valid, sign in normally
          // Admin users should also exist in the regular auth system
          const { error: signInError } = await signIn(email, password);
          
          if (signInError) {
            // If the admin user doesn't exist in auth.users, they need to sign up first
            if (signInError.message.includes('Invalid login credentials')) {
              setAuthError('Admin account not found in authentication system. Please contact system administrator.');
            } else {
              setAuthError(signInError.message || 'Admin authentication failed.');
            }
            throw signInError;
          }

          toast.success('Welcome, Administrator!');
          onClose();
          navigate('/admin');
        } catch (error: any) {
          if (!authError) {
            setAuthError('Admin authentication failed. Please try again.');
          }
          throw error;
        }
      } else if (step === 'signup') {
        // Instead of creating account directly, send magic link for verification
        const { error } = await sendMagicLink(email);
        if (error) {
          if (error.message.includes('User already registered')) {
            setAuthError('An account with this email already exists. Please sign in instead or use the magic link option.');
          } else if (error.message.includes('Invalid email')) {
            setAuthError('Please enter a valid email address.');
          } else {
            setAuthError(error.message || 'An error occurred while sending magic link.');
          }
          throw error;
        }
        
        // Store user data for when they click the magic link
        localStorage.setItem('pendingUserData', JSON.stringify({
          email,
          full_name: fullName,
          password // We'll use this to create the account when they verify
        }));
        
        setStep('signup-success');
      } else if (step === 'forgot') {
        // Send magic link instead of password reset
        const { error } = await sendMagicLink(email);
        if (error) {
          if (error.message.includes('User not found')) {
            setAuthError('No account found with this email address.');
          } else {
            setAuthError(error.message || 'An error occurred while sending magic link.');
          }
          throw error;
        }
        setStep('magic-sent');
      } else if (step === 'reset') {
        if (password !== confirmPassword) {
          setAuthError('Passwords do not match');
          throw new Error('Passwords do not match');
        }
        if (password.length < 6) {
          setAuthError('Password must be at least 6 characters');
          throw new Error('Password must be at least 6 characters');
        }
        const { error } = await updatePassword(password);
        if (error) {
          setAuthError(error.message || 'An error occurred while updating password.');
          throw error;
        }
        toast.success('Password updated successfully!');
        setStep('signin');
        resetForm();
      }
    } catch (error: any) {
      // Error is already handled above, just prevent the success flow
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) {
      setAuthError('Please enter your email address first.');
      return;
    }

    setLoading(true);
    setAuthError(null);

    try {
      const { error } = await resendVerification(email);
      if (error) {
        setAuthError(error.message || 'Failed to resend verification email.');
      } else {
        toast.success('Verification email sent! Check your inbox.');
      }
    } catch (error: any) {
      setAuthError('Failed to resend verification email.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendMagicLink = async () => {
    if (!email) {
      setAuthError('Please enter your email address first.');
      return;
    }

    setLoading(true);
    setAuthError(null);

    try {
      const { error } = await sendMagicLink(email);
      if (error) {
        setAuthError(error.message || 'Failed to resend magic link.');
      } else {
        toast.success('Magic link sent! Check your inbox.');
      }
    } catch (error: any) {
      setAuthError('Failed to resend magic link.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setResetToken('');
    setAuthError(null);
  };

  const handleCancel = () => {
    navigate('/');
    onClose();
    resetForm();
    setStep('signin');
  };

  const handleBack = () => {
    setAuthError(null);
    if (step === 'signup' || step === 'forgot' || step === 'admin' || step === 'magic-sent' || step === 'signup-success') {
      setStep('signin');
    } else if (step === 'reset') {
      setStep('forgot');
    } else if (step === 'instructions') {
      setStep('forgot');
    } else if (step === 'verify') {
      setStep('signup');
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'signin': return 'Welcome Back';
      case 'signup': return 'Create Account';
      case 'forgot': return 'Sign In with Magic Link';
      case 'reset': return 'New Password';
      case 'verify': return 'Check Your Email';
      case 'instructions': return 'Check Your Email';
      case 'admin': return 'Admin Login';
      case 'magic-sent': return 'Magic Link Sent';
      case 'signup-success': return 'Account Creation Started';
      default: return 'Authentication';
    }
  };

  const renderErrorMessage = () => {
    if (!authError) return null;

    return (
      <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700 dark:text-red-300">
            {authError}
          </div>
        </div>
      </div>
    );
  };

  const renderSignIn = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderErrorMessage()}
      
      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setAuthError(null);
            }}
            className="w-full pl-10 pr-4 py-3 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50"
            placeholder="Enter your email"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setAuthError(null);
            }}
            className="w-full pl-10 pr-12 py-3 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50"
            placeholder="Enter your password"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => setStep('forgot')}
          className="text-sm text-primary-dark hover:underline flex items-center gap-1"
        >
          <Zap className="w-4 h-4" />
          Sign in with Magic Link
        </button>
        <button
          type="button"
          onClick={() => setStep('admin')}
          className="text-sm text-yellow-600 hover:underline flex items-center gap-1"
        >
          <Crown className="w-4 h-4" />
          Admin Login
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-primary-dark to-secondary-dark text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Signing In...
          </div>
        ) : (
          'Sign In'
        )}
      </button>

      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Don't have an account?
          <button
            type="button"
            onClick={() => setStep('signup')}
            className="ml-2 text-primary-dark hover:underline font-medium"
          >
            Sign Up
          </button>
        </p>
      </div>
    </form>
  );

  const renderAdminLogin = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderErrorMessage()}
      
      <div className="text-center mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Crown className="w-6 h-6 text-yellow-600" />
          <span className="font-semibold text-yellow-900 dark:text-yellow-100">Administrator Access</span>
        </div>
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          Please enter your admin credentials to continue.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Admin Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setAuthError(null);
            }}
            className="w-full pl-10 pr-4 py-3 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            placeholder="Enter admin email"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Admin Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setAuthError(null);
            }}
            className="w-full pl-10 pr-12 py-3 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50"
            placeholder="Enter admin password"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Authenticating...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Crown className="w-5 h-5" />
            Admin Sign In
          </div>
        )}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setStep('signin')}
          className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          Back to Regular Login
        </button>
      </div>
    </form>
  );

  const renderSignUp = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderErrorMessage()}
      
      <div className="text-center mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="w-6 h-6 text-blue-600" />
          <span className="font-semibold text-blue-900 dark:text-blue-100">Secure Account Creation</span>
        </div>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          We'll send you a magic link to verify your email and complete account setup.
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setAuthError(null);
            }}
            className="w-full pl-10 pr-4 py-3 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50"
            placeholder="Enter your full name"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setAuthError(null);
            }}
            className="w-full pl-10 pr-4 py-3 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50"
            placeholder="Enter your email"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setAuthError(null);
            }}
            className="w-full pl-10 pr-12 py-3 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50"
            placeholder="Enter your password"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Sending Magic Link...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            Create Account with Magic Link
          </div>
        )}
      </button>

      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?
          <button
            type="button"
            onClick={() => setStep('signin')}
            className="ml-2 text-primary-dark hover:underline font-medium"
          >
            Sign In
          </button>
        </p>
      </div>
    </form>
  );

  const renderMagicLinkRequest = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderErrorMessage()}
      
      <div className="text-center mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="w-6 h-6 text-blue-600" />
          <span className="font-semibold text-blue-900 dark:text-blue-100">Magic Link Sign In</span>
        </div>
        <p className="text-sm text-blue-800 dark:text-blue-200">
          Enter your email and we'll send you a magic link to sign in instantly - no password required!
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setAuthError(null);
            }}
            className="w-full pl-10 pr-4 py-3 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50"
            placeholder="Enter your email"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Sending Magic Link...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            Send Magic Link
          </div>
        )}
      </button>

      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Prefer to use a password?
          <button
            type="button"
            onClick={() => setStep('signin')}
            className="ml-2 text-primary-dark hover:underline font-medium"
          >
            Sign In with Password
          </button>
        </p>
      </div>
    </form>
  );

  const renderSignUpSuccess = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-500" />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Account Creation Started!</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          We've sent a magic link to <strong>{email}</strong> to complete your account setup.
        </p>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-left">
          <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Next Steps:</h4>
          <ol className="text-sm text-green-800 dark:text-green-200 space-y-1 list-decimal list-inside">
            <li>Check your email inbox (and spam folder)</li>
            <li>Click the magic link in the email</li>
            <li>Your account will be created and you'll be signed in automatically</li>
            <li>You'll be redirected to your dashboard to start coding!</li>
          </ol>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleResendMagicLink}
          disabled={loading}
          className="w-full py-2 text-primary-dark border border-primary-dark rounded-lg hover:bg-primary-dark/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Resending...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Resend Magic Link
            </div>
          )}
        </button>
        <button
          onClick={() => setStep('signin')}
          className="w-full py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          Back to Sign In
        </button>
        <p className="text-xs text-gray-500">
          Didn't receive the email? Check your spam folder or use the resend button above.
        </p>
      </div>
    </div>
  );

  const renderMagicLinkSent = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
        <Zap className="w-8 h-8 text-blue-500" />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Magic Link Sent!</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          We've sent a magic link to <strong>{email}</strong>
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Next Steps:</h4>
          <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
            <li>Check your email inbox (and spam folder)</li>
            <li>Click the magic link in the email</li>
            <li>You'll be automatically signed in and redirected to the dashboard</li>
          </ol>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleResendMagicLink}
          disabled={loading}
          className="w-full py-2 text-primary-dark border border-primary-dark rounded-lg hover:bg-primary-dark/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Resending...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Resend Magic Link
            </div>
          )}
        </button>
        <button
          onClick={() => setStep('signin')}
          className="w-full py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          Back to Sign In
        </button>
        <p className="text-xs text-gray-500">
          Didn't receive the email? Check your spam folder or use the resend button above.
        </p>
      </div>
    </div>
  );

  const renderResetPassword = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderErrorMessage()}
      
      <div className="text-center mb-4">
        <p className="text-gray-600 dark:text-gray-400">
          Enter your new password below.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">New Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setAuthError(null);
            }}
            className="w-full pl-10 pr-12 py-3 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50"
            placeholder="Enter new password"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setAuthError(null);
            }}
            className="w-full pl-10 pr-12 py-3 bg-gray-100/50 dark:bg-gray-800/50 border border-gray-200/20 dark:border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50"
            placeholder="Confirm new password"
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {password && confirmPassword && password !== confirmPassword && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          Passwords do not match
        </div>
      )}

      <button
        type="submit"
        disabled={loading || password !== confirmPassword}
        className="w-full py-3 bg-gradient-to-r from-primary-dark to-secondary-dark text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Updating Password...
          </div>
        ) : (
          'Update Password'
        )}
      </button>
    </form>
  );

  const renderVerificationInstructions = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-500" />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Check Your Email</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          We've sent a verification link to <strong>{email}</strong>
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Next Steps:</h4>
          <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
            <li>Check your email inbox (and spam folder)</li>
            <li>Click the verification link in the email</li>
            <li>You'll be automatically redirected to the dashboard</li>
          </ol>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={handleResendVerification}
          disabled={loading}
          className="w-full py-2 text-primary-dark border border-primary-dark rounded-lg hover:bg-primary-dark/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Resending...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Resend Verification Email
            </div>
          )}
        </button>
        <button
          onClick={() => setStep('signin')}
          className="w-full py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          Back to Sign In
        </button>
        <p className="text-xs text-gray-500">
          Didn't receive the email? Check your spam folder or use the resend button above.
        </p>
      </div>
    </div>
  );

  const renderPasswordResetInstructions = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
        <Mail className="w-8 h-8 text-blue-500" />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2">Check Your Email</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          We've sent a password reset link to <strong>{email}</strong>
        </p>
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-left">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Next Steps:</h4>
          <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
            <li>Check your email inbox (and spam folder)</li>
            <li>Click the reset link in the email</li>
            <li>Enter your new password</li>
            <li>Sign in with your new password</li>
          </ol>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => setStep('signin')}
          className="w-full py-2 text-primary-dark border border-primary-dark rounded-lg hover:bg-primary-dark/10 transition-colors"
        >
          Back to Sign In
        </button>
        <p className="text-xs text-gray-500">
          Didn't receive the email? Check your spam folder or try again.
        </p>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (step) {
      case 'signin': return renderSignIn();
      case 'admin': return renderAdminLogin();
      case 'signup': return renderSignUp();
      case 'forgot': return renderMagicLinkRequest();
      case 'magic-sent': return renderMagicLinkSent();
      case 'signup-success': return renderSignUpSuccess();
      case 'reset': return renderResetPassword();
      case 'verify': return renderVerificationInstructions();
      case 'instructions': return renderPasswordResetInstructions();
      default: return renderSignIn();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-card-light dark:bg-card-dark rounded-xl border border-gray-200/20 dark:border-gray-700/20 p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {(step !== 'signin' && step !== 'verify' && step !== 'instructions' && step !== 'magic-sent' && step !== 'signup-success') && (
                  <button
                    onClick={handleBack}
                    className="p-1 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <h2 className="text-2xl font-bold">{getStepTitle()}</h2>
              </div>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {renderContent()}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;