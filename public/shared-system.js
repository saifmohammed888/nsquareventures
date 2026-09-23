(function(){
  const triggerSelectors = ['.site-menu-trigger', '#menuOpen', '.menu-dot', '.dot'];
  const triggers = [...document.querySelectorAll(triggerSelectors.join(','))];
  const side = document.getElementById('siteSide') || document.getElementById('side');
  const scrim = document.getElementById('siteScrim') || document.getElementById('scrim');
  if(!side || !scrim || !triggers.length) return;

  function setMenu(open){
    side.classList.toggle('open', open);
    scrim.classList.toggle('open', open);
    side.setAttribute('aria-hidden', String(!open));
    triggers.forEach(trigger => trigger.setAttribute('aria-expanded', String(open)));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  triggers.forEach(trigger => {
    trigger.setAttribute('role', trigger.tagName === 'BUTTON' ? 'button' : 'button');
    trigger.setAttribute('aria-label', 'Open navigation');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', event => {
      event.preventDefault();
      setMenu(true);
    });
  });

  document.querySelectorAll('#siteMenuClose,#menuClose,.site-close').forEach(close => {
    close.addEventListener('click', () => setMenu(false));
  });
  scrim.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', event => {
    if(event.key === 'Escape') setMenu(false);
  });
  side.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
})();

const NSQUARE_FALLBACK_CONTENT = {
  projects: window.NSQUARE_PROJECTS || [],
  articles: window.NSQUARE_ARTICLES || [],
  site: {}
};

const NSQUARE_CONTENT_READY = (async function(){
  try{
    const response = await fetch('/api/content', { cache: 'no-store' });
    if(!response.ok) throw new Error('Content API unavailable');
    const content = await response.json();
    return {
      projects: Array.isArray(content.projects) ? content.projects : NSQUARE_FALLBACK_CONTENT.projects,
      articles: Array.isArray(content.articles) ? content.articles : NSQUARE_FALLBACK_CONTENT.articles,
      site: content.site || {}
    };
  }catch(error){
    return NSQUARE_FALLBACK_CONTENT;
  }
})();

const NSQUARE_PRELOADED_IMAGES = new Set();
let NSQUARE_PENDING_RENDERS = 0;

function nsFinishPageLoading(){
  document.documentElement.classList.add('ns-page-ready');
}

function nsTrackRender(promise){
  NSQUARE_PENDING_RENDERS += 1;
  Promise.resolve(promise).catch(() => {}).finally(() => {
    NSQUARE_PENDING_RENDERS -= 1;
    if(NSQUARE_PENDING_RENDERS <= 0) nsFinishPageLoading();
  });
}

function nsPreloadImage(src, priority){
  if(!src || NSQUARE_PRELOADED_IMAGES.has(src)) return;
  NSQUARE_PRELOADED_IMAGES.add(src);
  if(priority){
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  }
  const image = new Image();
  image.decoding = 'async';
  image.src = src;
}

function nsPreloadContentImages(content){
  const images = [];
  Object.values(content.site || {}).forEach(value => images.push(value));
  (content.projects || []).forEach(project => images.push(project.image, project.secondaryImage));
  (content.articles || []).forEach(article => images.push(article.image, article.secondaryImage));
  images.filter(Boolean).slice(0, 80).forEach((src, index) => nsPreloadImage(src, index < 10));
}

function nsLoadImage(src){
  if(!src) return Promise.resolve();
  return new Promise(resolve => {
    const image = new Image();
    image.decoding = 'async';
    image.onload = resolve;
    image.onerror = resolve;
    image.src = src;
    if(image.decode){
      image.decode().then(resolve).catch(resolve);
    }
  });
}

function nsWaitForImages(sources){
  return Promise.all([...new Set((sources || []).filter(Boolean))].map(nsLoadImage));
}

function nsProjectStatus(project){
  return String(project?.status || '').toLowerCase() === 'completed' ? 'completed' : 'ongoing';
}

