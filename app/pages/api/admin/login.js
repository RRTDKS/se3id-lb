export default function handler(req, res) {
    console.log('Admin login attempt');
    if (req.method === 'POST') {
      const { username, password } = req.body;
      console.log('Received credentials:', { username, password });
      console.log('Expected credentials:', { 
        username: process.env.ADMIN_USERNAME, 
        password: process.env.ADMIN_PASSWORD 
      });
  
      if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
      ) {
        console.log('Login successful');
        res.status(200).json({ success: true });
      } else {
        console.log('Login failed');
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } else {
      console.log(`Invalid method: ${req.method}`);
      res.setHeader('Allow', ['POST']);
      res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  }