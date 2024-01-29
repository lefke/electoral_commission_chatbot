import '@/styles/base.css';
import type { AppProps } from 'next/app';
import { Html } from 'next/document';
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
        <meta
          name="viewport"
          content="width=device-width,minimum-scale=1,initial-scale=1"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
