import { useEffect, useState } from 'react';
import axios from 'axios';

function formatTimeAgo(dateString) {
  const date = new Date(dateString);
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return date.toLocaleDateString();
}

function App() {
  const [prices, setPrices] = useState([]);
  const [filterLocation, setFilterLocation] = useState('');
  const [searchItem, setSearchItem] = useState('');
  const [form, setForm] = useState({ item: '', location: '', price: '' });

  // Fetch filtered prices whenever location or item changes
  useEffect(() => {
    fetchPrices(filterLocation, searchItem);
  }, [filterLocation, searchItem]);

  // Fetch all prices (initial mount or refresh)
  const fetchPrices = async (loc = '', item = '') => {
    const query = new URLSearchParams();
    if (loc) query.append('location', loc);
    if (item) query.append('item', item);

    const url = `http://localhost:3001/api/prices?${query.toString()}`;

    try {
      const res = await axios.get(url);
      setPrices(res.data);
    } catch (err) {
      console.error('Error fetching prices:', err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/prices', {
        item: form.item,
        location: form.location,
        price: parseFloat(form.price),
      });

      setForm({ item: '', location: '', price: '' });
      fetchPrices(filterLocation, searchItem); // refresh with filters applied
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>PeoplePrice</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Item"
          value={form.item}
          onChange={e => setForm({ ...form, item: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={form.location}
          onChange={e => setForm({ ...form, location: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price (₦)"
          value={form.price}
          onChange={e => setForm({ ...form, price: e.target.value })}
          required
        />
        <button type="submit">Add Price</button>
      </form>

      {/* Filters */}
      <input
        type="text"
        placeholder="Filter by location (e.g. Lagos)"
        value={filterLocation}
        onChange={(e) => setFilterLocation(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', display: 'block' }}
      />

      <input
        type="text"
        placeholder="Search item (e.g. Bread)"
        value={searchItem}
        onChange={(e) => setSearchItem(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', display: 'block' }}
      />

      <ul>
        {prices.map((p, i) => (
          <li key={i}>
            {p.item} - ₦{p.price} ({p.location}) — added {formatTimeAgo(p.date)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
