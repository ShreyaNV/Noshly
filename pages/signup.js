import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('consumer');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [locationError, setLocationError] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [organization, setOrg] = useState('');
  const [branch, setBranch] = useState('');
  const [phone, setPhoneNo] = useState('');

  // Automatically fetch user's location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          setLocationError('');
        },
        (error) => {
          setLocationError('Unable to retrieve your location. Please enable location access.');
          console.error('Geolocation error:', error);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  };

  useEffect(() => {
    getLocation(); // Fetch location when the component mounts
  }, []);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
  
    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    // Validate location
    if (!latitude || !longitude) {
      setError('Please enable location access to proceed.');
      return;
    }
  
    try {
      // Sign up with Supabase
      const { data: { user }, error: signupError } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (signupError) {
        throw signupError;
      }
  
      // Insert user profile into profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ 
          user_id: user.id, 
          username: email, 
          role, 
          latitude, 
          longitude,
          organization,
          branch,
          phone,
        }]);
  
      if (profileError) {
        throw profileError;
      }
  
      setMessage('Check your email for the confirmation link!');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
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
      setError('Failed to log in with Google. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side: Image */}
      <div className="hidden lg:block w-1/2 bg-cover bg-center" style={{ backgroundImage: `url('/intro-bgi.jpg')` }}>
        {/* Replace '/intro-bgi.jpg' with your image path */}
      </div>

      {/* Right Side: Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6">Sign Up</h1>

          <form onSubmit={handleSignup}>
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
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Organization Name</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrg(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Branch</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input
                type="phone"
                value={phone}
                onChange={(e) => setPhoneNo(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Location</label>
              {latitude && longitude ? (
                <p className='text-green-500'> Successfully fetched your location!</p>
              ) : (
                <p className="text-sm text-gray-600">Fetching your location...</p>
              )}
              {locationError && (
                <p className="text-sm text-red-500">{locationError}</p>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 border rounded"
                required
              >
                <option value="consumer">Consumer</option>
                <option value="seller">Seller</option>
              </select>
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {message && <p className="text-green-500 mb-4">{message}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-3"
            >
              Sign Up
            </button>
          </form>
          {/* <center><p className='font-medium mb-2 mt-1'>Or</p></center>
          {/* Google Signup Button 
          <button
            onClick={handleGoogleSignup}
            className="flex items-center justify-center bg-white border border-gray-300 p-2 rounded-lg hover:bg-gray-50 transition-all w-full mb-6"
          >
            <Image
              src="/google.png" // Replace with your Google icon path
              alt="Google"
              width={100}
              height={20}
              className="w-5 h-5"
            />
            <span className="ml-2 text-sm">Sign up with Google</span>
          </button> */}
          <p className="mt-4 text-center">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-500 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}