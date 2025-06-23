const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

const prices = [
  { item: 'Bread', location: 'Lagos', price: 800, date: new Date().toISOString() },
  { item: 'Taxi Ride', location: 'Ibadan', price: 1500, date: new Date().toISOString() },
  { item: 'Beans', location: 'Abuja', price: 700, date: new Date().toISOString() }
];

app.get('/', (req, res) => {
   const { location, item } = req.query;

   let filtered = prices;
    if (location) {
      filtered = filtered.filter(p => p.location.toLowerCase() === location.toLowerCase());
    }

    if (item) {
      filtered = filtered.filter(
        p => p.item.toLowerCase() === item.toLowerCase());
    }

    res.json(filtered);
});

// This is a simple Express.js backend that serves a list of prices.
// It uses CORS to allow requests from the frontend.
app.get('/api/prices', (req, res) => {
     const { location } = req.query;

  if (location) {
    const filtered = prices.filter(p => p.location.toLowerCase() === location.toLowerCase());
    return res.json(filtered);
  }

  res.json(prices);
});

app.post('/api/prices', (req, res) => {
  const { item, location, price } = req.body;
  if (!item || !location || !price) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newEntry = {
    item,
    location,
    price,
    date: new Date().toISOString()
  };

  prices.push(newEntry);
  res.status(201).json({ message: 'Price added' });
});
// This endpoint allows adding new prices to the list.

app.listen(3001, () => {
     console.log('Backend running on http://localhost:3001')
    });
