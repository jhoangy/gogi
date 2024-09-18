import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Product Lookup</h1>

      {/* Button to go to barcode search and camera scan page */}
      <button onClick={() => router.push('/product/search')} style={{ padding: '10px 20px', marginBottom: '20px' }}>
        Search by Barcode
      </button>

      {/* Sections for Breakfast, Lunch, Dinner, Snacks with borders and "Add Food" buttons */}
      <div style={{ marginTop: '40px', textAlign: 'left' }}>
        <section style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px' }}>
          <h3>Breakfast</h3>
          <button style={{ padding: '10px 20px' }}>Add Food</button>
        </section>
        
        <section style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px' }}>
          <h3>Lunch</h3>
          <button style={{ padding: '10px 20px' }}>Add Food</button>
        </section>
        
        <section style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px' }}>
          <h3>Dinner</h3>
          <button style={{ padding: '10px 20px' }}>Add Food</button>
        </section>
        
        <section style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '20px' }}>
          <h3>Snacks</h3>
          <button style={{ padding: '10px 20px' }}>Add Food</button>
        </section>
      </div>
    </div>
  );
};

export default Home;
