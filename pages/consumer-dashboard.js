import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import { calculateDistance } from '../utils/distance';
import Header from '@/components/Consumer-Header';
import Footer from '@/components/Footer';

export default function ConsumerDashboard() {
  const [user, setUser] = useState(null);
  const [foodListings, setFoodListings] = useState([]);
  const [expandedListingId, setExpandedListingId] = useState(null);
  const [timers, setTimers] = useState({});
  const router = useRouter();

  useEffect(() => {
     
    const fetchUserAndListings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
      } else {
        setUser(user);

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('latitude, longitude')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          return;
        }

        const { data: listings, error: listingsError } = await supabase
          .from('food_listings')
          .select('*');

        if (listingsError) {
          console.error('Error fetching listings:', listingsError);
        } else {
          console.log(listings);
          const nearbyListings = await Promise.all(
            listings.map(async (listing) => {
              const { data: sellerProfile, error: sellerProfileError } = await supabase
                .from('profiles')
                .select('latitude, longitude')
                .eq('user_id', listing.seller_id)
                .single();

              if (sellerProfileError) {
                console.error('Error fetching seller profile:', sellerProfileError);
                return null;
              }

              calculateDistance(
                profile.latitude,
                profile.longitude,
                sellerProfile.latitude,
                sellerProfile.longitude
              );

              return listing;
            })
          );

          setFoodListings(nearbyListings.filter(Boolean));
        }
      }
    };

    fetchUserAndListings();
  }, [router]);

  useEffect(() => {
    const intervalIds = {};
  
    foodListings.forEach((listing) => {
      let totalSeconds = (listing.timeUntilPickup || 0) * 3600; // Convert hours to seconds
  
      // Initialize the timer with the total seconds
      setTimers((prev) => ({
        ...prev,
        [listing.id]: totalSeconds,
      }));
  
      intervalIds[listing.id] = setInterval(() => {
        totalSeconds -= 1;
  
        if (totalSeconds <= 0) {
          clearInterval(intervalIds[listing.id]);
          totalSeconds = 0; // Prevent negative values
        }
  
        setTimers((prev) => ({
          ...prev,
          [listing.id]: totalSeconds,
        }));
      }, 1000);
    });
  
    return () => {
      Object.values(intervalIds).forEach(clearInterval); // Cleanup on unmount
    };
  }, [foodListings]);
  

  const toggleExpand = (id) => {
    setExpandedListingId(expandedListingId === id ? null : id);
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen flex flex-col bg-yellow-100">
      <Header />

      <div className="flex-grow px-4 py-6">
        <h2 className="text-2xl font-bold mb-6 text-center">All Available Listings in the Area:</h2>
        <div className="space-y-6">
          {foodListings.map((listing) => (
            <div key={listing.id} className="bg-red-200 shadow-lg rounded-2xl p-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold flex items-center">
                  {listing.dishName || 'N/A'}
                  <span className="ml-3 text-sm bg-blue-500 text-white px-2 py-1 rounded-full">
                    {timers[listing.id] || listing.timeUntilPickup || 'N/A'}
                  </span>
                </h3>
                <button
                  onClick={() => toggleExpand(listing.id)}
                  className="bg-gray-700 text-white px-4 py-1 rounded-xl hover:bg-gray-600"
                >
                  {expandedListingId === listing.id ? 'Hide Details' : 'Show Details'}
                </button>
              </div>

              {expandedListingId === listing.id && (
                <div className="mt-4 space-y-2 bg-red-100 p-4 rounded-lg">
                  <p><strong>Description:</strong> {listing.description || 'No description'}</p>
                  <p><strong>Serves:</strong> {listing.serves ?? 'N/A'} people</p>
                  <p><strong>Dietary:</strong> {listing.dietaryGuidelines || 'Not specified'}</p>
                  <p><strong>Storage:</strong> {listing.storage || 'No info'}</p>

                  <div className="flex justify-end space-x-4 mt-4">
                    <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Proceed</button>
                    <button onClick={() => toggleExpand(listing.id)} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Close</button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {foodListings.length === 0 && (
            <p className="text-center text-gray-600">No listings available within 10 km.</p>
          )}
        </div>
      </div>

      <Footer className="mt-auto" />
    </div>
  );
}
