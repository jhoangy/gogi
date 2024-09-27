import { MealsProvider } from '../context/MealsContext';
import { ScoreProvider } from '../context/ScoreContext'; // Import the ScoreProvider

function MyApp({ Component, pageProps }) {
  return (
    <MealsProvider>
      <ScoreProvider>
        <Component {...pageProps} />
      </ScoreProvider>
    </MealsProvider>
  );
}

export default MyApp;
