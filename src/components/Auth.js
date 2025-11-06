import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Auth({ onAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [confirmationSent, setConfirmationSent] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else {
      setConfirmationSent(true);
      setError('');
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    else onAuth();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 via-blue-100 to-purple-200 py-8 px-2">
      <div className="bg-white/95 rounded-3xl shadow-2xl p-6 max-w-[320px] w-full flex flex-col items-center border-2 border-pink-200" style={{boxShadow:'0 8px 32px rgba(200,150,255,0.18)'}}>
        {/* Logo removed for a cleaner look */}
        <h2 className="text-2xl font-extrabold text-pink-500 mb-2 font-cursive tracking-wide text-center drop-shadow">Welcome to DiaryMe!</h2>
        <p className="text-center text-purple-400 font-cursive text-base mb-4">
          {mode === 'signin' ? 'Log in to access your diary.' : 'Sign up to start your diary.'}
        </p>
        {confirmationSent && (
          <div className="bg-pink-100 border border-pink-300 rounded-xl p-3 mb-2 text-center text-pink-700 text-sm">
            Please check your email and click the confirmation link before logging in.
          </div>
        )}
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
        {mode === 'signin' ? (
          <>
            <button onClick={handleSignIn} disabled={loading || confirmationSent} className="bg-gradient-to-r from-blue-400 to-purple-400 text-white rounded-full p-3 w-full font-bold shadow hover:scale-105 transition-transform duration-200 mb-2 text-base">Sign In</button>
            <button type="button" onClick={() => { setMode('signup'); setError(''); setConfirmationSent(false); }} className="text-pink-400 underline text-xs mb-2">New here? Create an account</button>
          </>
        ) : (
          <>
            <button onClick={handleSignUp} disabled={loading || confirmationSent} className="bg-gradient-to-r from-pink-400 to-purple-400 text-white rounded-full p-3 w-full font-bold shadow hover:scale-105 transition-transform duration-200 mb-2 text-base">Sign Up</button>
            <button type="button" onClick={() => { setMode('signin'); setError(''); setConfirmationSent(false); }} className="text-blue-400 underline text-xs mb-2">Already have an account? Log in</button>
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
