import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to log in.');
    }
    setIsLoading(false);
  };
  
  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
        await googleLogin();
        navigate('/');
    } catch (err: any) {
        setError(err.message || 'Failed to sign in with Google.');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center -mt-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-bkg/30 border border-content/10 rounded-lg shadow-xl backdrop-blur-md">
        <h2 className="text-2xl font-bold text-center">Login to your Account</h2>
        {error && <p className="text-red-400 text-center text-sm">{error}</p>}
        
        <div className="grid grid-cols-2 gap-4">
            <button onClick={() => { setEmail('admin@example.com'); setPassword('admin123'); }} disabled={isLoading} className="w-full inline-flex items-center justify-center px-4 py-2 bg-sky-800/50 border border-sky-600/50 font-semibold rounded-md hover:bg-sky-800/80 disabled:opacity-50 transition-colors">
                Login as Admin
            </button>
            <button onClick={() => { setEmail('user@example.com'); setPassword('user123'); }} disabled={isLoading} className="w-full inline-flex items-center justify-center px-4 py-2 bg-green-800/50 border border-green-600/50 font-semibold rounded-md hover:bg-green-800/80 disabled:opacity-50 transition-colors">
                Login as User
            </button>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-content/20" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-bkg text-content/70">Or</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 mt-1 bg-bkg border border-content/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-focus"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label htmlFor="password"className="text-sm font-medium">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 bg-bkg border border-content/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-focus"
              placeholder="admin123"
            />
          </div>
          <div>
            <Button type="submit" isLoading={isLoading} className="w-full">
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </form>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-content/20" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-bkg text-content/70">Or continue with</span>
          </div>
        </div>
        <div>
          <button onClick={handleGoogleLogin} disabled={isLoading} className="w-full inline-flex items-center justify-center px-4 py-2 bg-bkg border border-content/20 font-semibold rounded-md hover:bg-content/10 disabled:opacity-50 transition-colors">
            <svg className="w-5 h-5 mr-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 177.2 55.4l-62.1 62.1C335.5 99.4 294.8 84 248 84c-80.9 0-146.4 65.5-146.4 146.4s65.5 146.4 146.4 146.4c94.3 0 135.3-66.2 140.8-100.8H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>
            Sign in with Google
          </button>
        </div>
        <p className="text-sm text-center text-content/70">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-sky-400 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;