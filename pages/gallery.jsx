import Head from 'next/head';
import Script from 'next/script';

export default function Page(){
  return (
    <>
      <Head>
        <title>Gallery — Nsquare Ventures</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <style>{`
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Inter:wght@400;500;600&display=swap');
:root{--p:#f8f7f2;--g:#17352f;--t:#44514c;--m:#738078;--l:#d9ddd7;--ser:"Cormorant Garamond",Georgia,serif;--sans:Inter,Arial,sans-serif;--x:clamp(44px,calc(5vw + 20px),112px)}
*{box-sizing:border-box}body{margin:0;background:var(--p);color:var(--g);font:14px var(--sans)}a{color:inherit;text-decoration:none}img{display:block;width:100%}.eyebrow{font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:var(--m)}
.gallery-hero{padding:72px var(--x) 36px;border-bottom:1px solid var(--l);background:#fbfaf6}.gallery-hero h1{font:500 clamp(58px,6vw,96px)/.86 var(--ser);letter-spacing:-.04em;margin:18px 0 18px}.gallery-hero p{max-width:560px;color:var(--t);line-height:1.65}
.gallery{padding:34px var(--x) 82px}.gallery-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}.gallery-item{border-bottom:1px solid var(--l);padding-bottom:12px}.gallery-item img{height:178px;object-fit:cover;background:#e4e8e4;filter:saturate(.88) contrast(.96)}.gallery-item h2{font:500 22px var(--ser);margin:10px 0 3px}.gallery-item p{margin:0;color:var(--m);font-size:11px;text-transform:uppercase;letter-spacing:.12em}
@media(max-width:1000px){.gallery-grid{grid-template-columns:repeat(3,1fr)}}@media(max-width:700px){.gallery-grid{grid-template-columns:repeat(2,1fr)}.gallery-item img{height:150px}}@media(max-width:460px){:root{--x:24px}.gallery-grid{grid-template-columns:1fr}.gallery-item img{height:220px}.gallery-hero h1{font-size:56px}}
`}</style>
        <link rel="stylesheet" href="/shared-system.css" />
      </Head>
      <div dangerouslySetInnerHTML={{ __html: `
<header class="header"><a class="brand" href="/"><span class="mark">N</span><span>NSQUARE<small>VENTURES</small></span></a><nav class="nav" aria-label="Primary"><a href="/">Home</a><a href="/projects">Projects</a><a href="/expertise">Expertise</a><a href="/journal">Journal</a><a class="active" href="/gallery">Gallery</a><a href="/contact">Contact</a></nav><div class="head-actions"><a class="inquire" href="/contact">Inquire <span>→</span></a><button class="menu-dot site-menu-trigger" type="button" aria-label="Open navigation">≡</button></div></header>
<main><section class="gallery-hero"><div class="eyebrow">Project Gallery</div><h1>Images from<br>our work.</h1><p>A simple ordered gallery of project images from the CMS, shown with project names for quick browsing.</p></section><section class="gallery"><div class="gallery-grid" data-cms-gallery></div></section></main>
<footer class="footer site-footer" id="footer"><div class="footer-main site-footer-grid"><div class="site-footer-brand"><a class="brand" href="/"><span class="mark">N</span><span>NSQUARE<small>VENTURES</small></span></a><p>Architecture-led design and delivery<br>in Bengaluru.</p></div><nav class="footer-links site-footer-col" aria-label="Footer explore"><h2>Explore</h2><a href="/projects">Projects</a><a href="/expertise">Expertise</a><a href="/journal">Journal</a><a href="/gallery">Gallery</a><a href="/contact">Contact</a></nav><div class="site-footer-col"><h2>Practice</h2><a href="/expertise">Architecture</a><a href="/expertise">Interiors</a><a href="/expertise">Construction</a><a href="/expertise#elevation">Approvals &amp; Coordination</a><a href="/expertise#elevation">Elevation Consultation</a></div><div class="footer-contact site-footer-location"><h2>Based In</h2><strong>Bengaluru<br>Karnataka<br>India</strong><a href="/contact">Start a conversation <span>→</span></a></div></div></footer>
<div class="site-scrim" id="siteScrim"></div><aside class="site-side" id="siteSide" aria-hidden="true"><div class="site-side-top"><a class="brand" href="/"><span class="mark">N</span><span>NSQUARE<small>VENTURES</small></span></a><button class="site-close" id="siteMenuClose" type="button">Close ×</button></div><div class="site-side-label">Menu</div><nav class="site-side-nav"><a href="/">Home <span>01</span></a><a href="/projects">Projects <span>02</span></a><a href="/expertise">Expertise <span>03</span></a><a href="/journal">Journal <span>04</span></a><a href="/gallery">Gallery <span>05</span></a><a href="/contact">Contact <span>06</span></a></nav><div class="site-side-foot"><div>Spaces<br>People<br>Belong in Harmony</div><div class="site-cross" aria-hidden="true"></div></div></aside>` }} />
      <Script src="/projects-data.js" strategy="afterInteractive" />
      <Script src="/shared-system.js" strategy="afterInteractive" />
    </>
  );
}