function nsEscape(value){
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function nsImage(src, alt, className){
  const classes = ['cms-lazy-image', className].filter(Boolean).join(' ');
  return `<img class="${classes}" src="${nsEscape(src)}" alt="${nsEscape(alt)}" loading="lazy" decoding="async" onload="this.classList.add('is-loaded')" onerror="this.classList.add('is-loaded','is-broken')">`;
}

function nsPrepareImage(img){
  if(!img || img.dataset.nsImageReady) return;
  img.dataset.nsImageReady = 'true';
  img.classList.add('cms-lazy-image');
  const priority = Boolean(img.closest('.hero,.expert-hero,.jhero,.detail-hero,.article-hero,.visual,.heroimg,.jimage,.photo'));
  if(!img.hasAttribute('loading')) img.setAttribute('loading', priority ? 'eager' : 'lazy');
  if(priority && !img.hasAttribute('fetchpriority')) img.setAttribute('fetchpriority', 'high');
  if(!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
  if(img.parentElement && !img.parentElement.classList.contains('cms-image-shell')){
    img.parentElement.classList.add('cms-image-shell');
  }
  const finish = broken => {
    img.classList.add('is-loaded');
    if(broken) img.classList.add('is-broken');
  };
  if(img.complete && img.naturalWidth > 0) finish(false);
  img.addEventListener('load', () => finish(false), { once: true });
  img.addEventListener('error', () => finish(true), { once: true });
}

function nsInitImageLoading(root){
  (root || document).querySelectorAll('img').forEach(nsPrepareImage);
}

function nsBindProjectFilters(){
  const buttons = [...document.querySelectorAll('.filters button[data-filter]')];
  const projects = [...document.querySelectorAll('.project[data-status][data-type]')];
  if(!buttons.length || !projects.length) return;

  function matches(project, filter){
    if(filter === 'all') return true;
    const status = project.dataset.status || 'ongoing';
    const type = project.dataset.type || '';
    return status === filter || type.split(/\s+/).includes(filter);
  }

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      buttons.forEach(item => item.classList.toggle('on', item === button));
      projects.forEach(project => {
        project.hidden = !matches(project, filter);
      });
    });
  });
}

nsBindProjectFilters();

(function(){
  const mount = document.getElementById('projectDetail');
  if(!mount) return;

  nsTrackRender(NSQUARE_CONTENT_READY.then(async ({ projects }) => {
    if(!projects.length) return;
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('project') || projects[0].slug;
    const project = projects.find(item => item.slug === slug);

    if(!project){
      mount.innerHTML = '<section class="detail-empty"><div class="eyebrow">Project</div><h1>Project not found.</h1><p><a href="projects.html">Return to projects →</a></p></section>';
      return;
    }

    document.title = `${project.name} — Nsquare Ventures`;
    await nsWaitForImages([project.image, project.secondaryImage || project.image]);
    const scope = (project.scope || []).map(item => `<span>${nsEscape(item)}</span>`).join('');
    mount.innerHTML = `
      <section class="detail-hero">
        <div class="detail-copy">
          <div class="eyebrow">${nsEscape(nsProjectStatus(project))} project</div>
          <h1>${nsEscape(project.name)}</h1>
          <p>${nsEscape(project.summary)}</p>
          <div class="detail-actions">
            <a href="contact.html?project=${encodeURIComponent(project.name)}">Discuss this project <span>→</span></a>
            <a href="projects.html">Back to projects <span>→</span></a>
          </div>
        </div>
        <div class="detail-image cms-image-shell">${nsImage(project.image, project.name)}</div>
      </section>
      <section class="detail-meta">
        <div><b>Status</b><span>${nsEscape(nsProjectStatus(project))}</span></div>
        <div><b>Location</b><span>${nsEscape(project.location)}</span></div>
        <div><b>Area</b><span>${nsEscape(project.area)}</span></div>
        <div><b>Client</b><span>${nsEscape(project.client)}</span></div>
      </section>
      <section class="detail-body">
        <div><div class="eyebrow">Project Details</div><h2>Designed with context and delivery in mind.</h2></div>
        <div><p>${nsEscape(project.details)}</p><div class="scope-grid">${scope}</div></div>
      </section>
      <section class="detail-gallery">
        <span class="cms-image-shell">${nsImage(project.image, `${project.name} main view`)}</span>
        <span class="cms-image-shell">${nsImage(project.secondaryImage || project.image, `${project.name} supporting view`)}</span>
      </section>
    `;
    nsInitImageLoading(mount);
  }));
})();

(function(){
  const form = document.querySelector('form[data-contact-form]');
  if(!form) return;

  const architectWhatsAppNumber = form.dataset.whatsappNumber || '';
  const projectFromUrl = new URLSearchParams(window.location.search).get('project');
  if(projectFromUrl && form.elements.message){
    form.elements.message.value = `I would like to discuss ${projectFromUrl}. `;
  }

  form.addEventListener('submit', event => {
    event.preventDefault();
    const data = new FormData(form);
    const message = [
      'New Nsquare Ventures project enquiry',
      '',
      `Name: ${data.get('name') || ''}`,
      `Email: ${data.get('email') || ''}`,
      `Phone: ${data.get('phone') || ''}`,
      `Project type: ${data.get('type') || ''}`,
      '',
      `Message: ${data.get('message') || ''}`
    ].join('\n');

    const encodedMessage = encodeURIComponent(message);
    const whatsAppUrl = architectWhatsAppNumber
      ? `https://wa.me/${architectWhatsAppNumber}?text=${encodedMessage}`
      : `https://api.whatsapp.com/send?text=${encodedMessage}`;
    window.location.href = whatsAppUrl;
  });
})();

