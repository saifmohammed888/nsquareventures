(function(){
  const passwordKey = 'nsquare_cms_password';
  const loginPanel = document.getElementById('loginPanel');
  const cmsApp = document.getElementById('cmsApp');
  const loginForm = document.getElementById('loginForm');
  const passwordInput = document.getElementById('password');
  const status = document.getElementById('status');
  const projectsEditor = document.getElementById('projectsEditor');
  const articlesEditor = document.getElementById('articlesEditor');
  const siteEditor = document.getElementById('siteEditor');
  const uploadedUrl = document.getElementById('uploadedUrl');

  function password(){
    return sessionStorage.getItem(passwordKey) || '';
  }

  function setStatus(message, isError){
    status.textContent = message;
    status.style.color = isError ? '#b00020' : '#555';
  }

  function showApp(){
    loginPanel.hidden = true;
    cmsApp.hidden = false;
  }

  async function request(url, options){
    const response = await fetch(url, {
      ...options,
      headers: {
        ...(options && options.headers ? options.headers : {}),
        'x-cms-password': password()
      }
    });
    const data = await response.json().catch(() => ({}));
    if(!response.ok) throw new Error(data.error || 'Request failed.');
    return data;
  }

  async function loadContent(){
    setStatus('Loading content...');
    const content = await request('/api/content');
    projectsEditor.value = JSON.stringify(content.projects || [], null, 2);
    articlesEditor.value = JSON.stringify(content.articles || [], null, 2);
    siteEditor.value = JSON.stringify(content.site || {}, null, 2);
    setStatus(`Loaded. Last updated: ${content.updatedAt || 'fallback content'}`);
  }

  async function saveContent(){
    setStatus('Saving content...');
    const content = {
      projects: JSON.parse(projectsEditor.value || '[]'),
      articles: JSON.parse(articlesEditor.value || '[]'),
      site: JSON.parse(siteEditor.value || '{}')
    };
    await request('/api/content', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(content)
    });
    setStatus('Saved. Public site will read this content from /api/content.');
  }

  async function uploadImage(){
    const file = document.getElementById('imageFile').files[0];
    if(!file) throw new Error('Choose an image first.');
    setStatus(`Uploading ${file.name}...`);
    const result = await request(`/api/upload?filename=${encodeURIComponent(file.name)}`, {
      method: 'POST',
      headers: { 'content-type': file.type || 'application/octet-stream' },
      body: file
    });
    uploadedUrl.value = result.url;
    await navigator.clipboard?.writeText(result.url).catch(() => {});
    setStatus('Image uploaded. URL copied when browser permissions allow it.');
  }

  loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    sessionStorage.setItem(passwordKey, passwordInput.value);
    showApp();
    try{
      await loadContent();
    }catch(error){
      setStatus(error.message, true);
    }
  });

  document.getElementById('refreshBtn').addEventListener('click', () => loadContent().catch(error => setStatus(error.message, true)));
  document.getElementById('saveBtn').addEventListener('click', () => saveContent().catch(error => setStatus(error.message, true)));
  document.getElementById('uploadBtn').addEventListener('click', () => uploadImage().catch(error => setStatus(error.message, true)));
  document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem(passwordKey);
    location.reload();
  });

  document.querySelectorAll('[data-format]').forEach(button => {
    button.addEventListener('click', () => {
      const editor = document.getElementById(button.dataset.format);
      editor.value = JSON.stringify(JSON.parse(editor.value), null, 2);
    });
  });

  if(password()){
    showApp();
    loadContent().catch(error => setStatus(error.message, true));
  }
})();
