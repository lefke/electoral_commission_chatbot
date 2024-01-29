import '@/styles/base.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';

// const inter = Inter({
//   variable: '--font-inter',
//   subsets: ['latin'],
// });

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Electoral Comission Chatbot</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
