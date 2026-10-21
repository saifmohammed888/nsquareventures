import '../styles/globals.css';
import '../styles/revisions.css';
import '../styles/mobile.css';
import '../styles/cms-revisions.css';
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
      <meta property="og:url" content="https://www.nsquareventures.com" />
      <meta property="og:image" content="https://www.nsquareventures.com/nsquare-social-card.png" />
      <meta property="og:image:secure_url" content="https://www.nsquareventures.com/nsquare-social-card.png" />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="1200" />
      <meta property="og:image:alt" content="N Square Ventures — Architecture, interiors and construction" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="N Square Ventures" />
      <meta name="twitter:description" content="Architecture | Interiors | Construction" />
      <meta name="twitter:image" content="https://www.nsquareventures.com/nsquare-social-card.png" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/favicon.svg" />
      <link rel="stylesheet" href="/shared-system.css" />
    </Head>
    <Script id="ns-page-loader" strategy="beforeInteractive">{`
      document.documentElement.classList.add('ns-page-loading');
      window.setTimeout(function(){document.documentElement.classList.add('ns-page-ready')}, 7000);
    `}</Script>
    <Component {...pageProps} />
  </>;
}
