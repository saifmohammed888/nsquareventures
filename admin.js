(function(){
  const passwordKey = 'nsquare_cms_password';
  let content = { projects: [], articles: [], site: {} };
  let selectedProject = 0;
  let selectedArticle = 0;
  let uploadTarget = null;

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];

  function password(){ return sessionStorage.getItem(passwordKey) || ''; }
  function setStatus(message, isError){
    const status = $('#status');
    status.textContent = message;
    status.style.color = isError ? '#a40000' : '#666';
  }
  function showApp(){ $('#loginPanel').hidden = true; $('#cmsApp').hidden = false; }
  function slugify(value){
    return String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  function esc(value){
    return String(value == null ? '' : value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  }

  async function request(url, options){
    const response = await fetch(url, {
      ...options,
      headers: { ...(options?.headers || {}), 'x-cms-password': password() }
    });
    const data = await response.json().catch(() => ({}));
    if(!response.ok) throw new Error(data.error || 'Request failed.');
    return data;
  }

  function currentProject(){ return content.projects[selectedProject]; }
  function currentArticle(){ return content.articles[selectedArticle]; }

  function renderLists(){
    $('#projectList').innerHTML = content.projects.map((project, index) => `
      <button class="item ${index === selectedProject ? 'active' : ''}" type="button" data-select-project="${index}">
        <img src="${esc(project.image)}" alt="">
        <span><b>${esc(project.name || 'Untitled project')}</b><span>${esc(project.status || 'draft')} · ${esc(project.location || 'No location')}</span></span>
      </button>
    `).join('');
    $('#articleList').innerHTML = content.articles.map((article, index) => `
      <button class="item ${index === selectedArticle ? 'active' : ''}" type="button" data-select-article="${index}">
        <img src="${esc(article.image)}" alt="">
        <span><b>${esc(article.title || 'Untitled blog')}</b><span>${esc(article.category || 'No category')}</span></span>
      </button>
    `).join('');
    $$('[data-select-project]').forEach(button => button.addEventListener('click', () => { selectedProject = Number(button.dataset.selectProject); renderAll(); }));
    $$('[data-select-article]').forEach(button => button.addEventListener('click', () => { selectedArticle = Number(button.dataset.selectArticle); renderAll(); }));
  }

  function fillProjectForm(){
    const project = currentProject();
    if(!project) return;
    $$('[data-project]').forEach(input => { input.value = project[input.dataset.project] || ''; });
    $('#projectThumb').src = project.image || '';
    $('#projectPreviewTitle').textContent = project.name || 'Untitled project';
    $('#projectPreviewText').textContent = project.summary || 'Add a short summary for cards and detail pages.';
    renderRepeat('projectScope', project.scope || [], false);
  }

  function fillArticleForm(){
    const article = currentArticle();
    if(!article) return;
    $$('[data-article]').forEach(input => { input.value = article[input.dataset.article] || ''; });
    $('#articleThumb').src = article.image || '';
    $('#articlePreviewTitle').textContent = article.title || 'Untitled article';
    $('#articlePreviewText').textContent = article.summary || 'Add a short summary for journal cards.';
    renderRepeat('articleTakeaways', article.takeaways || [], false);
    renderRepeat('articleBody', article.body || [], true);
  }

  function renderRepeat(id, values, large){
    const container = document.getElementById(id);
    container.innerHTML = values.map((value, index) => `
      <div class="repeat-row" data-repeat-row="${index}">
        ${large ? `<textarea>${esc(value)}</textarea>` : `<input value="${esc(value)}">`}
        <button type="button">Remove</button>
      </div>
    `).join('');
    container.querySelectorAll('.repeat-row').forEach(row => {
      const index = Number(row.dataset.repeatRow);
      const field = row.querySelector('input,textarea');
      field.addEventListener('input', () => updateRepeat(id, index, field.value));
      row.querySelector('button').addEventListener('click', () => removeRepeat(id, index));
    });
  }

  function repeatArray(id){
    if(id === 'projectScope') return currentProject().scope ||= [];
    if(id === 'articleTakeaways') return currentArticle().takeaways ||= [];
    return currentArticle().body ||= [];
  }
  function updateRepeat(id, index, value){ repeatArray(id)[index] = value; syncRaw(); }
  function removeRepeat(id, index){ repeatArray(id).splice(index, 1); renderAll(); }
  function addRepeat(id){ repeatArray(id).push(''); renderAll(); }

  function renderSiteImages(){
    const fields = [
      ['homeHeroImage', 'Home hero image', 'Large image on the first homepage section.'],
      ['projectsHeroImage', 'Projects hero image', 'Main image at the top of Projects.'],
      ['journalHeroImage', 'Journal hero image', 'Main image at the top of Journal.'],
      ['contactHeroImage', 'Contact hero image', 'Main image on Contact.'],
      ['processImage', 'Process image', 'Image used in the homepage process section.']
    ];
    $('#siteImages').innerHTML = fields.map(([key, title, help]) => `
      <div class="site-card">
        <p class="kicker">${esc(title)}</p>
        <img src="${esc(content.site[key] || '')}" alt="">
        <p>${esc(help)}</p>
        <div class="image-field"><label>Image URL<input data-site="${key}" data-image-input value="${esc(content.site[key] || '')}"></label><button type="button" data-upload-for="site.${key}">Upload</button></div>
      </div>
    `).join('');
    $$('[data-site]').forEach(input => input.addEventListener('input', () => { content.site[input.dataset.site] = input.value; renderSiteImages(); syncRaw(); }));
  }

  function syncRaw(){ $('#rawEditor').value = JSON.stringify(content, null, 2); }

  function renderAll(){
    renderLists();
    fillProjectForm();
    fillArticleForm();
    renderSiteImages();
    syncRaw();
    bindUploadButtons();
  }

  async function loadContent(){
    setStatus('Loading content...');
    content = await request('/api/content');
    content.projects ||= [];
    content.articles ||= [];
    content.site ||= {};
    selectedProject = Math.min(selectedProject, Math.max(content.projects.length - 1, 0));
    selectedArticle = Math.min(selectedArticle, Math.max(content.articles.length - 1, 0));
    renderAll();
    setStatus(`Loaded ${content.projects.length} projects and ${content.articles.length} blogs.`);
  }

  async function saveContent(){
    try{
      const raw = JSON.parse($('#rawEditor').value || '{}');
      content = { projects: raw.projects || content.projects, articles: raw.articles || content.articles, site: raw.site || content.site };
    }catch(error){}
    setStatus('Saving changes...');
    await request('/api/content', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(content)
    });
    setStatus('Saved. Refresh the website to see the latest content.');
  }

  function updateField(kind, key, value){
    const item = kind === 'project' ? currentProject() : currentArticle();
    item[key] = value;
    if(key === 'name' && kind === 'project' && !item.slug) item.slug = slugify(value);
    if(key === 'title' && kind === 'article' && !item.slug) item.slug = slugify(value);
    renderLists();
    if(key === 'image' || key === 'summary' || key === 'name' || key === 'title') kind === 'project' ? fillProjectForm() : fillArticleForm();
    syncRaw();
  }

  function addProject(){
    content.projects.push({ slug: 'new-project', name: 'New Project', status: 'ongoing', type: 'residential', location: '', area: '', client: '', image: '', secondaryImage: '', summary: '', details: '', scope: [] });
    selectedProject = content.projects.length - 1;
    renderAll();
  }
  function addArticle(){
    content.articles.push({ slug: 'new-blog', title: 'New Blog', category: 'Journal', categories: 'insights', image: '', secondaryImage: '', alt: '', summary: '', takeaways: [], body: [] });
    selectedArticle = content.articles.length - 1;
    renderAll();
  }

  async function uploadImage(file){
    if(!file) return;
    setStatus(`Uploading ${file.name}...`);
    const result = await request(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
      method: 'POST',
      headers: { 'content-type': file.type || 'application/octet-stream' },
      body: file
    });
    applyUploadedUrl(result.url);
    setStatus('Image uploaded and placed in the selected field.');
  }

  function applyUploadedUrl(url){
    const [kind, key] = uploadTarget.split('.');
    if(kind === 'project') currentProject()[key] = url;
    if(kind === 'article') currentArticle()[key] = url;
    if(kind === 'site') content.site[key] = url;
    renderAll();
  }
  function bindUploadButtons(){
    $$('[data-upload-for]').forEach(button => {
      button.onclick = () => {
        uploadTarget = button.dataset.uploadFor;
        $('#hiddenUploader').click();
      };
    });
  }

  $('#loginForm').addEventListener('submit', async event => {
    event.preventDefault();
    sessionStorage.setItem(passwordKey, $('#password').value);
    showApp();
    try{ await loadContent(); }catch(error){ setStatus(error.message, true); }
  });
  $('#refreshBtn').addEventListener('click', () => loadContent().catch(error => setStatus(error.message, true)));
  $('#saveBtn').addEventListener('click', () => saveContent().catch(error => setStatus(error.message, true)));
  $('#logoutBtn').addEventListener('click', () => { sessionStorage.removeItem(passwordKey); location.reload(); });
  $('#addProjectBtn').addEventListener('click', addProject);
  $('#addArticleBtn').addEventListener('click', addArticle);
  $('#deleteProjectBtn').addEventListener('click', () => { if(confirm('Delete this project?')){ content.projects.splice(selectedProject, 1); selectedProject = 0; renderAll(); } });
  $('#deleteArticleBtn').addEventListener('click', () => { if(confirm('Delete this blog?')){ content.articles.splice(selectedArticle, 1); selectedArticle = 0; renderAll(); } });
  $('#hiddenUploader').addEventListener('change', event => uploadImage(event.target.files[0]).catch(error => setStatus(error.message, true)));

  $$('[data-project]').forEach(input => input.addEventListener('input', () => updateField('project', input.dataset.project, input.value)));
  $$('[data-article]').forEach(input => input.addEventListener('input', () => updateField('article', input.dataset.article, input.value)));
  $$('[data-add-repeat]').forEach(button => button.addEventListener('click', () => addRepeat(button.dataset.addRepeat)));
  $$('.tabs button').forEach(button => button.addEventListener('click', () => {
    $$('.tabs button').forEach(item => item.classList.toggle('active', item === button));
    $$('.tab-panel').forEach(panel => panel.classList.toggle('active', panel.id === `tab-${button.dataset.tab}`));
  }));

  if(password()){
    showApp();
    loadContent().catch(error => setStatus(error.message, true));
  }
})();
