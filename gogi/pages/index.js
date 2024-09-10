// pages/index.js
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const [barcode, setBarcode] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (barcode) {
      // Use query string to pass the barcode
      router.push(`/product/barcode?code=${barcode}`);
    }
  };

  return (
    <div>
      <h1>OpenFoodFacts Product Lookup</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="barcode">Enter Product Barcode:</label>
        <input
          type="text"
          id="barcode"
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Enter barcode"
          required
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
}
