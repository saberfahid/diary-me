import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function Auth({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [rateLimited, setRateLimited] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  // Check for confirmation success from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('confirmed') === 'true') {
      setError('');
      // Clear the URL param
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get('error')) {
      setError(decodeURIComponent(urlParams.get('error')));
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSignUp = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Sign up with email confirmation enabled
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        // Handle rate limiting and other errors
        let errorMsg = error.message;
        
        if (errorMsg.toLowerCase().includes('security') || errorMsg.toLowerCase().includes('seconds')) {
          errorMsg = 'Please wait a moment before trying again for security reasons.';
          setRateLimited(true);
          // Auto-clear rate limit after 60 seconds
          setTimeout(() => setRateLimited(false), 60000);
        }
        
        setError(errorMsg);
        setLoading(false);
        return;
      }

      if (data?.user) {
        setConfirmationSent(true);
        setError('');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    
    setLoading(false);
  };

  const handleResendConfirmation = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        setError(error.message);
      } else {
        setError('');
        setConfirmationSent(true);
      }
    } catch (err) {
      setError('Failed to resend confirmation email. Please try again.');
    }
    
    setLoading(false);
  };

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    
    if (error) {
      // Handle rate limiting and other errors  
      let errorMsg = error.message;
      
      if (errorMsg.toLowerCase().includes('security') || errorMsg.toLowerCase().includes('seconds')) {
        errorMsg = 'Please wait a moment before trying again for security reasons.';
        setRateLimited(true);
        // Auto-clear rate limit after 60 seconds
        setTimeout(() => setRateLimited(false), 60000);
      } else if (errorMsg.toLowerCase().includes('invalid') && errorMsg.toLowerCase().includes('credentials')) {
        errorMsg = 'Invalid email or password. Please check and try again.';
      }
      
      setError(errorMsg);
    } else {
      onAuth();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 via-blue-100 to-purple-200 py-8 px-2">
      <div className="bg-white/95 rounded-3xl shadow-2xl p-6 max-w-[320px] w-full flex flex-col items-center border-2 border-pink-200" style={{boxShadow:'0 8px 32px rgba(200,150,255,0.18)'}}>
        {/* Logo removed for a cleaner look */}
        <h2 className="text-2xl font-extrabold text-pink-500 mb-2 font-cursive tracking-wide text-center drop-shadow">Welcome to DiaryMe!</h2>
        <p className="text-center text-purple-400 font-cursive text-base mb-4">
          {confirmationSent 
            ? 'Check your email for a confirmation link!' 
            : mode === 'signin' 
            ? 'Log in to access your diary.' 
            : 'Sign up to start your diary.'
          }
        </p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border-2 border-blue-200 rounded-full p-3 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white/60 text-blue-700 placeholder-pink-300 text-base"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="border-2 border-blue-200 rounded-full p-3 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white/60 text-blue-700 placeholder-pink-300 text-base"
        />
        {error && <div className="text-red-500 text-xs mb-2 text-center">{error}</div>}
        {confirmationSent && !error && (
          <div className="text-green-600 text-xs mb-2 text-center bg-green-50 p-2 rounded-lg border border-green-200">
            📧 Confirmation email sent! Please check your inbox and click the link to verify your account.
            <div className="mt-2">
              <button 
                onClick={handleResendConfirmation}
                disabled={loading || rateLimited}
                className="text-blue-500 underline hover:text-blue-700 text-xs"
              >
                Resend confirmation email
              </button>
            </div>
          </div>
        )}
        {mode === 'signin' ? (
          <>
            <button 
              onClick={handleSignIn} 
              disabled={loading || rateLimited} 
              className={`bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-full p-3 w-full font-bold shadow hover:scale-105 transition-transform duration-200 mb-2 text-base ${rateLimited ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {rateLimited ? 'Please Wait...' : loading ? 'Signing In...' : 'Sign In'}
            </button>
            <button type="button" onClick={() => { setMode('signup'); setError(''); setRateLimited(false); setConfirmationSent(false); }} className="text-pink-400 underline text-xs mb-1">New here? Create an account</button>
          </>
        ) : (
          <>
            <button 
              onClick={handleSignUp} 
              disabled={loading || rateLimited} 
              className={`bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full p-3 w-full font-bold shadow hover:scale-105 transition-transform duration-200 mb-2 text-base ${rateLimited ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {rateLimited ? 'Please Wait...' : loading ? 'Creating Account...' : 'Sign Up'}
            </button>
            <button type="button" onClick={() => { setMode('signin'); setError(''); setRateLimited(false); setConfirmationSent(false); }} className="text-blue-400 underline text-xs mb-2">Already have an account? Log in</button>
          </>
        )}
      </div>
      <style>{`
        .animate-bounce-slow {
          animation: bounce 2.5s infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}
