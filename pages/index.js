import { useEffect, useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabaseClient'; // Import the Supabase client

export default function Home() {
  const [foodListings, setFoodListings] = useState([]);

  useEffect(() => {
    const fetchFoodListings = async () => {
      const { data, error } = await supabase
        .from('food_listings')
        .select('*');

      if (error) {
        console.error('Error fetching food listings:', error);
      } else {
        setFoodListings(data);
      }
    };

    fetchFoodListings();
  }, []);

  return (
    <div>
      <Header />
      <Hero />
      <div className="container mx-auto p-4">
        {/* Add Login and Signup Links Here */}
        <div className="flex justify-end space-x-4 mb-4">
          <a href="/login" className="text-blue-600 hover:text-blue-800">Login</a>
          <a href="/signup" className="text-blue-600 hover:text-blue-800">Sign Up</a>
        </div>

        <h2 className="text-2xl font-bold mb-4">Available Food Listings</h2>
        <ul>
          {foodListings.map((listing) => (
            <li key={listing.id} className="mb-2 p-2 border rounded">
              <strong>{listing.name}</strong> - {listing.quantity} units (Seller: {listing.seller})
            </li>
          ))}
        </ul>
      </div>
      <Footer />
    </div>
  );
}