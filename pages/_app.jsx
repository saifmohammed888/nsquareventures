import '../styles/globals.css';
import Script from 'next/script';
import Head from 'next/head';

export default function App({ Component, pageProps }){
  return <>
    <Head>
      <meta name="description" content="Nsquare Ventures is an architecture, interiors and construction practice in Bengaluru." />
      <meta property="og:site_name" content="Nsquare Ventures" />
      <meta property="og:title" content="Nsquare Ventures" />
      <meta property="og:description" content="Architecture | Interiors | Construction" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="/Images/Praveen Villa - Indiranagar.png" />
      <meta name="twitter:card" content="summary_large_image" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/favicon.svg" />
    </Head>
    <Script id="ns-page-loader" strategy="beforeInteractive">{`
      document.documentElement.classList.add('ns-page-loading');
      window.setTimeout(function(){document.documentElement.classList.add('ns-page-ready')}, 7000);
    `}</Script>
    <Component {...pageProps} />
  </>;
}