(function(){
  const mount = document.getElementById('journalDetail');
  if(!mount) return;

  nsTrackRender(NSQUARE_CONTENT_READY.then(async ({ articles }) => {
    if(!articles.length) return;
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('article') || articles[0].slug;
    const article = articles.find(item => item.slug === slug);

    if(!article){
      mount.innerHTML = '<section class="article-empty"><div class="eyebrow">Journal</div><h1>Article not found.</h1><p><a href="journal.html">Return to journal →</a></p></section>';
      return;
    }

    document.title = `${article.title} — Nsquare Journal`;
    await nsWaitForImages([article.image, article.secondaryImage]);
    const body = Array.isArray(article.body) ? article.body : String(article.body || '').split('\n').filter(Boolean);
    const takeaways = (article.takeaways || []).map((item, index) => `<li><span>${String(index + 1).padStart(2, '0')}</span><p>${nsEscape(item)}</p></li>`).join('');
    const secondaryImage = article.secondaryImage
      ? `<figure class="article-wide-image cms-image-shell">${nsImage(article.secondaryImage, `${article.title} supporting view`)}<figcaption>${nsEscape(article.title)} · Supporting reference</figcaption></figure>`
      : '';
    mount.innerHTML = `
      <section class="article-hero">
        <div class="article-copy">
          <div class="article-overline"><span>Nsquare Journal</span><span>${nsEscape(article.category)}</span></div>
          <h1>${nsEscape(article.title)}</h1>
          <p>${nsEscape(article.summary)}</p>
          <div class="article-actions"><a href="journal.html">Back to Journal <span>→</span></a><a href="/contact">Discuss a Project <span>→</span></a></div>
        </div>
        <div class="article-image cms-image-shell">${nsImage(article.image, article.alt || article.title)}</div>
      </section>
      <section class="article-body">
        <aside>
          <div class="article-side-card">
            <div class="eyebrow">Article</div>
            <strong>${nsEscape(article.category || 'Journal')}</strong>
            <span>Nsquare Ventures</span>
          </div>
          <a href="journal.html">All articles <span>→</span></a>
        </aside>
        <article>
          <p class="article-summary">${nsEscape(article.summary)}</p>
          ${body.slice(0, 2).map(paragraph => `<p>${nsEscape(paragraph)}</p>`).join('')}
          ${takeaways ? `<section class="article-takeaways"><div class="eyebrow">Key considerations</div><ul>${takeaways}</ul></section>` : ''}
          ${body.slice(2, 3).map(paragraph => `<p>${nsEscape(paragraph)}</p>`).join('')}
          ${secondaryImage}
          ${body.slice(3).map(paragraph => `<p>${nsEscape(paragraph)}</p>`).join('')}
        </article>
      </section>
    `;
    nsInitImageLoading(mount);
  }));
})();

