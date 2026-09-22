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
      projects: Array.isArray(content.projects) && content.projects.length ? content.projects : NSQUARE_FALLBACK_CONTENT.projects,
      articles: Array.isArray(content.articles) && content.articles.length ? content.articles : NSQUARE_FALLBACK_CONTENT.articles,
      site: content.site || {}
    };
  }catch(error){
    return NSQUARE_FALLBACK_CONTENT;
  }
})();

function nsEscape(value){
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function nsBindProjectFilters(){
  const buttons = [...document.querySelectorAll('.filters button[data-filter]')];
  const projects = [...document.querySelectorAll('.project[data-status][data-type]')];
  if(!buttons.length || !projects.length) return;

  function matches(project, filter){
    if(filter === 'all') return true;
    const status = project.dataset.status || '';
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

  NSQUARE_CONTENT_READY.then(({ projects }) => {
    if(!projects.length) return;
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('project') || projects[0].slug;
    const project = projects.find(item => item.slug === slug);

    if(!project){
      mount.innerHTML = '<section class="detail-empty"><div class="eyebrow">Project</div><h1>Project not found.</h1><p><a href="projects.html">Return to projects →</a></p></section>';
      return;
    }

    document.title = `${project.name} — Nsquare Ventures`;
    const scope = (project.scope || []).map(item => `<span>${nsEscape(item)}</span>`).join('');
    mount.innerHTML = `
      <section class="detail-hero">
        <div class="detail-copy">
          <div class="eyebrow">${nsEscape(project.status)} project</div>
          <h1>${nsEscape(project.name)}</h1>
          <p>${nsEscape(project.summary)}</p>
          <div class="detail-actions">
            <a href="contact.html?project=${encodeURIComponent(project.name)}">Discuss this project <span>→</span></a>
            <a href="projects.html">Back to projects <span>→</span></a>
          </div>
        </div>
        <div class="detail-image"><img src="${nsEscape(project.image)}" alt="${nsEscape(project.name)}"></div>
      </section>
      <section class="detail-meta">
        <div><b>Status</b><span>${nsEscape(project.status)}</span></div>
        <div><b>Location</b><span>${nsEscape(project.location)}</span></div>
        <div><b>Area</b><span>${nsEscape(project.area)}</span></div>
        <div><b>Client</b><span>${nsEscape(project.client)}</span></div>
      </section>
      <section class="detail-body">
        <div><div class="eyebrow">Project Details</div><h2>Designed with context and delivery in mind.</h2></div>
        <div><p>${nsEscape(project.details)}</p><div class="scope-grid">${scope}</div></div>
      </section>
      <section class="detail-gallery">
        <img src="${nsEscape(project.image)}" alt="${nsEscape(project.name)} main view">
        <img src="${nsEscape(project.secondaryImage || project.image)}" alt="${nsEscape(project.name)} supporting view">
      </section>
    `;
  });
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

  NSQUARE_CONTENT_READY.then(({ articles }) => {
    if(!articles.length) return;
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('article') || articles[0].slug;
    const article = articles.find(item => item.slug === slug);

    if(!article){
      mount.innerHTML = '<section class="article-empty"><div class="eyebrow">Journal</div><h1>Article not found.</h1><p><a href="journal.html">Return to journal →</a></p></section>';
      return;
    }

    document.title = `${article.title} — Nsquare Journal`;
    const body = Array.isArray(article.body) ? article.body : String(article.body || '').split('\n').filter(Boolean);
    const takeaways = (article.takeaways || []).map(item => `<li>${nsEscape(item)}</li>`).join('');
    const secondaryImage = article.secondaryImage
      ? `<figure class="article-wide-image"><img src="${nsEscape(article.secondaryImage)}" alt="${nsEscape(article.title)} supporting view"></figure>`
      : '';
    mount.innerHTML = `
      <section class="article-hero">
        <div class="article-copy">
          <div class="eyebrow">${nsEscape(article.category)}</div>
          <h1>${nsEscape(article.title)}</h1>
          <p>${nsEscape(article.summary)}</p>
        </div>
        <div class="article-image"><img src="${nsEscape(article.image)}" alt="${nsEscape(article.alt || article.title)}"></div>
      </section>
      <section class="article-body">
        <aside>
          <div class="eyebrow">Nsquare Journal</div>
          <a href="journal.html">Back to Journal <span>→</span></a>
        </aside>
        <article>
          ${body.slice(0, 3).map(paragraph => `<p>${nsEscape(paragraph)}</p>`).join('')}
          ${takeaways ? `<h2>Key considerations</h2><ul>${takeaways}</ul>` : ''}
          ${secondaryImage}
          <h2>Practice notes</h2>
          ${body.slice(3).map(paragraph => `<p>${nsEscape(paragraph)}</p>`).join('')}
        </article>
      </section>
    `;
  });
})();

(function(){
  NSQUARE_CONTENT_READY.then(({ projects, articles, site }) => {
    const imageMap = [
      ['homeHeroImage', '.visual > img'],
      ['projectsHeroImage', '.heroimg > img'],
      ['journalHeroImage', '.jimage > img'],
      ['contactHeroImage', '.photo > img'],
      ['processImage', '.process-visual > img']
    ];
    imageMap.forEach(([key, selector]) => {
      if(site[key]){
        document.querySelectorAll(selector).forEach(img => { img.src = site[key]; });
      }
    });

    const projectGrid = document.querySelector('.archive .grid');
    if(projectGrid && projects.length){
      projectGrid.innerHTML = projects.map((project, index) => `
        <a class="project" href="project-detail.html?project=${encodeURIComponent(project.slug)}" data-status="${nsEscape(project.status)}" data-type="${nsEscape(project.type)}">
          <div class="media"><img src="${nsEscape(project.image)}" alt="${nsEscape(project.name)}"><span class="num">${String(index + 1).padStart(2, '0')}</span></div>
          <div class="info"><div><h3>${nsEscape(project.name)}</h3><div class="meta">${nsEscape(project.location)}</div><div class="area">${nsEscape(project.area)} · ${nsEscape(project.status)}</div></div><span class="arrow">→</span></div>
        </a>
      `).join('');
      nsBindProjectFilters();
    }

    const homeGrid = document.querySelector('.project-grid');
    if(homeGrid && projects.length){
      const ongoing = projects.filter(project => project.status === 'ongoing');
      const completed = projects.filter(project => project.status === 'completed');
      const card = project => `
        <a class="card" href="project-detail.html?project=${encodeURIComponent(project.slug)}">
          <div class="card-image"><img src="${nsEscape(project.image)}" alt="${nsEscape(project.name)}"><img src="${nsEscape(project.secondaryImage || project.image)}" alt="${nsEscape(project.name)} supporting image"></div>
          <div class="card-info"><h3>${nsEscape(project.name)}</h3><p>${nsEscape(project.summary)}</p><div class="project-meta"><span><b>Client</b>${nsEscape(project.client)}</span><span><b>Location</b>${nsEscape(project.location)}</span><span><b>Area</b>${nsEscape(project.area)}</span></div><span class="arrow">→</span></div>
        </a>
      `;
      homeGrid.innerHTML = `<div class="project-group">Ongoing Projects</div>${ongoing.map(card).join('')}<div class="project-group">Completed Projects</div>${completed.map(card).join('')}`;
    }

    const journalPosts = document.querySelector('#journal-posts .posts');
    if(journalPosts && articles.length){
      journalPosts.innerHTML = articles.map(article => `
        <a class="post" href="journal-detail.html?article=${encodeURIComponent(article.slug)}" data-categories="${nsEscape(article.categories || article.category || '')}">
          <img src="${nsEscape(article.image)}" alt="${nsEscape(article.alt || article.title)}">
          <div class="post-meta">${nsEscape(article.category)}</div>
          <h3>${nsEscape(article.title)}</h3>
          <p>${nsEscape(article.summary)}</p>
        </a>
      `).join('');
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
  });
})();
