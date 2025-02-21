// pages/api/auth/login.js
export default function handler(req, res) {
    if (req.method === 'POST') {
      const { email, password } = req.body;
  
      // Simulate authentication logic
      if (email === 'test@example.com' && password === 'password') {
        res.status(200).json({ message: 'Login successful', user: { id: 1, email } });
      } else {
        res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }