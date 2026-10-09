import { useEffect, useState } from 'react';
import Head from 'next/head';
import { createPortal } from 'react-dom';

export function useContent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let live = true;
    fetch('/api/content')
      .then(response => {
        if (!response.ok) throw Error('Content is temporarily unavailable. Please reload to try again.');
        return response.json();
      })
      .then(content => { if (live) setData(content); })
      .catch(fetchError => { if (live) setError(fetchError.message); });
    return () => { live = false; };
  }, []);
  return { data, error };
}

export function ContactCTA() {
  return <section className="ns-contact-cta"><h2>Have a project in mind?</h2><a href="/contact">Contact N Square Ventures <span aria-hidden="true">↗</span></a></section>;
}

export function ContactMount({ id }) {
  const [mount, setMount] = useState(null);
  useEffect(() => setMount(document.getElementById(id)), [id]);
  return mount ? createPortal(<ContactCTA />, mount) : null;
}

function Brand() {
  return <a className="brand" href="/" aria-label="N Square Ventures home"><span className="mark">N</span><span>NSQUARE<small>VENTURES</small></span></a>;
}

export function Layout({ title, active, children }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '/shared-system.js';
    script.async = true;
    document.body.append(script);
    return () => script.remove();
  }, []);

  const isActive = label => active === label ? 'page' : undefined;
  return <div className="ns-public">
    <Head><title>{`${title} — N Square Ventures`}</title></Head>
    <header className="header ns-header">
      <Brand />
      <nav className="nav" aria-label="Primary"><a href="/works" aria-current={isActive('Works')}>Works</a><a href="/office" aria-current={isActive('Office')}>Office</a><a href="/contact" aria-current={isActive('Contact')}>Contact</a></nav>
      <div className="head-actions"><button className="menu-dot site-menu-trigger" type="button" aria-label="Open navigation">≡</button></div>
    </header>
    <main>{children}</main>
    <footer className="footer site-footer"><div className="footer-main site-footer-grid"><div className="site-footer-brand"><Brand /><p>Architecture, interiors and construction<br />in Bengaluru.</p></div><nav className="footer-links site-footer-col" aria-label="Footer explore"><h2>Explore</h2><a href="/works">Works</a><a href="/office">Office</a><a href="/contact">Contact</a></nav><div className="site-footer-col"><h2>Practice</h2><a href="/office">Architecture</a><a href="/office">Interiors</a><a href="/office">Construction</a></div><div className="footer-contact site-footer-location"><h2>Based In</h2><strong>Bengaluru<br />Karnataka<br />India</strong></div></div></footer>
    <div className="site-scrim" id="siteScrim" />
    <aside className="site-side" id="siteSide" aria-hidden="true"><div className="site-side-top"><Brand /><button className="site-close" id="siteMenuClose" type="button">Close ×</button></div><div className="site-side-label">Menu</div><nav className="site-side-nav"><a href="/works">Works <span>01</span></a><a href="/office">Office <span>02</span></a><a href="/contact">Contact <span>03</span></a></nav></aside>
  </div>;
}
