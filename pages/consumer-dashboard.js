import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import { calculateDistance } from '../utils/distance';
import Header from '@/components/Consumer-Header';
import Footer from '@/components/Footer';

export default function ConsumerDashboard() {
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

              const distance = calculateDistance(
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
                <h3 className="text-xl font-semibold">{listing.restaurant_name || 'Restaurant/Org Name'}</h3>
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                  ⭐ {listing.rating ?? 'N/A'}
                </span>
              </div>
              <p className="text-lg"><strong>Dish:</strong> {listing.dish_name || 'N/A'}</p>
              <p><strong>Serves:</strong> {listing.quantity ?? 'N/A'} people</p>
              <p><strong>Dietary:</strong> {listing.dietary_info || 'Not specified'}</p>
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