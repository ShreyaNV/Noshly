import { AuthProvider } from '@/contexts/AuthContext';
import '../styles/globals.css';
import Head from 'next/head'; // Import the Head component

function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        {/* Add the favicon link */}
        <link rel="icon" href="logo-actual.png" /> {/* Replace with your custom favicon path */}
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}

export default MyApp;