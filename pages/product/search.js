// pages/product/search.js
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Quagga from 'quagga'; // Import QuaggaJS for camera scanning

const Search = () => {
  const [barcode, setBarcode] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [recipeQuery, setRecipeQuery] = useState(''); // State for recipe search
  const videoRef = useRef(null); // Reference to the video element
  const router = useRouter();
  const streamRef = useRef(null); // Reference to the camera stream

  // Function to handle barcode search
  const handleBarcodeSubmit = () => {
    if (barcode) {
      router.push(`/product/barcode?code=${barcode}`);
    }
  };

  // Function to handle recipe search
  const handleRecipeSubmit = async () => {
    if (recipeQuery) {
      try {
        // Replace with your own API URL and Key (Edamam example used here)
        const response = await fetch(
          `https://api.edamam.com/search?q=${recipeQuery}&app_id=YOUR_APP_ID&app_key=YOUR_APP_KEY`
        );
        const data = await response.json();

        if (data.hits && data.hits.length > 0) {
          const recipe = data.hits[0].recipe; // Get the first recipe result
          console.log('Ingredients:', recipe.ingredientLines); // Log the ingredients to the console
        } else {
          console.log('No recipe found for the query.');
        }
      } catch (error) {
        console.error('Error fetching recipe data:', error);
      }
    }
  };

  const startScanner = () => {
    setCameraActive(true); // Activate the camera
  };

  useEffect(() => {
    if (cameraActive) {
      if (videoRef.current) {
        // Access camera stream
        navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } } // Back camera
        })
          .then(stream => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              streamRef.current = stream; // Save the stream reference
              videoRef.current.setAttribute('playsinline', 'true'); // Ensure playsinline for iOS Safari
            } else {
              console.error("Video element reference is null or undefined.");
            }
          })
          .catch(err => {
            console.error("Error accessing camera:", err);
          });

        // Initialize Quagga for barcode detection
        Quagga.init({
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: videoRef.current, // Pass video reference
            constraints: {
              width: { min: 640 },
              height: { min: 480 },
              facingMode: 'environment', // Use back camera
            },
          },
          decoder: {
            readers: ['ean_reader'], // EAN reader for barcodes
          },
          locate: true, // Auto-locate barcodes
        }, (err) => {
          if (err) {
            console.error("Quagga initialization failed:", err);
            return;
          }
          Quagga.start();
        });

        Quagga.onDetected((result) => {
          if (result && result.codeResult && result.codeResult.code) {
            const scannedCode = result.codeResult.code;

            // Stop Quagga and camera when a barcode is detected
            if (Quagga) {
              try {
                Quagga.stop();
              } catch (error) {
                console.error("Error stopping Quagga:", error);
              }
            }
            if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop()); // Stop camera stream
            }
            setCameraActive(false); // Deactivate camera

            // Redirect to the barcode page
            router.push(`/product/barcode?code=${scannedCode}`);
          }
        });

        Quagga.onProcessed((result) => {
          if (result) {
            console.log("Processing frame:", result);
          }
        });
      }
    }

    // Cleanup when the component unmounts or camera is turned off
    return () => {
      if (Quagga && Quagga.initialized) {
        try {
          Quagga.stop();
        } catch (error) {
          console.error("Error during Quagga stop cleanup:", error);
        }
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop()); // Stop camera stream
      }
    };
  }, [cameraActive]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Search Product</h1>

      {/* Input field for barcode entry */}
      <input
        type="text"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        placeholder="Enter a barcode"
        style={{ padding: '10px', marginBottom: '20px', width: '80%' }}
      />
      <br />

      {/* Submit button for barcode search */}
      <button onClick={handleBarcodeSubmit} style={{ padding: '10px 20px', marginBottom: '20px' }}>
        Search Product
      </button>

      {/* Recipe Search Section */}
      <h2>Search for Recipe</h2>
      <input
        type="text"
        value={recipeQuery}
        onChange={(e) => setRecipeQuery(e.target.value)}
        placeholder="Enter a recipe name"
        style={{ padding: '10px', marginBottom: '20px', width: '80%' }}
      />
      <br />

      {/* Submit button for recipe search */}
      <button onClick={handleRecipeSubmit} style={{ padding: '10px 20px', marginBottom: '20px' }}>
        Search Recipe
      </button>

      {/* Camera Access and Barcode Scanner */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={startScanner} style={{ padding: '10px 20px' }}>
          {cameraActive ? 'Scanning...' : 'Scan Barcode with Camera'}
        </button>

        {/* Video element for displaying the camera stream */}
        {cameraActive && (
          <div style={{ position: 'relative', marginTop: '20px' }}>
            <video
              ref={videoRef}
              style={{ width: '100%', height: 'auto', border: '1px solid #ddd' }}
              autoPlay
              muted
              playsInline
            />
            {/* Always show "Scanning..." text while camera is active */}
            <div
              style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                bottom: '0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: '#fff',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              }}
            >
              <span>Scanning...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
