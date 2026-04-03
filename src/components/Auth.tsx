import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { Youtube, Mail, Lock, Chrome, Loader2 } from 'lucide-react';

export const Auth: React.FC<{ mode: 'login' | 'signup' }> = ({ mode }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-zinc-900/50 border border-white/10 rounded-3xl backdrop-blur-sm">
      <div className="flex flex-col items-center mb-8">
        <div className="p-3 bg-red-600 rounded-2xl mb-4 shadow-lg shadow-red-600/20">
          <Youtube className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold">{mode === 'login' ? 'Welcome Back' : 'Join Our Community'}</h1>
        <p className="text-zinc-400 text-sm mt-2">Sign in with Google to start growing your channel</p>
      </div>

      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs text-center">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full bg-white text-black font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3 hover:bg-zinc-200 disabled:opacity-50 shadow-lg"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Chrome className="w-5 h-5" />
              Continue with Google
            </>
          )}
        </button>

        <p className="text-center text-zinc-500 text-[10px] mt-4 px-4 leading-relaxed">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>

      <p className="text-center text-zinc-500 text-sm mt-8">
        {mode === 'login' ? "New here?" : "Already have an account?"}{' '}
        <button
          onClick={() => navigate(mode === 'login' ? '/signup' : '/login')}
          className="text-red-500 hover:underline font-medium"
        >
          {mode === 'login' ? 'Create an account' : 'Sign in'}
        </button>
      </p>
    </div>
  );
};
