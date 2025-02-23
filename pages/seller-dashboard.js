import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Header from '../components/Seller-Header';
import Footer from '@/components/Footer';

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
          // Add a `timeLeft` property to each listing
          const listingsWithTimeLeft = data.map((listing) => ({
            ...listing,
            timeLeft: calculateTimeLeft(listing.created_at, listing.time_until_pickup),
          }));
          setFoodListings(listingsWithTimeLeft);
        }
      }
    };

    fetchUserAndListings();
  }, [router]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFoodListings((prevListings) =>
        prevListings.map((listing) => ({
          ...listing,
          timeLeft: calculateTimeLeft(listing.created_at, listing.time_until_pickup),
        }))
      );
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const { error } = await supabase
        .from('food_listings')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting item:', error);
      } else {
        setFoodListings(foodListings.filter((listing) => listing.id !== id));
        alert('Item deleted successfully!');
      }
    }
  };

  const calculateTimeLeft = (createdAt, timeUntilPickup) => {
    const createdTime = new Date(createdAt).getTime();
    const pickupTime = new Date(createdTime + timeUntilPickup * 60 * 60 * 1000); // Convert hours to milliseconds
    const now = new Date().getTime();
    const timeLeft = pickupTime - now;

    if (timeLeft <= 0) {
      return 'Expired';
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m left`;
  };

  if (!user) {
    return <p className="text-gray-600">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundColor: '#F8E49B' }}>
      <Header />
      <div className="pt-16 p-8">
        <center><h1 className="text-3xl font-bold mb-6 text-gray-900">Seller Dashboard</h1></center>
        <div className="grid grid-cols-1 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Your Live Items</h2>
            {foodListings.length === 0 ? (
              <p className="text-black-600">No Live Food found. Add a new item to get started.</p>
            ) : (
              <ul className="space-y-4">
                {foodListings.map((listing) => {
                  const timeLeft = listing.timeLeft || calculateTimeLeft(listing.created_at, listing.time_until_pickup);
                  const isExpired = timeLeft === 'Expired';
                  const isUrgent = !isExpired && timeLeft.includes('0h'); // Less than 1 hour left

                  return (
                    <li
                      key={listing.id}
                      className="p-4 border rounded-lg shadow-sm relative"
                      style={{
                        backgroundColor: isExpired ? '#FFCCCB' : isUrgent ? '#FFCCCB' : '#C3C079',
                      }}
                    >
                      <p className="text-lg font-semibold text-black">{listing.dishName}</p>
                      <p className="text-black"><strong>Description:</strong> {listing.description}</p>
                      <p className="text-black"><strong>Serves:</strong> {listing.serves}</p>
                      <p className="text-black"><strong>Storage:</strong> {listing.storage}</p>
                      <p className="text-black"><strong>Time Until Pickup:</strong> {listing.timeUntilPickup} hours</p>
                      <p className="text-black"><strong>Time Left:</strong> {timeLeft}</p>
                      <div className="absolute bottom-2 right-2">
                        <img
                          src={listing.dietaryGuidelines === 'veg' ? '/veg.png' : '/non-veg.png'}
                          alt={listing.dietaryGuidelines === 'veg' ? 'Veg' : 'Non-Veg'}
                          className="w-6 h-6"
                        />
                      </div>
                      <p className="text-green-600 mt-5"><strong>Status:</strong> {isExpired ? 'Not Available' : 'Available'}</p>
                      <p className="text-sm text-black">Added on: {new Date(listing.created_at).toLocaleString()}</p>
                      <button
                        onClick={() => handleDelete(listing.id)}
                        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </li>
                  );
                })}
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