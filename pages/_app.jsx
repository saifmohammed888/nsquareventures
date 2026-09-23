import '../styles/globals.css';
import Script from 'next/script';

export default function App({ Component, pageProps }){
  return <>
    <Script id="ns-page-loader" strategy="beforeInteractive">{`
      document.documentElement.classList.add('ns-page-loading');
      window.setTimeout(function(){document.documentElement.classList.add('ns-page-ready')}, 7000);
    `}</Script>
    <Component {...pageProps} />
  </>;
}
