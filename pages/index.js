import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import Quagga from 'quagga'; // Import QuaggaJS

const Home = () => {
  const [barcode, setBarcode] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null); // Reference to the video element
  const router = useRouter();
  const streamRef = useRef(null); // Reference to the camera stream

  const handleBarcodeSubmit = () => {
    if (barcode) {
      router.push(`/product/barcode?code=${barcode}`);
    }
  };

  const startScanner = () => {
    setCameraActive(true); // Activate the camera
  };

  useEffect(() => {
    if (cameraActive) {
      if (videoRef.current) {
        console.log("Video element available:", videoRef.current);

        // Test camera access directly
        navigator.mediaDevices.getUserMedia({ video: true })
          .then(stream => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
              streamRef.current = stream; // Save the stream reference
              console.log("Camera stream set to video element.");
            } else {
              console.error("Video element reference is null or undefined.");
            }
          })
          .catch(err => {
            console.error("Error accessing camera:", err);
          });

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
          console.log("Quagga initialization successful.");
          Quagga.start();
        });

        Quagga.onDetected((result) => {
          if (result && result.codeResult && result.codeResult.code) {
            const scannedCode = result.codeResult.code;
            setBarcode(scannedCode);
            // Stop Quagga and camera when a barcode is detected
            if (Quagga) {
              console.log("Stopping Quagga after detecting barcode:", scannedCode);
              try {
                Quagga.stop();
              } catch (error) {
                console.error("Error stopping Quagga:", error);
              }
            }
            if (streamRef.current) {
              streamRef.current.getTracks().forEach(track => track.stop()); // Stop camera stream
              console.log("Camera stream stopped.");
            }
            setCameraActive(false); // Deactivate camera

            // Redirect to barcode page
            if (scannedCode) {
              router.push(`/product/barcode?code=${scannedCode}`);
            }
          }
        });

        // Debugging: Log processing events to check Quagga's status
        Quagga.onProcessed((result) => {
          if (result) {
            console.log("Processing frame:", result);
          }
        });
      } else {
        console.error("Video element reference is null or undefined.");
      }
    }

    // Cleanup when component unmounts or camera is turned off
    return () => {
      console.log("Component is unmounting, attempting to stop Quagga and camera...");
      if (Quagga && Quagga.initialized) {
        try {
          Quagga.stop();
        } catch (error) {
          console.error("Error during Quagga stop cleanup:", error);
        }
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop()); // Stop camera stream
        console.log("Camera stream stopped during cleanup.");
      }
    };
  }, [cameraActive]);

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Product Lookup</h1>

      {/* Input field for barcode entry */}
      <input
        type="text"
        value={barcode}
        onChange={(e) => setBarcode(e.target.value)}
        placeholder="Enter or scan a barcode"
        style={{ padding: '10px', marginBottom: '20px', width: '80%' }}
      />
      <br />

      {/* Submit button */}
      <button onClick={handleBarcodeSubmit} style={{ padding: '10px 20px', marginBottom: '20px' }}>
        Search Product
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

export default Home;
