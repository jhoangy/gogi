// pages/index.js
import { useRouter } from 'next/router';

const Home = () => {
  const router = useRouter();

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Product Lookup</h1>

      {/* Button to go to barcode search and camera scan page */}
      <button
        onClick={() => router.push('/product/search')}
        style={{ padding: '10px 20px', marginBottom: '20px' }}
      >
        Search by Barcode
      </button>

      {/* Page layout divided into 3 sections: left, middle, and right */}
      <div className="content-container" style={styles.contentContainer}>
        
        {/* Left Section: Daily Nutrition */}
        <div style={styles.section}>
          <h2>Daily Nutrition</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '8px' }}>Nutrient</th>
                <th style={{ textAlign: 'right', borderBottom: '1px solid #ddd', padding: '8px' }}>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '8px' }}>Calories</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>0</td>
              </tr>
              <tr>
                <td style={{ padding: '8px' }}>Fat</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>0g</td>
              </tr>
              <tr>
                <td style={{ padding: '8px' }}>Carbohydrates</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>0g</td>
              </tr>
              <tr>
                <td style={{ padding: '8px' }}>Protein</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>0g</td>
              </tr>
              <tr>
                <td style={{ padding: '8px' }}>Sodium</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>0mg</td>
              </tr>
              <tr>
                <td style={{ padding: '8px' }}>Sugar</td>
                <td style={{ textAlign: 'right', padding: '8px' }}>0g</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Middle Section: Breakfast, Lunch, Dinner, Snacks */}
        <div style={styles.section}>
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

        {/* Right Section: Daily Water Intake */}
        <div style={styles.section}>
          <h2>Daily Water Intake</h2>
          <div style={{ width: '100px', height: '100px', backgroundColor: 'red', margin: '0 auto' }}></div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 768px) {
          .content-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  contentContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '40px',
    textAlign: 'left',
  },
  section: {
    flex: '1',
    padding: '20px',
  }
};

export default Home;

