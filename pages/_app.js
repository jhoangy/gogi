import { MealsProvider } from '../context/MealsContext';

function MyApp({ Component, pageProps }) {
  return (
    <MealsProvider>
      <Component {...pageProps} />
    </MealsProvider>
  );
}

export default MyApp;
