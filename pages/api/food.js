// pages/api/food.js
export default function handler(req, res) {
    if (req.method === 'GET') {
      // Simulate fetching food listings from a database
      const foodListings = [
        { id: 1, name: 'Fresh Bread', quantity: 10, seller: 'Bakery A' },
        { id: 2, name: 'Vegetables', quantity: 5, seller: 'Farm B' },
        { id: 3, name: 'Canned Goods', quantity: 20, seller: 'Supermarket C' },
      ];
  
      res.status(200).json(foodListings);
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }