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

(function(){
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
})();

(function(){
  const mount = document.getElementById('projectDetail');
  const projects = window.NSQUARE_PROJECTS || [];
  if(!mount || !projects.length) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('project') || projects[0].slug;
  const project = projects.find(item => item.slug === slug);

  if(!project){
    mount.innerHTML = '<section class="detail-empty"><div class="eyebrow">Project</div><h1>Project not found.</h1><p><a href="projects.html">Return to projects →</a></p></section>';
    return;
  }

  document.title = `${project.name} — Nsquare Ventures`;
  const scope = project.scope.map(item => `<span>${item}</span>`).join('');
  mount.innerHTML = `
    <section class="detail-hero">
      <div class="detail-copy">
        <div class="eyebrow">${project.status} project</div>
        <h1>${project.name}</h1>
        <p>${project.summary}</p>
        <div class="detail-actions">
          <a href="contact.html?project=${encodeURIComponent(project.name)}">Discuss this project <span>→</span></a>
          <a href="projects.html">Back to projects <span>→</span></a>
        </div>
      </div>
      <div class="detail-image"><img src="${project.image}" alt="${project.name}"></div>
    </section>
    <section class="detail-meta">
      <div><b>Status</b><span>${project.status}</span></div>
      <div><b>Location</b><span>${project.location}</span></div>
      <div><b>Area</b><span>${project.area}</span></div>
      <div><b>Client</b><span>${project.client}</span></div>
    </section>
    <section class="detail-body">
      <div><div class="eyebrow">Project Details</div><h2>Designed with context and delivery in mind.</h2></div>
      <div><p>${project.details}</p><div class="scope-grid">${scope}</div></div>
    </section>
    <section class="detail-gallery">
      <img src="${project.image}" alt="${project.name} main view">
      <img src="${project.secondaryImage}" alt="${project.name} supporting view">
    </section>
  `;
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
  const articles = window.NSQUARE_ARTICLES || [];
  if(!mount || !articles.length) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get('article') || articles[0].slug;
  const article = articles.find(item => item.slug === slug);

  if(!article){
    mount.innerHTML = '<section class="article-empty"><div class="eyebrow">Journal</div><h1>Article not found.</h1><p><a href="journal.html">Return to journal →</a></p></section>';
    return;
  }

  document.title = `${article.title} — Nsquare Journal`;
  const takeaways = (article.takeaways || []).map(item => `<li>${item}</li>`).join('');
  const secondaryImage = article.secondaryImage
    ? `<figure class="article-wide-image"><img src="${article.secondaryImage}" alt="${article.title} supporting view"></figure>`
    : '';
  mount.innerHTML = `
    <section class="article-hero">
      <div class="article-copy">
        <div class="eyebrow">${article.category}</div>
        <h1>${article.title}</h1>
        <p>${article.summary}</p>
      </div>
      <div class="article-image"><img src="${article.image}" alt="${article.alt}"></div>
    </section>
    <section class="article-body">
      <aside>
        <div class="eyebrow">Nsquare Journal</div>
        <a href="journal.html">Back to Journal <span>→</span></a>
      </aside>
      <article>
        ${article.body.slice(0, 3).map(paragraph => `<p>${paragraph}</p>`).join('')}
        ${takeaways ? `<h2>Key considerations</h2><ul>${takeaways}</ul>` : ''}
        ${secondaryImage}
        <h2>Practice notes</h2>
        ${article.body.slice(3).map(paragraph => `<p>${paragraph}</p>`).join('')}
      </article>
    </section>
  `;
})();
