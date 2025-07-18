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
  const [loginAttempts, setLoginAttempts] = useState(0);
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
          setLoginAttempts(prev => prev + 1);
          
          // Handle specific authentication errors with more helpful messages
          if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
            if (loginAttempts >= 2) {
              setAuthError('Multiple failed login attempts detected. Please double-check your email and password, or use "Forgot Password" to reset your credentials. Make sure your email is verified if you recently signed up.');
            } else {
              setAuthError('Invalid email or password. Please check your credentials and try again. If you recently signed up, make sure to verify your email first.');
            }
          } else if (error.message.includes('Email not confirmed')) {
            setAuthError('Please verify your email address before signing in. Check your inbox for a verification link.');
            // Optionally show resend verification option
            setTimeout(() => {
              setStep('verify');
            }, 2000);
          } else if (error.message.includes('Too many requests')) {
            setAuthError('Too many login attempts. Please wait a few minutes before trying again.');
          } else if (error.message.includes('User not found')) {
            setAuthError('No account found with this email address. Please check your email or sign up for a new account.');
          } else {
            setAuthError(error.message || 'An error occurred during sign in. Please try again.');
          }
          throw error;
        }
        
        // Reset login attempts on successful login
        setLoginAttempts(0);
        toast.success('Welcome back!');
        onClose();
      } else if (step === 'admin') {
        // Handle admin login
        try {
          // First verify admin credentials using the secure RPC function
          const isValidAdmin = await db.verifyAdminCredentials(email, password);
          
          if (!isValidAdmin) {
            setAuthError('Invalid admin credentials. Please check your email and password. If you believe this is an error, contact the system administrator.');
            throw new Error('Invalid admin credentials');
          }

          // If admin credentials are valid, sign in normally
          // Admin users should also exist in the regular auth system
          const { error: signInError } = await signIn(email, password);
          
          if (signInError) {
            // If the admin user doesn't exist in auth.users, they need to sign up first
            if (signInError.message.includes('Invalid login credentials')) {
              setAuthError('Admin account not found in authentication system. Please contact system administrator to set up your admin account properly.');
            } else {
              setAuthError(signInError.message || 'Admin authentication failed. Please try again or contact support.');
            }
            throw signInError;
          }

          toast.success('Welcome, Administrator!');
          onClose();
          navigate('/admin');
        } catch (error: any) {
          if (!authError) {
            setAuthError('Admin authentication failed. Please verify your credentials and try again.');
          }
          throw error;
        }
      } else if (step === 'signup') {
        // Validate password
        if (password.length < 6) {
          setAuthError('Password must be at least 6 characters long');
          throw new Error('Password must be at least 6 characters');
        }

        // Store user data temporarily in localStorage (will be used after magic link verification)
        const userData = {
          email,
          full_name: fullName,
          password
        };
        
        // Store in localStorage temporarily - this will be used when the magic link is clicked
        localStorage.setItem('pendingSignupData', JSON.stringify(userData));
        
        // Send magic link for signup verification
        const { error } = await sendMagicLink(email);
        if (error) {
          // Clean up localStorage if magic link fails
          localStorage.removeItem('pendingSignupData');
          
          if (error.message.includes('User already registered')) {
            setAuthError('An account with this email already exists. Please sign in instead or use the "Forgot Password" option if you need to reset your password.');
          } else if (error.message.includes('Invalid email')) {
            setAuthError('Please enter a valid email address.');
          } else if (error.message.includes('rate limit')) {
            setAuthError('Too many signup attempts. Please wait a few minutes before trying again.');
          } else {
            setAuthError(error.message || 'An error occurred while sending verification email. Please try again.');
          }
          throw error;
        }
        
        setStep('signup-success');
      } else if (step === 'forgot') {
        // Send magic link instead of password reset
        const { error } = await sendMagicLink(email);
        if (error) {
          if (error.message.includes('User not found')) {
            setAuthError('No account found with this email address. Please check your email or sign up for a new account.');
          } else if (error.message.includes('rate limit')) {
            setAuthError('Too many reset attempts. Please wait a few minutes before trying again.');
          } else {
            setAuthError(error.message || 'An error occurred while sending magic link. Please try again.');
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
          setAuthError('Password must be at least 6 characters long');
          throw new Error('Password must be at least 6 characters');
        }
        const { error } = await updatePassword(password);
        if (error) {
          setAuthError(error.message || 'An error occurred while updating password. Please try again.');
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
        if (error.message.includes('rate limit')) {
          setAuthError('Too many verification emails sent. Please wait a few minutes before requesting another.');
        } else {
          setAuthError(error.message || 'Failed to resend verification email.');
        }
      } else {
        toast.success('Verification email sent! Check your inbox and spam folder.');
      }
    } catch (error: any) {
      setAuthError('Failed to resend verification email. Please try again later.');
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
        if (error.message.includes('rate limit')) {
          setAuthError('Too many magic links sent. Please wait a few minutes before requesting another.');
        } else {
          setAuthError(error.message || 'Failed to resend magic link.');
        }
      } else {
        toast.success('Magic link sent! Check your inbox and spam folder.');
      }
    } catch (error: any) {
      setAuthError('Failed to resend magic link. Please try again later.');
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
    setLoginAttempts(0);
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
      case 'forgot': return 'Forgot Password';
      case 'reset': return 'New Password';
      case 'verify': return 'Check Email';
      case 'instructions': return 'Check Email';
      case 'admin': return 'Admin Login';
      case 'magic-sent': return 'Link Sent';
      case 'signup-success': return 'Almost Done';
      default: return 'Authentication';
    }
  };

  const renderErrorMessage = () => {
    if (!authError) return null;

    return (
      <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-red-700 dark:text-red-300">
            {authError}
            {/* Show helpful tips for common errors */}
            {authError.includes('Invalid') && loginAttempts >= 2 && (
              <div className="mt-2 pt-2 border-t border-red-200 dark:border-red-800">
                <p className="text-xs text-red-600 dark:text-red-400">
                  <strong>Troubleshooting tips:</strong>
                </p>
                <ul className="text-xs text-red-600 dark:text-red-400 mt-1 list-disc list-inside">
                  <li>Check for typos in your email and password</li>
                  <li>Make sure Caps Lock is not enabled</li>
                  <li>Try copying and pasting your credentials</li>
                  <li>Use "Forgot Password" if you're unsure</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderSignIn = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderErrorMessage()}
      
      <div>
        <label className="block text-sm font-medium mb-2 text-white">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setAuthError(null);
              // Reset login attempts when user starts typing
              if (loginAttempts > 0) setLoginAttempts(0);
            }}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50 text-white placeholder-gray-400"
            placeholder="Enter your email"
            required
            autoComplete="email"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-white">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setAuthError(null);
              // Reset login attempts when user starts typing
              if (loginAttempts > 0) setLoginAttempts(0);
            }}
            className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50 text-white placeholder-gray-400"
            placeholder="Enter your password"
            required
            minLength={6}
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Side by side buttons */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <button
          type="button"
          onClick={() => setStep('forgot')}
          className="text-primary-dark hover:underline flex items-center gap-2 justify-center py-2"
        >
          <Lock className="w-4 h-4" />
          Forgot Password
        </button>
        <button
          type="button"
          onClick={() => setStep('admin')}
          className="text-yellow-400 hover:underline flex items-center gap-2 justify-center py-2"
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
        <p className="text-gray-300">
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
      
      <div className="text-center mb-4 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Crown className="w-5 h-5 text-yellow-400" />
          <span className="font-semibold text-yellow-100">Administrator Access</span>
        </div>
        <p className="text-sm text-yellow-200">
          Enter your admin credentials to continue.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-white">Admin Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setAuthError(null);
            }}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-white placeholder-gray-400"
            placeholder="Enter admin email"
            required
            autoComplete="email"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-white">Admin Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setAuthError(null);
            }}
            className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500/50 text-white placeholder-gray-400"
            placeholder="Enter admin password"
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
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
          className="text-sm text-gray-300 hover:text-white transition-colors"
        >
          Back to Regular Login
        </button>
      </div>
    </form>
  );

  const renderSignUp = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderErrorMessage()}
      
      <div className="text-center mb-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-blue-400" />
          <span className="font-semibold text-blue-100">Secure Account Creation</span>
        </div>
        <p className="text-sm text-blue-200">
          We'll send you a magic link to verify your email and create your account.
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2 text-white">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              setAuthError(null);
            }}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50 text-white placeholder-gray-400"
            placeholder="Enter your full name"
            required
            autoComplete="name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-white">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setAuthError(null);
            }}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50 text-white placeholder-gray-400"
            placeholder="Enter your email"
            required
            autoComplete="email"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-white">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setAuthError(null);
            }}
            className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50 text-white placeholder-gray-400"
            placeholder="Enter your password"
            required
            minLength={6}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1">Must be at least 6 characters</p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Sending Verification Link...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Zap className="w-5 h-5" />
            Create Account
          </div>
        )}
      </button>

      <div className="text-center">
        <p className="text-gray-300">
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
      
      <div className="text-center mb-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Lock className="w-5 h-5 text-blue-400" />
          <span className="font-semibold text-blue-100">Password Reset</span>
        </div>
        <p className="text-sm text-blue-200">
          Enter your email and we'll send you a magic link to sign in.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-white">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setAuthError(null);
            }}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50 text-white placeholder-gray-400"
            placeholder="Enter your email"
            required
            autoComplete="email"
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
            Sending Reset Link...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Lock className="w-5 h-5" />
            Send Reset Link
          </div>
        )}
      </button>

      <div className="text-center">
        <p className="text-gray-300">
          Remember your password?
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

  const renderSignUpSuccess = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-400" />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2 text-white">Verification Link Sent!</h3>
        <p className="text-gray-300 mb-4">
          We've sent a verification link to <strong className="text-white break-all">{email}</strong>
        </p>
        <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 text-left">
          <h4 className="font-medium text-green-100 mb-2">Next Steps:</h4>
          <ol className="text-sm text-green-200 space-y-1 list-decimal list-inside">
            <li>Check your email inbox (and spam folder)</li>
            <li>Click the verification link</li>
            <li>Your account will be created automatically</li>
            <li>You'll be redirected to your dashboard</li>
          </ol>
        </div>
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 text-left mt-3">
          <p className="text-xs text-blue-200">
            <strong>Important:</strong> Your account will only be created after you click the verification link. 
            If you don't verify your email, no account will be created in our system.
          </p>
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
              Resend Verification Link
            </div>
          )}
        </button>
        <button
          onClick={() => setStep('signin')}
          className="w-full py-2 text-gray-300 hover:text-white transition-colors"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );

  const renderMagicLinkSent = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-blue-400" />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2 text-white">Reset Link Sent!</h3>
        <p className="text-gray-300 mb-4">
          We've sent a password reset link to <strong className="text-white break-all">{email}</strong>
        </p>
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-left">
          <h4 className="font-medium text-blue-100 mb-2">Next Steps:</h4>
          <ol className="text-sm text-blue-200 space-y-1 list-decimal list-inside">
            <li>Check your email inbox (and spam folder)</li>
            <li>Click the reset link</li>
            <li>You'll be automatically signed in</li>
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
              Resend Reset Link
            </div>
          )}
        </button>
        <button
          onClick={() => setStep('signin')}
          className="w-full py-2 text-gray-300 hover:text-white transition-colors"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );

  const renderResetPassword = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderErrorMessage()}
      
      <div className="text-center mb-4">
        <p className="text-gray-300">
          Enter your new password below.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-white">New Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setAuthError(null);
            }}
            className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50 text-white placeholder-gray-400"
            placeholder="Enter new password"
            required
            minLength={6}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-white">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setAuthError(null);
            }}
            className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-dark/50 text-white placeholder-gray-400"
            placeholder="Confirm new password"
            required
            minLength={6}
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {password && confirmPassword && password !== confirmPassword && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
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
      <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-green-400" />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2 text-white">Check Your Email</h3>
        <p className="text-gray-300 mb-4">
          We've sent a verification link to <strong className="text-white break-all">{email}</strong>
        </p>
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-left">
          <h4 className="font-medium text-blue-100 mb-2">Next Steps:</h4>
          <ol className="text-sm text-blue-200 space-y-1 list-decimal list-inside">
            <li>Check your email inbox (and spam folder)</li>
            <li>Click the verification link</li>
            <li>You'll be redirected to the dashboard</li>
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
              Resend Verification
            </div>
          )}
        </button>
        <button
          onClick={() => setStep('signin')}
          className="w-full py-2 text-gray-300 hover:text-white transition-colors"
        >
          Back to Sign In
        </button>
      </div>
    </div>
  );

  const renderPasswordResetInstructions = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto">
        <Mail className="w-8 h-8 text-blue-400" />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-2 text-white">Check Your Email</h3>
        <p className="text-gray-300 mb-4">
          We've sent a password reset link to <strong className="text-white break-all">{email}</strong>
        </p>
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 text-left">
          <h4 className="font-medium text-blue-100 mb-2">Next Steps:</h4>
          <ol className="text-sm text-blue-200 space-y-1 list-decimal list-inside">
            <li>Check your email inbox (and spam folder)</li>
            <li>Click the reset link</li>
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
          className="fixed inset-0 bg-gradient-to-br from-background-dark via-gray-900 to-background-dark backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={handleCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-card-dark/80 backdrop-blur-sm rounded-xl border border-gray-700/20 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {/* Logo */}
                <img 
                  src="https://github.com/DarshanVarade/Data/blob/main/Codable.png?raw=true" 
                  alt="Codable Logo" 
                  className="w-8 h-8 rounded-lg"
                />
                <div>
                  <span className="text-lg font-bold bg-gradient-to-r from-primary-dark to-secondary-dark bg-clip-text text-transparent">
                    Codable
                  </span>
                  <h2 className="text-xl font-bold text-white">{getStepTitle()}</h2>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {(step !== 'signin' && step !== 'verify' && step !== 'instructions' && step !== 'magic-sent' && step !== 'signup-success') && (
                  <button
                    onClick={handleBack}
                    className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors text-gray-400 hover:text-white"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={handleCancel}
                  className="p-2 hover:bg-gray-800/50 rounded-lg transition-colors text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {renderContent()}
          </motion.div>

          {/* Background Animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-dark/20 rounded-full filter blur-3xl animate-float" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary-dark/20 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;