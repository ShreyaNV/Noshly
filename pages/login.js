import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';

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

  const handleGoogleLogin = async () => {
    try {
      // Initiate Google OAuth login
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
      });

      if (error) {
        throw error;
      }

      // Redirect to dashboard after successful login
      router.push('/dashboard');
    } catch (error) {
      console.error('Error logging in with Google:', error.message);
      alert('Failed to log in with Google. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side: Image */}
      <div className="hidden lg:block w-1/2 bg-cover bg-center" style={{ backgroundImage: `url('/intro-bgi.jpg')` }}>
        {/* Replace '/login-image.jpg' with your image path */}
      </div>

      {/* Right Side: Login Box */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Log In</h1>
          <form onSubmit={handleLogin}>
            {/* Email Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 pl-10 border rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  📧 {/* Email icon */}
                </span>
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 pl-10 border rounded bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  🔒 {/* Password icon */}
                </span>
              </div>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 mb-4">{error}</p>}

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-all"
            >
              Log In
            </button>
          </form>

          
          {/* Social Login Buttons and Other trivial Stuff

          {/* Forgot Password Link
          <p className="mt-4 text-center p-5 text-sm text-gray-600">
            <Link href="/forgot-password" className="text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </p>
          <center><p className='mb-5'>Or</p></center>
          <button onClick={handleGoogleLogin} className="flex items-center justify-center bg-white border border-gray-300 p-3 rounded-lg hover:bg-gray-50 transition-all w-full">
            <Image
              src="/google.png" // Replace with your Google icon path
              alt="Google"
              width={100}
              height={20}
              className="w-5 h-5"
            />
          <span className="ml-2 text-sm">Sign in with Google</span>
          </button> */}
          

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="text-blue-500 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}