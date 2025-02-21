import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import { calculateDistance } from '../utils/distance'; // Import the utility function

export default function ConsumerDashboard() {
  const [user, setUser] = useState(null);
  const [foodListings, setFoodListings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndListings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login'); // Redirect to login if not authenticated
      } else {
        setUser(user);

        // Fetch consumer's profile
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('latitude, longitude')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else {
          // Fetch all food listings
          const { data: listings, error: listingsError } = await supabase
            .from('food_listings')
            .select('*');

          if (listingsError) {
            console.error('Error fetching listings:', listingsError);
          } else {
            // Filter listings within 10 km
            const nearbyListings = await Promise.all(
              listings.map(async (listing) => {
                // Fetch seller's profile to get their location
                const { data: sellerProfile, error: sellerProfileError } = await supabase
                  .from('profiles')
                  .select('latitude, longitude')
                  .eq('user_id', listing.seller_id)
                  .single();

                if (sellerProfileError) {
                  console.error('Error fetching seller profile:', sellerProfileError);
                  return null;
                }

                // Calculate distance between consumer and seller
                const distance = calculateDistance(
                  profile.latitude,
                  profile.longitude,
                  sellerProfile.latitude,
                  sellerProfile.longitude
                );

                // Return the listing if it's within 10 km
                if (distance <= 10) {
                  return listing;
                } else {
                  return null;
                }
              })
            );

            // Filter out null values (listings outside the 10 km radius)
            setFoodListings(nearbyListings.filter((listing) => listing !== null));
          }
        }
      }
    };

    fetchUserAndListings();
  }, [router]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Consumer Dashboard</h1>
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Food Listings</h2>
        <ul>
          {foodListings.map((listing) => (
            <li key={listing.id} className="mb-4 p-4 border rounded">
              <p><strong>{listing.name}</strong> - {listing.quantity} units</p>
              <button
                onClick={() => handleRequestListing(listing.id)}
                className="mt-2 bg-green-500 text-white p-1 rounded hover:bg-green-600"
              >
                Request
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}