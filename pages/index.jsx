import Head from 'next/head';
import Script from 'next/script';

export default function Page(){
  return (
    <>
      <Head>
        <title>Nsquare Ventures — Architecture-led design and delivery</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <style>{`
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500&family=Inter:wght@400;500;600&display=swap');
:root{--paper:#f8f7f2;--ink:#17352f;--text:#44514c;--muted:#738078;--line:#d9ddd7;--sage:#718078;--sage2:#5f7068;--white:#fff;--g:clamp(44px,calc(5vw + 20px),112px);--serif:"Cormorant Garamond",Georgia,serif;--sans:Inter,Arial,sans-serif}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:linear-gradient(120deg,#fbfaf6,#f3f1eb);color:var(--ink);font-family:var(--sans);font-size:14px}.shell{width:100%;background:var(--paper)}a{color:inherit;text-decoration:none}button{font:inherit}img{display:block;width:100%}
.header{height:78px;display:grid;grid-template-columns:260px 1fr auto;align-items:center;padding:0 var(--g);border-bottom:1px solid var(--line);position:relative;z-index:10;background:rgba(248,247,242,.95)}
.brand{display:flex;align-items:center;gap:13px;letter-spacing:.16em;font-family:var(--serif);font-size:21px}.mark{width:39px;height:39px;border:1px solid var(--ink);display:grid;place-items:center;font:500 23px var(--serif)}.brand small{display:block;font:500 10px var(--sans);letter-spacing:.28em;margin-top:1px}
.nav{display:flex;justify-content:center;gap:32px;font-size:12px}.nav a{position:relative}.nav a:after{content:"";position:absolute;left:0;right:100%;bottom:-7px;height:1px;background:var(--ink);transition:.25s}.nav a:hover:after{right:0}
.head-actions{display:flex;align-items:center;gap:22px}.menu-btn{display:none;background:none;border:0;cursor:pointer;padding:12px 0}.primary{background:var(--ink);color:white;border:1px solid var(--ink);padding:15px 23px;display:inline-flex;align-items:center;gap:28px;transition:.25s}.primary:hover{background:#27483f}.arrow{font-size:18px}.hero{display:grid;grid-template-columns:41% 59%;min-height:650px;border-bottom:1px solid var(--line)}.hero-copy{padding:54px 34px 34px var(--g);display:flex;flex-direction:column}.eyebrow{font-size:10px;letter-spacing:.25em;text-transform:uppercase;color:var(--muted)}h1{font:500 clamp(58px,5.3vw,88px)/.91 var(--serif);letter-spacing:-.035em;margin:42px 0 24px;max-width:620px}.lead{font-size:15px;line-height:1.6;color:var(--text);max-width:500px}.actions{display:flex;gap:16px;margin-top:27px}.secondary{border:1px solid #bfc6c0;padding:14px 20px;display:inline-flex;gap:28px;align-items:center}.hero-note{margin-top:20px;border-left:1px solid var(--ink);padding:0 0 0 20px;color:#59645f;font-size:12px;line-height:1.55}.visual{position:relative;overflow:hidden;min-height:650px;background:#e7ebe7}.visual img{height:100%;object-fit:cover;filter:saturate(.76) contrast(.94)}.visual:after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(248,247,242,.38),transparent 37%);pointer-events:none}.drawing{position:absolute;inset:0;z-index:2;pointer-events:none;background-image:linear-gradient(rgba(23,53,47,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(23,53,47,.08) 1px,transparent 1px);background-size:88px 88px;mask-image:linear-gradient(90deg,#000 0%,transparent 66%)}.drawing svg{width:100%;height:100%}.drawing path{fill:none;stroke:#17352f;stroke-width:.7;opacity:.28;stroke-dasharray:8 8;animation:dash 18s linear infinite}@keyframes dash{to{stroke-dashoffset:-300}}.visual-meta{position:absolute;z-index:4;right:42px;top:38px;border-left:1px solid var(--ink);padding-left:20px;font-size:13px;line-height:1.7;letter-spacing:.2em;text-transform:uppercase}.location{position:absolute;z-index:4;left:42px;bottom:22px;font-size:9px;letter-spacing:.28em}.pager{position:absolute;z-index:4;right:42px;bottom:20px;display:flex;gap:20px;align-items:center}.projects{padding:70px var(--g) 56px}.projects-head{display:grid;grid-template-columns:1fr 340px;align-items:end;gap:30px;margin-bottom:24px}.projects h2{font:500 clamp(45px,4vw,64px)/.92 var(--serif);margin:15px 0 0;letter-spacing:-.025em}.projects-intro{display:flex;justify-content:space-between;align-items:flex-start;gap:25px;color:var(--text);font-size:12px;line-height:1.55}.project-grid{display:grid;grid-template-columns:1.15fr 1fr 1fr;gap:22px}.card{border-bottom:1px solid #cbd0cb;position:relative}.card-image{height:230px;overflow:hidden;background:#e4e8e4}.card img{height:100%;object-fit:cover;transition:transform .7s cubic-bezier(.22,.61,.36,1)}.card:hover img{transform:scale(1.035)}.card-info{padding:12px 4px 14px;display:grid;grid-template-columns:1fr auto;gap:12px}.card h3{font:500 21px var(--serif);margin:0 0 4px}.card p{margin:0;color:var(--muted);font-size:10px}.stats{display:grid;grid-template-columns:repeat(3,180px) 1fr;gap:0;margin-top:32px;align-items:end}.stat{border-right:1px solid var(--line);padding-right:28px;margin-right:28px}.stat strong{font:500 29px var(--serif)}.stat span{display:block;font-size:10px;color:var(--muted);margin-top:3px}.signature{text-align:right;font-size:9px;letter-spacing:.2em;color:var(--muted)}.side{position:fixed;right:0;top:0;height:100%;width:min(390px,92vw);z-index:100;background:var(--ink);color:#f8f7f2;transform:translateX(102%);transition:transform .55s cubic-bezier(.22,.61,.36,1);padding:34px 38px;display:flex;flex-direction:column;box-shadow:-16px 0 50px rgba(17,40,34,.08)}.side.open{transform:none}.side-top{display:flex;justify-content:space-between;align-items:flex-start}.side .brand{color:#f8f7f2}.side .mark{border-color:#f8f7f2}.close{background:none;border:0;color:white;cursor:pointer;font-size:12px}.side-label{margin-top:58px;font-size:9px;letter-spacing:.22em;opacity:.75}.side-nav{margin-top:10px}.side-nav a{display:grid;grid-template-columns:1fr auto;padding:14px 0;border-bottom:1px solid rgba(255,255,255,.18);font:400 30px/1 var(--serif)}.side-nav span{font:400 10px var(--sans);opacity:.75;align-self:center}.side-art{margin-top:28px;display:grid;grid-template-columns:1fr 82px;gap:18px;align-items:end}.side-art img{height:180px;object-fit:cover;filter:saturate(.65)}.side-words{font-size:9px;line-height:1.8;letter-spacing:.2em;text-transform:uppercase}.side-foot{margin-top:auto;display:flex;justify-content:space-between;align-items:end;font-size:10px;line-height:1.9}.cross{width:44px;height:44px;position:relative}.cross:before,.cross:after{content:"";position:absolute;background:rgba(255,255,255,.45)}.cross:before{width:100%;height:1px;top:50%}.cross:after{height:100%;width:1px;left:50%}.scrim{position:fixed;inset:0;background:rgba(15,28,24,.14);z-index:90;opacity:0;pointer-events:none;transition:.4s}.scrim.open{opacity:1;pointer-events:auto}
@media(max-width:900px){.header{grid-template-columns:1fr auto}.nav{display:none}.hero{grid-template-columns:1fr}.hero-copy{min-height:570px;padding:42px var(--g)}.visual{min-height:520px}.projects-head{grid-template-columns:1fr}.project-grid{grid-template-columns:1fr}.card-image{height:330px}.stats{grid-template-columns:repeat(3,1fr)}.signature{display:none}}
@media(max-width:560px){.header{height:68px}.brand{font-size:17px}.mark{width:34px;height:34px}.hero-copy{min-height:520px}h1{font-size:55px}.visual{min-height:440px}.visual-meta{right:20px;top:22px}.location{left:20px}.pager{right:20px}.projects{padding-top:38px}.projects h2{font-size:48px}.projects-intro{display:block}.projects-intro a{display:block;margin-bottom:12px}.card-image{height:250px}.stats{grid-template-columns:1fr;gap:18px}.stat{border-right:0;border-bottom:1px solid var(--line);padding-bottom:12px}.side{padding:28px 26px}.side-nav a{font-size:27px}}
.projects{padding:70px var(--g) 58px;background:linear-gradient(120deg,#fbfaf6,#f3f1eb)}
.projects-head{grid-template-columns:1.1fr .9fr;align-items:start;margin-bottom:28px}
.projects .eyebrow{color:var(--ink)}
.projects h2{font-size:clamp(44px,4.6vw,72px);max-width:520px}
.projects-intro{display:grid;grid-template-columns:1fr;justify-items:end;text-align:left;padding-top:24px}
.projects-intro a{font-weight:600;color:var(--ink)}
.project-grid{grid-template-columns:repeat(3,1fr);gap:22px}
.card{min-height:240px;border:0;overflow:hidden;background:#dfe5df}
.card-image{height:100%;min-height:240px}
.card:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 38%,rgba(5,22,18,.82));pointer-events:none}
.card-info{position:absolute;left:0;right:0;bottom:0;z-index:2;color:white;padding:0 24px 20px;grid-template-columns:1fr auto;align-items:end}
.card h3{font-size:24px;color:white}
.card p{font-size:12px;color:rgba(255,255,255,.88)}
.card .arrow{grid-column:2;grid-row:1 / span 2;font-size:18px}
.stats{grid-template-columns:170px 150px 170px 1fr;margin-top:30px}
.stat{border-right:1px solid var(--line);padding-right:34px;margin-right:34px}
.stat strong{font:500 31px var(--serif)}
.stat span{font-size:11px;color:var(--text)}
.signature{align-self:center;letter-spacing:.28em;color:var(--ink)}
@media(max-width:900px){.projects-head{grid-template-columns:1fr}.projects-intro{justify-items:start;padding-top:0}.project-grid{grid-template-columns:1fr}.stats{grid-template-columns:repeat(3,1fr)}}
@media(max-width:560px){.projects{padding-top:52px}.projects h2{font-size:44px}.card-info{padding:0 18px 18px}.stats{grid-template-columns:1fr}}
.projects-head{grid-template-columns:.8fr 1.2fr;align-items:start}
.projects h2{font-size:clamp(50px,5vw,82px)}
.projects-intro{grid-template-columns:auto auto;gap:18px 30px;align-items:start;justify-content:end;padding-top:18px}
.project-tabs{display:flex;gap:8px;justify-content:end;grid-column:1 / -1}
.project-tabs span{border:1px solid var(--line);padding:8px 12px;font-size:10px;letter-spacing:.16em;text-transform:uppercase}
.project-tabs span:first-child{background:var(--ink);color:white;border-color:var(--ink)}
.project-grid{grid-template-columns:repeat(5,1fr);gap:16px}
.project-group{grid-column:1 / -1;display:flex;align-items:center;gap:18px;margin:10px 0 2px;font-size:13px;font-weight:700;letter-spacing:.25em;text-transform:uppercase;color:var(--ink)}
.project-group:after{content:"";height:1px;background:var(--line);flex:1}
.card{min-height:340px;background:#f8f7f2;border:1px solid var(--line);display:flex;flex-direction:column}
.card:after{display:none}
.card-image{height:188px;min-height:188px;position:relative}
.card-image img{position:absolute;inset:0;height:100%;opacity:0;animation:projectFade 8s infinite}
.card-image img:nth-child(1){opacity:1}
.card-image img:nth-child(2){animation-delay:4s}
.card:hover img{transform:none}
@keyframes projectFade{0%,45%{opacity:1}50%,95%{opacity:0}100%{opacity:1}}
.card-info{position:static;color:var(--ink);padding:16px;display:block}
.card h3{color:var(--ink);font-size:24px;margin-bottom:10px}
.card p{color:var(--text);font-size:11px;line-height:1.45}
.card .arrow{position:absolute;right:14px;top:150px;z-index:3;width:30px;height:30px;border:1px solid rgba(255,255,255,.8);color:white;display:grid;place-items:center;background:rgba(12,38,32,.48)}
.project-meta{display:grid;gap:8px;margin-top:14px;padding-top:12px;border-top:1px solid var(--line);font-size:10px;color:var(--text)}
.project-meta span{display:grid;grid-template-columns:64px 1fr;gap:10px}
.project-meta b{font-weight:600;color:var(--ink)}
.stats{grid-template-columns:190px 190px 190px 1fr}
.process{padding:72px var(--g) 64px;background:#fbfaf6;border-top:1px solid var(--line);position:relative;overflow:hidden}
.process-head{display:grid;grid-template-columns:.85fr 1fr;gap:clamp(30px,7vw,120px);align-items:start;margin-bottom:52px}
.process h2{font:500 clamp(48px,4.8vw,78px)/.92 var(--serif);letter-spacing:-.025em;margin:14px 0 0}
.process-copy{font-size:15px;line-height:1.6;color:var(--text);max-width:430px}
.process-steps{display:grid;grid-template-columns:repeat(5,1fr);border-top:1px solid var(--ink);position:relative}
.process-step{padding:20px 26px 0 0;position:relative;min-height:115px}
.process-step:before{content:"";position:absolute;top:-5px;left:0;width:9px;height:9px;border-radius:50%;background:var(--ink)}
.process-step strong{display:block;font:500 27px var(--serif);margin-bottom:7px}
.process-step b{display:block;font:500 15px var(--sans);margin-bottom:16px}
.process-step span{display:block;font-size:11px;line-height:1.55;color:var(--text)}
.process-visual{margin-top:26px;display:grid;grid-template-columns:1.1fr .9fr;align-items:end}
.process-visual .drawing-panel{min-height:190px;background-image:linear-gradient(rgba(23,53,47,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(23,53,47,.08) 1px,transparent 1px);background-size:74px 74px;border-bottom:1px solid var(--line)}
.process-visual img{height:220px;object-fit:cover}
.process-foot{display:grid;grid-template-columns:260px 1fr;gap:42px;margin-top:18px;font-size:12px;line-height:1.65;color:var(--text)}
.process-foot .eyebrow{color:var(--ink)}
.process{background:linear-gradient(120deg,#fbfaf6,#f3f1eb)}
.process-visual{grid-template-columns:1fr 1fr;align-items:stretch;margin-top:34px;min-height:260px}
.process-visual .drawing-panel{min-height:260px;border-bottom:0;position:relative;background-color:rgba(255,255,255,.32);background-image:linear-gradient(rgba(23,53,47,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(23,53,47,.08) 1px,transparent 1px)}
.process-visual .drawing-panel:before{content:"";position:absolute;inset:22px 0 18px 0;background:var(--cms-home-process-sketch, url("Images/wireframe.jpg")) center/contain no-repeat;opacity:.68;filter:saturate(.15) contrast(1.05)}
.process-visual .drawing-panel:after{content:"→";position:absolute;right:-24px;top:50%;width:48px;height:48px;border-radius:50%;background:#fff;color:var(--ink);box-shadow:0 10px 28px rgba(17,40,34,.14);transform:translateY(-50%);z-index:2;display:grid;place-items:center;font-size:22px}
.process-visual img{height:260px;width:100%;object-fit:contain;background-color:rgba(255,255,255,.32);background-image:linear-gradient(rgba(23,53,47,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(23,53,47,.08) 1px,transparent 1px);background-size:74px 74px;padding:0;filter:saturate(.86) contrast(.95)}
.process-foot{grid-template-columns:260px minmax(280px,470px);align-items:start;border-top:1px solid var(--line);padding-top:22px}
.process-head{grid-template-columns:1fr minmax(280px,440px);align-items:start}
.process-copy{justify-self:end;padding-top:18px;font-weight:500;color:var(--ink)}
.process-foot{grid-template-columns:1fr minmax(280px,440px);gap:clamp(30px,8vw,120px)}
.process-foot p{justify-self:end;max-width:430px;margin:0;font-size:14px;color:var(--text)}
.consultants{padding:72px var(--g) 76px;background:#f8f7f2;border-top:1px solid var(--line)}
.consultants-head{display:grid;grid-template-columns:1fr minmax(280px,430px);gap:clamp(30px,8vw,120px);align-items:end;margin-bottom:34px}
.consultants h2{font:500 clamp(46px,4.8vw,76px)/.92 var(--serif);letter-spacing:-.025em;margin:14px 0 0;max-width:680px}
.consultants-brand{border-left:1px solid var(--ink);padding-left:22px;color:var(--text);font-size:13px;line-height:1.7}
.consultants-brand strong{display:block;color:var(--ink);font:500 22px var(--serif);letter-spacing:.18em;margin-bottom:6px}
.consultants-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.consultant-card{background:#fff;border:1px solid var(--line);min-height:176px;padding:18px;display:flex;flex-direction:column;justify-content:space-between;gap:22px}
.consultant-top{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}
.consultant-icon{width:48px;height:48px;border:1px solid var(--ink);border-radius:50%;display:grid;place-items:center;color:var(--ink);font:500 18px var(--serif);background:#f7f6ef}
.consultant-card span{display:block;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--muted)}
.consultant-card h3{font:500 24px/1.05 var(--serif);letter-spacing:-.012em;margin:8px 0 0;color:var(--ink)}
.consultant-card p{margin:8px 0 0;color:var(--text);font-size:12px;line-height:1.45}
.consultant-card.featured{grid-column:span 2;background:var(--ink);color:#f8f7f2}
.consultant-card.featured .consultant-icon{border-color:#f8f7f2;color:#f8f7f2;background:rgba(255,255,255,.08)}
.consultant-card.featured span,.consultant-card.featured p{color:rgba(248,247,242,.75)}
.consultant-card.featured h3{color:#f8f7f2;font-size:32px}
.journal{padding:72px var(--g) 70px;background:linear-gradient(120deg,#fbfaf6,#f3f1eb);border-top:1px solid var(--line)}
.journal-head{display:grid;grid-template-columns:1fr minmax(320px,520px);gap:44px;align-items:end;margin-bottom:36px}
.journal h2{font:500 clamp(54px,5vw,86px)/.88 var(--serif);letter-spacing:-.03em;margin:18px 0 0}
.journal-intro{display:grid;gap:34px;justify-items:end;font-size:18px;line-height:1.45;color:var(--text)}
.journal-intro a{font-size:13px;font-weight:600;color:var(--ink)}
.journal-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:30px}
.post{display:block;border-bottom:1px solid var(--line);padding-bottom:18px}
.post img{height:190px;object-fit:cover;filter:saturate(.82) contrast(.95);margin-bottom:16px}
.post-meta{display:flex;justify-content:space-between;gap:16px;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--text);margin-bottom:8px}
.post h3{font:500 29px/1.05 var(--serif);letter-spacing:-.015em;margin:0 0 14px;color:var(--ink)}
.post span{font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--muted)}
.footer{padding:56px var(--g) 26px;background:var(--ink);color:#f8f7f2}
.footer-main{display:grid;grid-template-columns:1.1fr .9fr .7fr;gap:44px;align-items:start}
.footer .brand{color:#f8f7f2}.footer .mark{border-color:#f8f7f2}
.footer-tag{font:500 clamp(32px,4vw,58px)/1 var(--serif);letter-spacing:-.015em;margin-top:42px;max-width:430px}
.footer-links{display:grid;grid-template-columns:repeat(2,1fr);gap:14px 40px;font-size:14px}
.footer-links a{padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,.18)}
.footer-contact{font-size:12px;line-height:1.9;color:rgba(248,247,242,.78)}
.footer-contact a{color:#f8f7f2;border-bottom:1px solid rgba(248,247,242,.4);padding-bottom:2px}
.footer-bottom{border-top:1px solid rgba(255,255,255,.18);margin-top:54px;padding-top:20px;display:flex;justify-content:space-between;gap:24px;font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:rgba(248,247,242,.68)}
.head-actions{display:flex;align-items:center;gap:28px;font-size:13px}.menu-dot{width:48px;height:48px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;font-size:22px}.inquire{display:inline-flex;gap:18px;align-items:center}
@media(min-width:1400px){.hero{grid-template-columns:39% 61%;min-height:720px}.hero-copy{padding-top:68px}.visual{min-height:720px}.card-image{height:210px;min-height:210px}.post img{height:220px}.process-visual,.process-visual .drawing-panel{min-height:300px}.process-visual img{height:300px}}
@media(max-width:1280px){.project-grid{grid-template-columns:repeat(3,1fr)}.project-group{margin-top:18px}.card{min-height:330px}.header{grid-template-columns:230px 1fr auto}.nav{gap:22px}.consultants-grid{grid-template-columns:repeat(3,1fr)}}
@media(max-width:1100px){.project-grid{grid-template-columns:repeat(2,1fr)}.process-steps{grid-template-columns:1fr}.process-step{border-bottom:1px solid var(--line);padding-bottom:18px}.process-step:before{top:-5px}.process-visual{grid-template-columns:1fr}.process-visual .drawing-panel:after{content:"↓";right:auto;left:50%;top:auto;bottom:-24px;transform:translateX(-50%)}.consultants-grid{grid-template-columns:repeat(2,1fr)}}
@media(max-width:900px){.projects-head,.process-head,.consultants-head,.journal-head,.footer-main{grid-template-columns:1fr}.projects-intro{justify-content:start}.project-tabs{justify-content:start}.stats{grid-template-columns:repeat(3,1fr)}.process-copy,.process-foot p,.journal-intro{justify-self:start}.process-foot{grid-template-columns:1fr}.journal-grid{grid-template-columns:1fr}.footer-links{grid-template-columns:1fr}.hero-copy{padding-right:var(--g)}.card-image{height:300px;min-height:300px}.post img{height:280px}}
@media(max-width:700px){.hero-copy{min-height:auto;padding-top:40px;padding-bottom:42px}.actions{flex-wrap:wrap}.actions a{justify-content:space-between;min-width:190px}.visual,.visual img{min-height:430px}.projects,.process,.consultants,.journal{padding-top:56px;padding-bottom:56px}.projects h2,.process h2,.consultants h2,.journal h2{font-size:clamp(42px,12vw,58px)}.stats{gap:0}.stat{margin-right:18px;padding-right:18px}.process-visual,.process-visual .drawing-panel{min-height:230px}.process-visual img{height:230px}.consultants-grid{grid-template-columns:1fr}.consultant-card.featured{grid-column:auto}.footer-tag{margin-top:30px}}
@media(max-width:560px){.project-grid{grid-template-columns:1fr}.card{min-height:0}.card-image{height:270px;min-height:270px}.stats{grid-template-columns:1fr}.process{padding-top:54px}.process-foot{grid-template-columns:1fr}.journal,.footer{padding-left:var(--g);padding-right:var(--g)}.post img{height:220px}.footer-bottom{display:grid}}
@media(max-width:430px){:root{--g:22px}.brand{gap:10px;font-size:16px}.mark{width:32px;height:32px;font-size:20px}.hero-copy{padding-top:34px}.lead{font-size:14px}.actions a{width:100%}.visual,.visual img{min-height:390px}.visual-meta{font-size:11px}.project-tabs{display:grid;grid-template-columns:repeat(3,1fr);width:100%}.project-tabs span{text-align:center;padding:8px 6px}.card-image{height:238px;min-height:238px}.project-meta span{grid-template-columns:54px 1fr}.process-step{padding-right:0}.journal-intro{font-size:15px;gap:20px}.footer{padding-top:44px}}
@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
`}</style>
        <link rel="stylesheet" href="/shared-system.css" />
      </Head>
      <div dangerouslySetInnerHTML={{ __html: `
<div class="shell">
<header class="header">
  <a class="brand" href="#"><span class="mark">N</span><span>NSQUARE<small>VENTURES</small></span></a>
  <nav class="nav" aria-label="Primary"><a class="active" href="/">Home</a><a href="/projects">Projects</a><a href="/expertise">Expertise</a><a href="/journal">Journal</a><a href="/contact">Contact</a></nav>
  <!-- <div class="head-actions"><button class="menu-btn" id="menuOpen" aria-label="Open menu">Menu &nbsp; ↗</button></div> -->
  <div class="head-actions"><a class="inquire" href="/contact">Inquire <span>→</span></a><button class="menu-dot site-menu-trigger" type="button" aria-label="Open navigation">≡</button></div>
</header>

<main>
<section class="hero">
 <div class="hero-copy">
	   <div class="eyebrow">Architecture · Interiors · Construction</div>
   <h1>Architecture,<br>thoughtfully<br>carried through.</h1>
   <p class="lead">Nsquare Ventures is an architecture-led design and delivery practice in Bengaluru, bringing architecture, interiors, approvals and construction into one coordinated process.</p>
	   <div class="actions"><a class="primary" href="/projects">Explore Projects <span class="arrow">→</span></a><a class="secondary" href="/contact">Inquire <span>→</span></a></div>
   <div class="hero-note">Architecture-led. Execution-aware.<br>From first sketch to site execution.</div>
 </div>
 <div class="visual">
	   <img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" data-cms-image="homeHeroImage" data-fallback-src="Images/Praveen Villa - Indiranagar.png" alt="Ravine Villa residential architecture">
   <div class="drawing"><svg viewBox="0 0 900 650" preserveAspectRatio="none"><path d="M0 510 L210 325 L365 405 L555 180 L900 260 M45 585 L45 90 M240 620 L240 40 M470 620 L470 80 M680 620 L680 20 M0 500 H900 M0 390 H900 M0 280 H900 M0 170 H900"/></svg></div>
   <div class="visual-meta">Spaces<br>people<br>belong in</div>
   <div class="location">Bengaluru · Karnataka</div>
   <div class="pager"><span>←</span><strong>01</strong><span>/ 03</span><span>→</span></div>
 </div>
</section>

<section class="projects" id="projects">
	 <div class="projects-head">
	  <div><div class="eyebrow">Projects</div><h2>Designed from<br>concept to completion.</h2></div>
		  <div class="projects-intro"><a href="/projects">View All Projects &nbsp; →</a><div class="project-tabs">
			<!-- <span>All</span> -->
			<!-- <span>Ongoing</span><span>Completed</span> -->
		</div></div>
	 </div>
	 <div class="project-grid" data-cms-projects></div>
	 <!-- <div class="stats"><div class="stat"><strong>01</strong><span>Architecture-led</span></div><div class="stat"><strong>02</strong><span>Execution-aware</span></div><div class="stat"><strong>03</strong><span>Coordinated delivery</span></div><div class="signature">ARCHITECTURE · INTERIORS · CONSTRUCTION</div></div> -->
	</section>
	<section class="process" id="process">
	 <div class="process-head">
	  <div><div class="eyebrow">Process</div><h2>Concept to<br>completion.</h2></div>
	  <p class="process-copy">A transparent, collaborative and execution-aware process from first conversation to final handover.</p>
	 </div>
	 <div class="process-steps">
	  <div class="process-step"><strong>01</strong><b>Understand</b><span>Site, brief, requirements, feasibility and budget clarity.</span></div>
	  <div class="process-step"><strong>02</strong><b>Design</b><span>Planning, architecture, interiors, elevations and materials.</span></div>
	  <div class="process-step"><strong>03</strong><b>Coordinate</b><span>Approvals, structural inputs, MEP and consultants.</span></div>
	  <div class="process-step"><strong>04</strong><b>Execute</b><span>Construction, detailing, procurement and site decisions.</span></div>
	  <div class="process-step"><strong>05</strong><b>Deliver</b><span>Finishing, interiors, handover and post-completion support.</span></div>
	 </div>
	 <div class="process-visual"><div class="drawing-panel"></div><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" data-cms-image="homeProcessImage" data-fallback-src="Images/Elevation/Dr.Sudha-7.png" alt="Nsquare process project"></div>
	 <div class="process-foot"><div class="eyebrow">From drawing<br>to reality</div><p>Ideas take shape through collaboration, technical precision and shared commitment. The same team carries the project from concept, approvals and detailing into execution.</p></div>
	</section>
	<section class="consultants" id="consultants">
	 <div class="consultants-head">
	  <div><div class="eyebrow">Consultants</div><h2>The people shaping each decision.</h2></div>
	  <div class="consultants-brand"><strong>N SQUARE VENTURES</strong><span>Architecture | Interiors | Construction</span></div>
	 </div>
	 <div class="consultants-grid">
	  <article class="consultant-card featured"><div class="consultant-top"><span>Founder</span><div class="consultant-icon">FN</div></div><div><h3>Mohammed Nadeem Uzamah</h3><p>Leading design direction, client coordination and delivery vision.</p></div></article>
	  <article class="consultant-card"><div class="consultant-top"><span>Project Architect</span><div class="consultant-icon">AR</div></div><div><h3>Mohammed Nabeel</h3><p>Architecture planning, drawings and design coordination.</p></div></article>
	  <article class="consultant-card"><div class="consultant-top"><span>Structural Engineers</span><div class="consultant-icon">SE</div></div><div><h3>Pralabhi Associates</h3><p>Structural design inputs and technical coordination.</p></div></article>
	  <article class="consultant-card"><div class="consultant-top"><span>Pool Consultant</span><div class="consultant-icon">PL</div></div><div><h3>Millennium Pools</h3><p>Swimming pool systems, specifications and execution guidance.</p></div></article>
	  <article class="consultant-card"><div class="consultant-top"><span>Chartered Accountants</span><div class="consultant-icon">CA</div></div><div><h3>Puttaswamy &amp; Company</h3><p>Accounting, taxation and financial compliance support.</p></div></article>
	  <article class="consultant-card"><div class="consultant-top"><span>Finance &amp; Banking</span><div class="consultant-icon">FB</div></div><div><h3>Urban Money Corporate DSA</h3><p>Construction finance and banking consultation.</p></div></article>
	  <article class="consultant-card"><div class="consultant-top"><span>Legal Advisor</span><div class="consultant-icon">LA</div></div><div><h3>Mir Zia Ulla</h3><p>Advocate &amp; Notary of India.</p></div></article>
	  <article class="consultant-card"><div class="consultant-top"><span>Mentor &amp; Strategic Advisor</span><div class="consultant-icon">MS</div></div><div><h3>Mr. N.M. Panali</h3><p>IAS (Retd.)</p></div></article>
	 </div>
	</section>
	<!-- <section class="journal" id="journal">
	 <div class="journal-head">
	  <div><div class="eyebrow">Journal</div><h2>Notes from<br>practice.</h2></div>
	  <div class="journal-intro"><a href="#">View All Articles &nbsp; →</a><p>Thoughts on architecture, construction, materials and the realities of building in Bengaluru.</p></div>
	 </div>
	 <div class="journal-grid">
	  <a class="post" href="#"><img src="Images/Praveen Villa - Indiranagar.png" alt="Planning before elevation"><div class="post-meta"><b>12 Jan 2026</b><span>↗</span></div><h3>Planning Before Elevation</h3><span>Architecture</span></a>
	  <a class="post" href="#"><img src="Images/wireframe.jpg" alt="The drawing to site gap"><div class="post-meta"><b>06 Jan 2026</b><span>↗</span></div><h3>The Drawing-to-Site Gap</h3><span>Construction</span></a>
	  <a class="post" href="#"><img src="Images/Sayeed Apartment - Yaseen Nagar.png" alt="Reading a Bengaluru site"><div class="post-meta"><b>02 Jan 2026</b><span>↗</span></div><h3>Reading a Bengaluru Site</h3><span>Site Notes</span></a>
	 </div>
	</section> -->
	<footer class="footer site-footer" id="footer">
	 <div class="footer-main site-footer-grid">
	  <div class="site-footer-brand"><a class="brand" href="/"><span class="mark">N</span><span>NSQUARE<small>VENTURES</small></span></a><p>Architecture-led design and delivery<br>in Bengaluru.</p></div>
	  <nav class="footer-links site-footer-col" aria-label="Footer explore"><h2>Explore</h2><a href="/projects">Projects</a><a href="/expertise">Expertise</a><a href="/journal">Journal</a><a href="/contact">Contact</a></nav>
	  <div class="site-footer-col"><h2>Practice</h2><a href="/expertise">Architecture</a><a href="/expertise">Interiors</a><a href="/expertise">Construction</a><a href="/expertise#elevation">Approvals &amp; Coordination</a><a href="/expertise#elevation">Elevation Consultation</a></div>
	  <div class="footer-contact site-footer-location"><h2>Based In</h2><strong>Bengaluru<br>Karnataka<br>India</strong><a href="/contact">Start a conversation <span>→</span></a></div>
	 </div>
	</footer>
</main>
</div>

<div class="scrim site-scrim" id="scrim"></div>
<aside class="side site-side" id="side" aria-hidden="true">
 <div class="side-top site-side-top"><a class="brand" href="/"><span class="mark">N</span><span>NSQUARE<small>VENTURES</small></span></a><button class="close site-close" id="menuClose" type="button">Close &nbsp; ×</button></div>
 <div class="side-label site-side-label">Menu</div>
 <nav class="side-nav site-side-nav"><a href="/">Home <span>01</span></a><a href="/projects">Projects <span>02</span></a><a href="/expertise">Expertise <span>03</span></a><a href="/journal">Journal <span>04</span></a><a href="/contact">Contact <span>05</span></a></nav>
 <div class="side-art"><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" data-cms-image="navigationMenuImage" data-fallback-src="Images/wireframe.jpg" alt=""><div class="side-words">Spaces<br>for a<br>better<br>tomorrow</div></div>
 <div class="side-foot site-side-foot"><div>Instagram<br>LinkedIn<br>YouTube</div><div class="cross site-cross" aria-hidden="true"></div></div>
</aside>


` }} />
      <Script src="/shared-system.js" strategy="afterInteractive" />
      <Script id="inline-index-1" strategy="afterInteractive">{`
const side=document.getElementById('side'),scrim=document.getElementById('scrim');
function toggle(open){side.classList.toggle('open',open);scrim.classList.toggle('open',open);side.setAttribute('aria-hidden',String(!open));document.body.style.overflow=open?'hidden':''}
const menuOpen=document.getElementById('menuOpen'); if(menuOpen) menuOpen.addEventListener('click',()=>toggle(true));
const menuClose=document.getElementById('menuClose'); if(menuClose) menuClose.addEventListener('click',()=>toggle(false));
scrim.addEventListener('click',()=>toggle(false));
document.addEventListener('keydown',e=>{if(e.key==='Escape')toggle(false)});
side.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>toggle(false)));
`}</Script>
    </>
  );
}
