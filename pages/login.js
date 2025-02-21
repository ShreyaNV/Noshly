import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
  
    const { data: { user }, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (loginError) {
      setError(loginError.message);
    } else {
      // Fetch user profile from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('username, role')
        .eq('user_id', user.id)
        .maybeSingle(); // Use maybeSingle() to handle no rows
  
      if (profileError) {
        setError(profileError.message);
      } else if (!profile) {
        // If no profile exists, create one with a default role
        const { error: createProfileError } = await supabase
          .from('profiles')
          .insert([{ user_id: user.id, username: user.email, role: 'consumer' }]);
  
        if (createProfileError) {
          setError(createProfileError.message);
        } else {
          // Redirect to consumer dashboard after creating profile
          router.push('/consumer-dashboard');
        }
      } else {
        // Redirect based on role
        if (profile.role === 'seller') {
          router.push('/seller-dashboard');
        } else if (profile.role === 'consumer') {
          router.push('/consumer-dashboard');
        } else if (profile.role === 'admin') {
          router.push('/admin-dashboard');
        }
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Log In</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Log In
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}