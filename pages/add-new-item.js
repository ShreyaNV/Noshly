import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Header from '../components/Seller-Header';
import { useRouter } from 'next/router'; // Import useRouter

export default function SellerDashboard() {
  const router = useRouter(); // Initialize useRouter

  const [newListing, setNewListing] = useState({
    dishName: '',
    description: '',
    serves: '',
    storage: '',
    dietaryGuidelines: '', // 'veg' or 'non-veg'
    timeUntilPickup: '',
  });

  const [isVegSelected, setIsVegSelected] = useState(false);
  const [isNonVegSelected, setIsNonVegSelected] = useState(false);

  const handleAddListing = async (e) => {
    e.preventDefault();

    // Validate all fields
    if (
      !newListing.dishName ||
      !newListing.description ||
      !newListing.serves ||
      !newListing.storage ||
      !newListing.dietaryGuidelines ||
      !newListing.timeUntilPickup
    ) {
      alert('Please fill out all fields.');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('You must be logged in to add a listing.');
      return;
    }

    try {
      // Insert the new food listing into the database
      const { data: listing, error: listingError } = await supabase
        .from('food_listings')
        .insert([{ seller_id: user.id, ...newListing }])
        .select()
        .single();

      if (listingError) {
        console.error('Error adding listing:', listingError);
        alert('Failed to add listing. Please try again.');
      } else {
        // Reset the form
        setNewListing({
          dishName: '',
          description: '',
          serves: '',
          storage: '',
          dietaryGuidelines: '',
          timeUntilPickup: '',
        });
        setIsVegSelected(false);
        setIsNonVegSelected(false);
        alert('Listing added successfully!');
      }
    } catch (error) {
      console.error('Error in handleAddListing:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      // Reset the form
      setNewListing({
        dishName: '',
        description: '',
        serves: '',
        storage: '',
        dietaryGuidelines: '',
        timeUntilPickup: '',
      });
      setIsVegSelected(false);
      setIsNonVegSelected(false);
    }
  };

  // Function to handle back button click
  const handleBack = () => {
    router.push('/seller-dashboard'); // Redirect to seller-dashboard
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ backgroundColor: '#F8E49B' }}>
      <Header />
      <div className="pt-16 p-8">
        {/* Remove the <center> tag and use flex to align the button and heading */}
    <div className="flex items-center justify-start space-x-4 pl-8">
      {/* Circular Back Arrow Button */}
      <button
        onClick={handleBack}
        className="text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-600"
      >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </button>
          </div>
          <center><h1 className="text-2xl font-bold mb-6">Add Item Description</h1></center>
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <form onSubmit={handleAddListing} className="space-y-4">
              {/* Dish Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Item Name</label>
                <input
                  type="text"
                  style={{ backgroundColor: '#C3C079' }}
                  value={newListing.dishName}
                  onChange={(e) => setNewListing({ ...newListing, dishName: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newListing.description}
                  style={{ backgroundColor: '#C3C079' }}
                  onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                  className="w-full p-2 border rounded"
                  rows={3}
                  required
                />
              </div>

              {/* Serves */}
              <div>
                <label className="block text-sm font-medium mb-2">Serves</label>
                <input
                  type="number"
                  style={{ backgroundColor: '#C3C079' }}
                  value={newListing.serves}
                  onChange={(e) => setNewListing({ ...newListing, serves: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder=""
                  required
                />
              </div>

              {/* Storage */}
              <div>
                <label className="block text-sm font-medium mb-2">Storage</label>
                <input
                  type="text"
                  style={{ backgroundColor: '#C3C079' }}
                  value={newListing.storage}
                  onChange={(e) => setNewListing({ ...newListing, storage: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder=""
                  required
                />
              </div>

              {/* Dietary Guidelines */}
              <div>
                <label className="block text-sm font-medium mb-2">Dietary Guidelines</label>
                <div className="flex space-x-4">
                  <div
                    className={`cursor-pointer p-2 border rounded ${isVegSelected ? 'bg-green-100' : 'bg-white'}`}
                    onClick={() => {
                      setIsVegSelected(true);
                      setIsNonVegSelected(false);
                      setNewListing({ ...newListing, dietaryGuidelines: 'veg' });
                    }}
                  >
                    <img src="/veg.png" alt="Veg" width={10} height={10} className="w-8 h-8" />
                  </div>
                  <div
                    className={`cursor-pointer p-2 border rounded ${isNonVegSelected ? 'bg-red-100' : 'bg-white'}`}
                    onClick={() => {
                      setIsVegSelected(false);
                      setIsNonVegSelected(true);
                      setNewListing({ ...newListing, dietaryGuidelines: 'non-veg' });
                    }}
                  >
                    <img src="/non-veg.png" width={10} height={10} alt="Non-Veg" className="w-8 h-8" />
                  </div>
                </div>
              </div>

              {/* Time Until Pickup */}
              <div>
                <label className="block text-sm font-medium mb-2">Time Until Pickup (in hr Only)</label>
                <input
                  type="text"
                  style={{ backgroundColor: '#C3C079' }}
                  value={newListing.timeUntilPickup}
                  onChange={(e) => setNewListing({ ...newListing, timeUntilPickup: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder=""
                  required
                />
              </div>

              {/* Tick and Cross Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="bg-red-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-red-600"
                >
                  ✕
                </button>
                <button
                  type="submit"
                  className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-green-600"
                >
                  ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}