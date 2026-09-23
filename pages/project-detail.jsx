import Head from 'next/head';
import Script from 'next/script';

export default function Page(){
  return (
    <>
      <Head>
        <title>Project Details — Nsquare Ventures</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <style>{`
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Inter:wght@400;500;600&display=swap');
:root{--paper:#f8f7f2;--ink:#17352f;--text:#44514c;--muted:#738078;--line:#d9ddd7;--g:clamp(44px,calc(5vw + 20px),112px);--serif:"Cormorant Garamond",Georgia,serif;--sans:Inter,Arial,sans-serif}
*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:14px var(--sans)}a{color:inherit;text-decoration:none}img{display:block;width:100%}.eyebrow{font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:var(--muted)}
.detail-hero{display:grid;grid-template-columns:38% 62%;min-height:min(640px,60vh);border-bottom:1px solid var(--line);background:linear-gradient(120deg,#fbfaf6,#f3f1eb)}
.detail-copy{padding:70px 40px 54px var(--g);display:flex;flex-direction:column;justify-content:center}.detail-copy h1{font:500 clamp(58px,5.4vw,92px)/.86 var(--serif);letter-spacing:-.04em;margin:28px 0 24px}.detail-copy p{max-width:470px;color:var(--text);font-size:15px;line-height:1.7}.detail-actions{display:flex;gap:16px;flex-wrap:wrap;margin-top:30px}.detail-actions a{border:1px solid #bfc6c0;padding:14px 18px;display:inline-flex;gap:24px}.detail-actions a:first-child{background:var(--ink);color:white;border-color:var(--ink)}
.detail-image{height:min(640px,60vh);min-height:420px;background:#e4e8e4}.detail-image img{height:100%;object-fit:cover;object-position:center;filter:saturate(.86) contrast(.95)}
.detail-meta{display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid var(--line);background:#fbfaf6}.detail-meta div{padding:24px var(--g) 24px 24px;border-right:1px solid var(--line)}.detail-meta div:first-child{padding-left:var(--g)}.detail-meta b{display:block;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted);margin-bottom:8px}.detail-meta span{font:500 22px var(--serif)}
.detail-body{display:grid;grid-template-columns:minmax(280px,440px) 1fr;gap:clamp(42px,8vw,120px);padding:72px var(--g);background:var(--paper)}.detail-body h2{font:500 clamp(42px,4vw,70px)/.9 var(--serif);letter-spacing:-.03em;margin:14px 0 0}.detail-body p{font-size:16px;line-height:1.75;color:var(--text);max-width:680px}.scope-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-top:34px}.scope-grid span{border-top:1px solid var(--line);padding-top:14px;color:var(--text)}
.detail-gallery{display:grid;grid-template-columns:1.2fr .8fr;gap:24px;padding:0 var(--g) 76px;background:var(--paper)}.detail-gallery img{height:360px;object-fit:cover;background:#e4e8e4}.detail-empty{padding:80px var(--g);min-height:420px}
@media(max-width:900px){.detail-hero,.detail-body,.detail-gallery,.detail-meta{grid-template-columns:1fr}.detail-image{height:56vh;min-height:320px}.detail-meta div,.detail-meta div:first-child{padding:22px var(--g);border-right:0;border-bottom:1px solid var(--line)}}
@media(max-width:560px){:root{--g:24px}.detail-copy{padding-top:48px;padding-bottom:44px}.detail-copy h1{font-size:52px}.detail-gallery img{height:260px}.scope-grid{grid-template-columns:1fr}}
`}</style>
        <link rel="stylesheet" href="/shared-system.css" />
      </Head>
      <div dangerouslySetInnerHTML={{ __html: `
<header class="header"><a class="brand" href="/"><span class="mark">N</span><span>NSQUARE<small>VENTURES</small></span></a><nav class="nav" aria-label="Primary"><a href="/">Home</a><a class="active" href="/projects">Projects</a><a href="/expertise">Expertise</a><a href="/journal">Journal</a><a href="/gallery">Gallery</a><a href="/contact">Contact</a></nav><div class="head-actions"><a class="inquire" href="/contact">Inquire <span>→</span></a><button class="menu-dot site-menu-trigger" type="button" aria-label="Open navigation">≡</button></div></header>
<main id="projectDetail"><section class="detail-empty"><div class="eyebrow">Project</div><h1>Loading project.</h1></section></main>
<footer class="footer site-footer" id="footer"><div class="footer-main site-footer-grid"><div class="site-footer-brand"><a class="brand" href="/"><span class="mark">N</span><span>NSQUARE<small>VENTURES</small></span></a><p>Architecture-led design and delivery<br>in Bengaluru.</p></div><nav class="footer-links site-footer-col" aria-label="Footer explore"><h2>Explore</h2><a href="/projects">Projects</a><a href="/expertise">Expertise</a><a href="/journal">Journal</a><a href="/gallery">Gallery</a><a href="/contact">Contact</a></nav><div class="site-footer-col"><h2>Practice</h2><a href="/expertise">Architecture</a><a href="/expertise">Interiors</a><a href="/expertise">Construction</a><a href="/expertise#elevation">Approvals &amp; Coordination</a><a href="/expertise#elevation">Elevation Consultation</a></div><div class="footer-contact site-footer-location"><h2>Based In</h2><strong>Bengaluru<br>Karnataka<br>India</strong><a href="/contact">Start a conversation <span>→</span></a></div></div></footer>
<div class="site-scrim" id="siteScrim"></div><aside class="site-side" id="siteSide" aria-hidden="true"><div class="site-side-top"><a class="brand" href="/"><span class="mark">N</span><span>NSQUARE<small>VENTURES</small></span></a><button class="site-close" id="siteMenuClose" type="button">Close ×</button></div><div class="site-side-label">Menu</div><nav class="site-side-nav"><a href="/">Home <span>01</span></a><a href="/projects">Projects <span>02</span></a><a href="/expertise">Expertise <span>03</span></a><a href="/journal">Journal <span>04</span></a><a href="/gallery">Gallery <span>05</span></a><a href="/contact">Contact <span>06</span></a></nav><div class="site-side-foot"><div>Spaces<br>People<br>Belong in Harmony</div><div class="site-cross" aria-hidden="true"></div></div></aside>


` }} />
      <Script src="/projects-data.js" strategy="afterInteractive" />
      <Script src="/shared-system.js" strategy="afterInteractive" />
    </>
  );
}
