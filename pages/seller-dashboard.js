import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import { calculateDistance } from '../utils/distance'; // Utility function to calculate distance

export default function SellerDashboard() {
  const [user, setUser] = useState(null);
  const [foodListings, setFoodListings] = useState([]);
  const [newListing, setNewListing] = useState({ name: '', quantity: '' });
  const [notifications, setNotifications] = useState([]);
  const router = useRouter();

  // Fetch seller's profile and food listings
  useEffect(() => {
    const fetchUserAndListings = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login'); // Redirect to login if not authenticated
      } else {
        setUser(user);

        // Fetch seller's food listings
        const { data, error } = await supabase
          .from('food_listings')
          .select('*')
          .eq('seller_id', user.id);

        if (error) {
          console.error('Error fetching listings:', error);
        } else {
          setFoodListings(data);
        }

        // Fetch seller's notifications
        const { data: notificationsData, error: notificationsError } = await supabase
          .from('notifications')
          .select('*')
          .eq('seller_id', user.id)
          .order('created_at', { ascending: false });

        if (notificationsError) {
          console.error('Error fetching notifications:', notificationsError);
        } else {
          setNotifications(notificationsData);
        }
      }
    };

    fetchUserAndListings();

    // Subscribe to real-time notifications
    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `seller_id=eq.${user?.id}` },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev]);
        }
      )
      .subscribe();

    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [router, user?.id]);

  // Add a new food listing
  const handleAddListing = async (e) => {
    e.preventDefault();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('You must be logged in to add a listing.');
      return;
    }

    // Fetch seller's location
    const { data: sellerProfile, error: profileError } = await supabase
      .from('profiles')
      .select('latitude, longitude')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching seller profile:', profileError);
      return;
    }

    // Insert the new food listing
    const { data: listing, error: listingError } = await supabase
      .from('food_listings')
      .insert([{ seller_id: user.id, name: newListing.name, quantity: newListing.quantity }])
      .select()
      .single();

    if (listingError) {
      console.error('Error adding listing:', listingError);
    } else {
      setFoodListings([...foodListings, listing]);

      // Fetch all consumers
      const { data: consumers, error: consumersError } = await supabase
        .from('profiles')
        .select('user_id, latitude, longitude')
        .eq('role', 'consumer');

      if (consumersError) {
        console.error('Error fetching consumers:', consumersError);
      } else {
        // Notify nearby consumers
        consumers.forEach((consumer) => {
          const distance = calculateDistance(
            sellerProfile.latitude,
            sellerProfile.longitude,
            consumer.latitude,
            consumer.longitude
          );

          if (distance <= 10) { // Notify consumers within 10 km
            supabase
              .from('notifications')
              .insert([{
                seller_id: user.id,
                consumer_id: consumer.user_id,
                listing_id: listing.id,
                message: `New food listing near you: ${listing.name}`,
                is_read: false,
              }]);
          }
        });
      }

      setNewListing({ name: '', quantity: '' }); // Reset form
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Listing</h2>
          <form onSubmit={handleAddListing} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Food Name</label>
              <input
                type="text"
                value={newListing.name}
                onChange={(e) => setNewListing({ ...newListing, name: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Quantity</label>
              <input
                type="number"
                value={newListing.quantity}
                onChange={(e) => setNewListing({ ...newListing, quantity: e.target.value })}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add Listing
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Your Listings</h2>
          <ul>
            {foodListings.map((listing) => (
              <li key={listing.id} className="mb-4 p-4 border rounded">
                <p><strong>{listing.name}</strong> - {listing.quantity} units</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}