(function(){
  nsTrackRender(NSQUARE_CONTENT_READY.then(async ({ projects, articles, site }) => {
    nsPreloadContentImages({ projects, articles, site });
    const siteAliases = {
      homeProcessImage: ['processImage']
    };
    function siteImageValue(key){
      return site[key] || (siteAliases[key] || []).map(alias => site[alias]).find(Boolean);
    }

    const cmsImageAssignments = [...document.querySelectorAll('img[data-cms-image]')].map(img => ({
      img,
      src: siteImageValue(img.dataset.cmsImage) || img.dataset.fallbackSrc
    }));
    await nsWaitForImages(cmsImageAssignments.map(item => item.src));
    cmsImageAssignments.forEach(({ img, src }) => {
      if(src && img.src !== src) img.src = src;
      nsPrepareImage(img);
    });

    const cssImageMap = [
      ['homeProcessSketchImage', '--cms-home-process-sketch'],
      ['projectsArtImage', '--cms-projects-art-image'],
      ['expertiseQuoteBackgroundImage', '--cms-expertise-quote-background'],
      ['expertiseQuoteAccentImage', '--cms-expertise-quote-accent'],
      ['elevationQuoteBackgroundImage', '--cms-elevation-quote-background']
    ];
    cssImageMap.forEach(([key, variable]) => {
      const image = siteImageValue(key);
      if(image){
        document.documentElement.style.setProperty(variable, `url("${String(image).replace(/"/g, '\\"')}")`);
      }
    });

    const projectGrid = document.querySelector('.archive .grid');
    if(projectGrid){
      await nsWaitForImages(projects.map(project => project.image));
      projectGrid.innerHTML = projects.map((project, index) => `
        <a class="project" href="project-detail.html?project=${encodeURIComponent(project.slug)}" data-status="${nsEscape(nsProjectStatus(project))}" data-type="${nsEscape(project.type)}">
          <div class="media cms-image-shell">${nsImage(project.image, project.name)}<span class="num">${String(index + 1).padStart(2, '0')}</span></div>
          <div class="info"><div><h3>${nsEscape(project.name)}</h3><div class="meta">${nsEscape(project.location)}</div><div class="area">${nsEscape(project.area)} · ${nsEscape(nsProjectStatus(project))}</div></div><span class="arrow">→</span></div>
        </a>
      `).join('');
      nsInitImageLoading(projectGrid);
      nsBindProjectFilters();
    }

    const homeGrid = document.querySelector('.project-grid');
    if(homeGrid){
      const ongoing = projects.filter(project => nsProjectStatus(project) === 'ongoing').slice(0, 5);
      const completed = projects.filter(project => nsProjectStatus(project) === 'completed').slice(0, 5);
      await nsWaitForImages([...ongoing, ...completed].flatMap(project => [project.image, project.secondaryImage || project.image]));
      const card = project => `
        <a class="card" href="project-detail.html?project=${encodeURIComponent(project.slug)}">
          <div class="card-image cms-image-shell">${nsImage(project.image, project.name)}${nsImage(project.secondaryImage || project.image, `${project.name} supporting image`)}</div>
          <div class="card-info"><h3>${nsEscape(project.name)}</h3><p>${nsEscape(project.summary)}</p><div class="project-meta"><span><b>Client</b>${nsEscape(project.client)}</span><span><b>Location</b>${nsEscape(project.location)}</span><span><b>Area</b>${nsEscape(project.area)}</span></div><span class="arrow">→</span></div>
        </a>
      `;
      homeGrid.innerHTML = `<div class="project-group">Ongoing Projects</div>${ongoing.map(card).join('')}<div class="project-group">Completed Projects</div>${completed.map(card).join('')}`;
      nsInitImageLoading(homeGrid);
    }

    const journalPosts = document.querySelector('#journal-posts .posts');
    if(journalPosts){
      await nsWaitForImages(articles.map(article => article.image));
      journalPosts.innerHTML = articles.map(article => `
        <a class="post" href="journal-detail.html?article=${encodeURIComponent(article.slug)}" data-categories="${nsEscape(article.categories || article.category || '')}">
          <span class="post-image cms-image-shell">${nsImage(article.image, article.alt || article.title)}</span>
          <div class="post-meta">${nsEscape(article.category)}</div>
          <h3>${nsEscape(article.title)}</h3>
          <p>${nsEscape(article.summary)}</p>
        </a>
      `).join('');
      nsInitImageLoading(journalPosts);
      const categoryButtons = [...document.querySelectorAll('.categories button')];
      categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
          const category = button.dataset.category;
          categoryButtons.forEach(item => item.classList.toggle('active', item === button));
          document.querySelectorAll('#journal-posts .post').forEach(post => {
            const categories = (post.dataset.categories || '').toLowerCase();
            post.hidden = category !== 'all' && !categories.includes(category);
          });
        });
      });
    }
    const galleryGrid = document.querySelector('[data-cms-gallery]');
    if(galleryGrid){
      const galleryItems = projects.flatMap(project => [
        { project, image: project.image, label: 'Main image' },
        { project, image: project.secondaryImage, label: 'Supporting image' }
      ]).filter(item => item.image);
      await nsWaitForImages(galleryItems.map(item => item.image));
      galleryGrid.innerHTML = galleryItems.map(item => `
        <a class="gallery-item" href="/project-detail?project=${encodeURIComponent(item.project.slug)}">
          <span class="cms-image-shell">${nsImage(item.image, item.project.name)}</span>
          <h2>${nsEscape(item.project.name)}</h2>
          <p>${nsEscape(item.label)}</p>
        </a>
      `).join('');
      nsInitImageLoading(galleryGrid);
    }
    nsInitImageLoading(document);
  }));
})();
