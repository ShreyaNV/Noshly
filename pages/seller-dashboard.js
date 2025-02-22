import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../components/Seller-Header';
import Footer from '@/components/Footer'; // Import the Header component

export default function SellerDashboard() {
  const [user, setUser] = useState(null);
  const [foodListings, setFoodListings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndListings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);
        const { data, error } = await supabase
          .from('food_listings')
          .select('*')
          .eq('seller_id', user.id);

        if (error) {
          console.error('Error fetching listings:', error);
        } else {
          setFoodListings(data);
        }
      }
    };

    fetchUserAndListings();
  }, [router]);

  if (!user) {
    return <p className="text-gray-600">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundColor: '#F8E49B' }}>
      <Header /> {/* Add the Header component */}
      <div className="pt-16 p-8"> {/* Add padding-top to avoid overlap with the fixed header */}
        <center><h1 className="text-3xl font-bold mb-6 text-gray-900">Seller Dashboard</h1></center>
        <div className="grid grid-cols-1 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Live Items</h2>
            {foodListings.length === 0 ? (
              <p className="text-gray-600">No Live Food found. Add a new item to get started.</p>
            ) : (
              <ul className="space-y-4" >
                {foodListings.map((listing) => (
                  <li key={listing.id} className="p-4 border rounded-lg bg-white shadow-sm text-black" style={{ backgroundColor: '#C3C079' }}>
                    <p className="text-lg font-semibold text-gray-900">{listing.name}</p>
                    <p className="text-gray-600"><bold></bold><strong>{listing.dishName}</strong></p>
                    <p className="text-gray-600"><strong>Description:</strong> {listing.description}</p>
                    <p className="text-gray-600"><strong>Serves:</strong> {listing.serves}</p>
                    <p className="text-gray-600"><strong>Storage:</strong> {listing.storage}</p>
                    <p className="text-gray-600">
                      <strong>Dietary Guidelines:</strong> {listing.dietary_guidelines === 'veg' ? 'Vegetarian' : 'Non-Vegetarian'}
                    </p>
                    <p className="text-gray-600"><strong>Time Until Pickup:</strong> {listing.time_until_pickup}</p>
                    <p className="text-sm text-gray-500">Added on: {new Date(listing.created_at).toLocaleString('en-US', { timeZone: 'UTC' })}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="mt-8 mb-20">
          <Link href="/add-new-item" className="bg-blue-500 text-black px-4 py-2 rounded hover:bg-blue-600" style={{ backgroundColor: '#C3C079' }}>
            Add New Item
          </Link>
        </div>
      </div>
      <Footer className="mt-auto" />
    </div>
  );
}