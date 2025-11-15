

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }

    setIsLoading(true);
    try {
      await signup(name, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to sign up.');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center -mt-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-bkg/30 border border-content/10 rounded-lg shadow-xl backdrop-blur-md">
        <h2 className="text-2xl font-bold text-center">Create a New Account</h2>
        {error && <p className="text-red-400 text-center text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
           <div>
            <label htmlFor="name" className="text-sm font-medium">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 mt-1 bg-bkg border border-content/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-focus"
            />
          </div>
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
            />
          </div>
          <div>
            <label htmlFor="password"className="text-sm font-medium">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 mt-1 bg-bkg border border-content/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-focus"
            />
          </div>
          <div>
            <Button type="submit" isLoading={isLoading} className="w-full">
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </div>
        </form>
        <p className="text-sm text-center text-content/70">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-sky-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;