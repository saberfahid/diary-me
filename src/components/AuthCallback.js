import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          navigate('/?error=' + encodeURIComponent(error.message));
          return;
        }

        if (data?.session?.user) {
          // User is confirmed and signed in
          localStorage.setItem('diary_logged_in', 'true');
          navigate('/?confirmed=true');
        } else {
          // No session, redirect to login
          navigate('/');
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err);
        navigate('/');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-blue-100 to-purple-200">
      <div className="bg-white/95 rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center">
        <div className="text-4xl mb-4">✨</div>
        <h2 className="text-xl font-bold text-pink-500 mb-2">Confirming your email...</h2>
        <p className="text-gray-600">Please wait while we verify your account.</p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}