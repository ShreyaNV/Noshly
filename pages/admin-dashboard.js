import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndUsers = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login'); // Redirect to login if not authenticated
        } else {
          setUser(user);
      
          // Fetch all users
          const { data, error } = await supabase
            .from('profiles')
            .select('user_id, username, role');
      
          if (error) {
            console.error('Error fetching users:', error);
          } else {
            setUsers(data);
          }
        }
      };

    fetchUserAndUsers();
  }, [router]);

  const handleApproveSeller = async (userId) => {
    // Implement approval logic (e.g., update user role to seller)
    const { error } = await supabase
      .from('profiles')
      .update({ role: 'seller' })
      .eq('id', userId);

    if (error) {
      console.error('Error approving seller:', error);
    } else {
      setUsers(users.map((user) =>
        user.id === userId ? { ...user, role: 'seller' } : user
      ));
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div>
        <h2 className="text-xl font-semibold mb-4">All Users</h2>
        <ul>
  {users.map((user) => (
    <li key={user.user_id} className="mb-4 p-4 border rounded">
      <p><strong>{user.username}</strong> - Role: {user.role}</p>
      {user.role === 'pending' && (
        <button
          onClick={() => handleApproveSeller(user.user_id)}
          className="mt-2 bg-green-500 text-white p-1 rounded hover:bg-green-600"
        >
          Approve Seller
        </button>
      )}
    </li>
  ))}
</ul>
      </div>
    </div>
  );
}