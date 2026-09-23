import Head from 'next/head';
import Script from 'next/script';
import { useEffect, useMemo, useState } from 'react';

const emptyProject = { slug: 'new-project', name: 'New Project', status: 'ongoing', type: 'residential', location: '', area: '', client: '', image: '', secondaryImage: '', summary: '', details: '', scope: [] };
const emptyArticle = { slug: 'new-blog', title: 'New Blog', category: 'Journal', categories: 'insights', image: '', secondaryImage: '', alt: '', summary: '', takeaways: [], body: [] };
const siteImageFields = [
  ['homeHeroImage', 'Home / Hero image', 'Main image on the home page hero.'],
  ['homeProcessImage', 'Home / Process image', 'Built project image in the home process section.'],
  ['homeProcessSketchImage', 'Home / Process sketch', 'Sketch background in the home process section.'],
  ['navigationMenuImage', 'Navigation / Menu image', 'Small image inside the slide-out navigation menu.'],
  ['projectsHeroImage', 'Projects / Hero image', 'Main image at the top of the Projects page.'],
  ['projectsArtImage', 'Projects / Art image', 'Drawing image used in the Projects CTA/art panel.'],
  ['journalHeroImage', 'Journal / Hero image', 'Main image at the top of the Journal page.'],
  ['contactHeroImage', 'Contact / Hero image', 'Main image at the top of the Contact page.'],
  ['expertiseSignatureImage', 'Expertise / Signature', 'Signature image beside the architect intro.'],
  ['expertiseArchitectImage', 'Expertise / Architect portrait', 'Primary architect image in the Expertise hero.'],
  ['expertiseQuoteBackgroundImage', 'Expertise / Quote background', 'Subtle background image behind the hero quote panel.'],
  ['expertiseQuoteAccentImage', 'Expertise / Quote accent', 'Tall accent image beside the hero quote panel.'],
  ['serviceArchitectureImage', 'Services / Architecture image', 'Image for Architecture & Planning service.'],
  ['serviceElevationImage', 'Services / Elevation image', 'Image for Elevation Design service.'],
  ['serviceApprovalsImage', 'Services / Approvals image', 'Image for Consulting & Approvals service.'],
  ['serviceConstructionImage', 'Services / Construction image', 'Image for Construction Support service.'],
  ['elevationQuoteBackgroundImage', 'Elevation / Quote background', 'Background image for the elevation quote block.'],
  ['elevationProcessSketchImage', 'Elevation / Process sketch', 'First image in From Sketch to Street.'],
  ['elevationProcessDevelopmentImage', 'Elevation / Process development', 'Second image in From Sketch to Street.'],
  ['elevationProcessFinalImage', 'Elevation / Process final', 'Third image in From Sketch to Street.'],
  ['elevationSelectedImage1', 'Elevation / Selected work 1', 'First selected elevation work image.'],
  ['elevationSelectedImage2', 'Elevation / Selected work 2', 'Second selected elevation work image.'],
  ['elevationSelectedImage3', 'Elevation / Selected work 3', 'Third selected elevation work image.'],
  ['elevationSelectedImage4', 'Elevation / Selected work 4', 'Fourth selected elevation work image.'],
  ['elevationSelectedImage5', 'Elevation / Selected work 5', 'Fifth selected elevation work image.']
];

function slugify(value){ return String(value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
function cx(...values){ return values.filter(Boolean).join(' '); }
function Field({ label, children }){ return <label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-600"><span>{label}</span>{children}</label>; }
function TextInput(props){ return <input {...props} className="h-11 rounded-md border cms-border bg-white px-3 text-sm text-black outline-none transition focus:border-[#18372F] focus:ring-2 focus:ring-[#18372F]/10" />; }
function TextArea(props){ return <textarea {...props} className="min-h-28 rounded-md border cms-border bg-white px-3 py-3 text-sm text-black outline-none transition focus:border-[#18372F] focus:ring-2 focus:ring-[#18372F]/10" />; }
function Button({ tone = 'dark', className = '', ...props }){
  return <button {...props} className={cx('inline-flex h-11 items-center justify-center rounded-md border px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50', tone === 'dark' && 'border-[#18372F] bg-[#18372F] text-white hover:bg-[#102a24]', tone === 'light' && 'cms-border bg-white text-[#18372F] hover:border-[#18372F]', tone === 'danger' && 'border-red-700 bg-white text-red-700 hover:bg-red-50', className)} />;
}

export default function Admin(){
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [status, setStatus] = useState('Locked.');
  const [tab, setTab] = useState('projects');
  const [content, setContent] = useState({ projects: [], articles: [], media: [], site: {} });
  const [projectIndex, setProjectIndex] = useState(0);
  const [articleIndex, setArticleIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState('');
  const [raw, setRaw] = useState('');
  const [imageOptions, setImageOptions] = useState([]);
  const [mediaDraft, setMediaDraft] = useState({ name: '', description: '', file: null });
  const [mediaSearch, setMediaSearch] = useState('');

  const project = content.projects[projectIndex] || null;
  const article = content.articles[articleIndex] || null;
  const mediaOptions = useMemo(() => {
    const library = (content.media || []).filter(item => item.url).map(item => ({ ...item, label: item.name || item.url, source: 'Media Library' }));
    const known = new Set(library.map(item => item.url));
    return [...library, ...imageOptions.filter(item => !known.has(item.url))];
  }, [content.media, imageOptions]);
  const stats = useMemo(() => [['Projects', content.projects.length], ['Ongoing', content.projects.filter(project => project.status !== 'completed').length], ['Completed', content.projects.filter(project => project.status === 'completed').length], ['Blogs', content.articles.length], ['Media', (content.media || []).length], ['Site images', Object.values(content.site || {}).filter(Boolean).length]], [content]);
  const pageTitle = tab === 'projects' ? 'Projects' : tab === 'blogs' ? 'Blogs' : tab === 'images' ? 'Media / Images' : tab === 'site' ? 'Site Content' : 'Advanced Settings';

  useEffect(() => {
    const saved = sessionStorage.getItem('nsquare_cms_password') || '';
    if(saved){ setPassword(saved); setAuthed(true); }
  }, []);

  useEffect(() => {
    if(authed) loadContent().catch(error => setStatus(error.message));
  }, [authed]);

  function authHeaders(extra = {}){ return { ...extra, 'x-cms-password': password }; }
  function sync(next){ setRaw(JSON.stringify(next, null, 2)); return next; }

  async function loadContent(){
    setStatus('Loading content...');
    const response = await fetch('/api/content', { headers: authHeaders() });
    const data = await response.json();
    if(!response.ok) throw new Error(data.error || 'Unable to load content.');
    const next = sync({ projects: data.projects || [], articles: data.articles || [], media: data.media || [], site: data.site || {} });
    setContent(next);
    setProjectIndex(0);
    setArticleIndex(0);
    await loadImages();
    setStatus(`Loaded ${next.projects.length} projects and ${next.articles.length} blogs.`);
  }

  async function loadImages(){
    const response = await fetch('/api/images', { headers: authHeaders() });
    const data = await response.json();
    if(!response.ok) throw new Error(data.error || 'Unable to load image library.');
    setImageOptions(data.images || []);
    return data.images || [];
  }

  function login(event){
    event.preventDefault();
    sessionStorage.setItem('nsquare_cms_password', password);
    setAuthed(true);
  }

  async function saveContent(){
    setSaving(true);
    setStatus('Saving...');
    try{
      const body = tab === 'raw' ? JSON.parse(raw || '{}') : content;
      const saved = await writeContent(body);
      setContent(saved);
      setStatus('Saved. Refresh the public site to see updates.');
    }catch(error){ setStatus(error.message); }
    finally{ setSaving(false); }
  }

  async function writeContent(body){
    const response = await fetch('/api/content', { method: 'POST', headers: authHeaders({ 'content-type': 'application/json' }), body: JSON.stringify(body) });
    const data = await response.json();
    if(!response.ok) throw new Error(data.error || 'Unable to save content.');
    return sync({ projects: data.content.projects || [], articles: data.content.articles || [], media: data.content.media || [], site: data.content.site || {} });
  }

  function logout(){ sessionStorage.removeItem('nsquare_cms_password'); setAuthed(false); setPassword(''); setStatus('Locked.'); }

  function updateProject(key, value){
    setContent(current => sync({ ...current, projects: current.projects.map((item, index) => index === projectIndex ? { ...item, [key]: value, ...(key === 'name' && !item.slug ? { slug: slugify(value) } : {}) } : item) }));
  }

  function updateArticle(key, value){
    setContent(current => sync({ ...current, articles: current.articles.map((item, index) => index === articleIndex ? { ...item, [key]: value, ...(key === 'title' && !item.slug ? { slug: slugify(value) } : {}) } : item) }));
  }

  function updateSite(key, value){ setContent(current => sync({ ...current, site: { ...current.site, [key]: value } })); }

  function updateList(kind, index, value){
    setContent(current => {
      const isProject = kind === 'scope';
      const bucket = isProject ? 'projects' : 'articles';
      const itemIndex = isProject ? projectIndex : articleIndex;
      const listKey = isProject ? 'scope' : kind;
      const items = current[bucket].map((item, i) => {
        if(i !== itemIndex) return item;
        const list = [...(item[listKey] || [])];
        list[index] = value;
        return { ...item, [listKey]: list };
      });
      return sync({ ...current, [bucket]: items });
    });
  }

  function addListItem(kind){ updateList(kind, kind === 'scope' ? (project?.scope || []).length : (article?.[kind] || []).length, ''); }

  function removeListItem(kind, index){
    setContent(current => {
      const isProject = kind === 'scope';
      const bucket = isProject ? 'projects' : 'articles';
      const itemIndex = isProject ? projectIndex : articleIndex;
      const listKey = isProject ? 'scope' : kind;
      const items = current[bucket].map((item, i) => {
        if(i !== itemIndex) return item;
        const list = [...(item[listKey] || [])];
        list.splice(index, 1);
        return { ...item, [listKey]: list };
      });
      return sync({ ...current, [bucket]: items });
    });
  }

  async function uploadMedia(event){
    event.preventDefault();
    if(!mediaDraft.file) return setStatus('Choose an image file first.');
    const name = mediaDraft.name.trim() || mediaDraft.file.name.replace(/\.[^.]+$/, '');
    setUploading('media');
    setStatus(`Uploading ${name}...`);
    try{
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(name || mediaDraft.file.name)}`, { method: 'POST', headers: authHeaders({ 'content-type': mediaDraft.file.type || 'application/octet-stream' }), body: mediaDraft.file });
      const data = await response.json();
      if(!response.ok) throw new Error(data.error || 'Upload failed.');
      const mediaItem = { id: `${Date.now()}`, name, description: mediaDraft.description.trim(), url: data.url, createdAt: new Date().toISOString() };
      let nextContent;
      setContent(current => {
        nextContent = sync({ ...current, media: [mediaItem, ...(current.media || [])] });
        return nextContent;
      });
      const saved = await writeContent(nextContent);
      setContent(saved);
      setMediaDraft({ name: '', description: '', file: null });
      await loadImages();
      setStatus('Image added and saved to media library.');
    }catch(error){ setStatus(error.message); }
    finally{ setUploading(''); }
  }

  if(!authed){
    return (
      <>
        <Head><title>Nsquare CMS</title></Head>
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
        <main className="min-h-screen bg-neutral-50 px-5 py-10 text-black">
          <form onSubmit={login} className="mx-auto mt-16 max-w-md border border-neutral-200 bg-white p-8 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">Private Admin</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight">Nsquare CMS</h1>
            <p className="mt-3 text-sm leading-6 text-neutral-600">Enter the CMS password to manage projects, blog posts, and site imagery.</p>
            <div className="mt-6"><Field label="Password"><TextInput type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" required /></Field></div>
            <Button className="mt-5 w-full" type="submit">Open CMS</Button>
          </form>
        </main>
      </>
    );
  }

  return (
    <>
      <Head><title>Nsquare CMS</title><style>{`body{font-family:Inter,Arial,sans-serif}.cms-green{background:#18372F}.cms-text{color:#18372F}.cms-border{border-color:#E3E8E5}`}</style></Head>
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      <main className="min-h-screen bg-[#F7F8F5] text-[#102A24]">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r cms-border bg-[#FBFCF9] p-5 lg:flex lg:flex-col">
          <div><p className="font-serif text-lg tracking-[0.18em] cms-text">N SQUARE VENTURES</p><p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">CMS</p></div>
          <nav className="mt-10 grid gap-1">{[['projects','Projects',content.projects.length],['blogs','Blogs',content.articles.length],['images','Media / Images',(content.media || []).length],['site','Site Content',Object.values(content.site || {}).filter(Boolean).length],['raw','Advanced / Settings',null]].map(([key,label,count]) => <button key={key} onClick={() => setTab(key)} className={cx('flex items-center justify-between rounded-md px-3 py-3 text-left text-sm font-semibold transition', tab === key ? 'bg-[#E9EFEB] cms-text' : 'text-slate-700 hover:bg-white')}><span>{label}</span>{count != null && <span className="rounded-full bg-[#E9EFEB] px-2 py-0.5 text-xs cms-text">{count}</span>}</button>)}</nav>
          <div className="mt-auto grid gap-3"><a href="/" target="_blank" className="text-sm font-semibold cms-text">View Site ↗</a><div className="flex items-center gap-3 border-t cms-border pt-5"><div className="grid h-10 w-10 place-items-center rounded-full cms-green text-sm font-semibold text-white">NU</div><div><b className="block text-sm">Nsquare CMS</b><span className="text-xs text-slate-500">Administrator</span></div></div></div>
        </aside>
        <section className="lg:pl-64">
        <header className="sticky top-0 z-20 border-b cms-border bg-[#FBFCF9] px-5 py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Nsquare CMS</p><h1 className="text-3xl font-semibold tracking-tight cms-text">{pageTitle}</h1><p className={cx('mt-1 text-sm', status.toLowerCase().includes('unable') || status.toLowerCase().includes('failed') || status.toLowerCase().includes('error') ? 'text-red-700' : 'text-slate-500')}>{saving ? 'Saving changes...' : status}</p></div>
            <div className="flex flex-wrap gap-2"><a href="/" target="_blank" className="inline-flex h-11 items-center justify-center rounded-md border cms-border bg-white px-4 text-sm font-semibold cms-text">View Website ↗</a><Button onClick={saveContent} disabled={saving} className="rounded-md cms-green">{saving ? 'Saving...' : 'Save Changes'}</Button><Button tone="light" className="rounded-md" onClick={() => loadContent().catch(error => setStatus(error.message))}>Reload</Button><Button tone="light" className="rounded-md" onClick={logout}>Lock</Button></div>
          </div>
        </header>

        <div className="grid gap-5 px-5 py-6">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">{stats.map(([label, value]) => <div key={label} className="rounded-lg border cms-border bg-white p-4"><span className="text-xs text-slate-500">{label}</span><b className="mt-1 block text-2xl cms-text">{value}</b></div>)}</div>
          <div className="lg:hidden"><select value={tab} onChange={event => setTab(event.target.value)} className="h-11 w-full rounded-md border cms-border bg-white px-3 text-sm"><option value="projects">Projects</option><option value="blogs">Blogs</option><option value="images">Media / Images</option><option value="site">Site Content</option><option value="raw">Advanced / Settings</option></select></div>

          {tab === 'projects' && <ProjectsTab imageOptions={mediaOptions} content={content} setContent={setContent} project={project} projectIndex={projectIndex} setProjectIndex={setProjectIndex} updateProject={updateProject} updateList={updateList} addListItem={addListItem} removeListItem={removeListItem} sync={sync} />}
          {tab === 'blogs' && <BlogsTab imageOptions={mediaOptions} content={content} setContent={setContent} article={article} articleIndex={articleIndex} setArticleIndex={setArticleIndex} updateArticle={updateArticle} updateList={updateList} addListItem={addListItem} removeListItem={removeListItem} sync={sync} />}
          {tab === 'images' && <ImagesTab imageOptions={mediaOptions} content={content} setContent={setContent} uploading={uploading} mediaDraft={mediaDraft} setMediaDraft={setMediaDraft} uploadMedia={uploadMedia} sync={sync} mediaSearch={mediaSearch} setMediaSearch={setMediaSearch} />}
          {tab === 'site' && <SiteContentTab imageOptions={mediaOptions} content={content} updateSite={updateSite} />}
          {tab === 'raw' && <Editor title="Advanced JSON"><p className="text-sm text-neutral-600">Use this only for debugging or bulk copy/paste edits.</p><textarea value={raw} onChange={event => setRaw(event.target.value)} spellCheck={false} className="min-h-[620px] w-full border border-neutral-300 bg-white p-4 font-mono text-xs outline-none focus:border-black" /></Editor>}
        </div>
        </section>
      </main>
    </>
  );
}

function ProjectsTab({ content, setContent, project, projectIndex, setProjectIndex, updateProject, updateList, addListItem, removeListItem, sync, imageOptions }){
  return <section className="grid gap-5 lg:grid-cols-[300px_1fr]"><ItemList title="Projects" items={content.projects} active={projectIndex} onSelect={setProjectIndex} onAdd={() => { setContent(current => sync({ ...current, projects: [...current.projects, { ...emptyProject }] })); setProjectIndex(content.projects.length); }} label={item => item.name} sublabel={item => `${item.status || 'draft'} · ${item.location || 'No location'}`} />{project && <Editor title={project.name || 'Project'}><Preview image={project.image} title={project.name} text={project.summary} /><div className="grid gap-4 md:grid-cols-2"><Field label="Project name"><TextInput value={project.name || ''} onChange={event => updateProject('name', event.target.value)} /></Field><Field label="Slug"><TextInput value={project.slug || ''} onChange={event => updateProject('slug', event.target.value)} /></Field><ProjectStatusControl value={project.status || 'ongoing'} onChange={value => updateProject('status', value)} /><Field label="Type filters"><TextInput value={project.type || ''} onChange={event => updateProject('type', event.target.value)} placeholder="villa residential" /></Field><Field label="Location"><TextInput value={project.location || ''} onChange={event => updateProject('location', event.target.value)} /></Field><Field label="Area"><TextInput value={project.area || ''} onChange={event => updateProject('area', event.target.value)} /></Field><Field label="Client / owner"><TextInput value={project.client || ''} onChange={event => updateProject('client', event.target.value)} /></Field></div><div className="grid gap-4 md:grid-cols-2"><ImageField label="Main image" value={project.image || ''} onChange={value => updateProject('image', value)} imageOptions={imageOptions} /><ImageField label="Second image" value={project.secondaryImage || ''} onChange={value => updateProject('secondaryImage', value)} imageOptions={imageOptions} /></div><Field label="Short card summary"><TextArea rows={3} value={project.summary || ''} onChange={event => updateProject('summary', event.target.value)} /></Field><Field label="Project detail text"><TextArea rows={5} value={project.details || ''} onChange={event => updateProject('details', event.target.value)} /></Field><Repeat title="Scope" items={project.scope || []} kind="scope" onAdd={addListItem} onUpdate={updateList} onRemove={removeListItem} /><Button tone="danger" onClick={() => { if(confirm('Delete this project?')) setContent(current => sync({ ...current, projects: current.projects.filter((_, i) => i !== projectIndex) })); }}>Delete project</Button></Editor>}</section>;
}

function BlogsTab({ content, setContent, article, articleIndex, setArticleIndex, updateArticle, updateList, addListItem, removeListItem, sync, imageOptions }){
  return <section className="grid gap-5 lg:grid-cols-[300px_1fr]"><ItemList title="Blogs" items={content.articles} active={articleIndex} onSelect={setArticleIndex} onAdd={() => { setContent(current => sync({ ...current, articles: [...current.articles, { ...emptyArticle }] })); setArticleIndex(content.articles.length); }} label={item => item.title} sublabel={item => item.category || 'No category'} />{article && <Editor title={article.title || 'Blog'}><Preview image={article.image} title={article.title} text={article.summary} /><div className="grid gap-4 md:grid-cols-2"><Field label="Title"><TextInput value={article.title || ''} onChange={event => updateArticle('title', event.target.value)} /></Field><Field label="Slug"><TextInput value={article.slug || ''} onChange={event => updateArticle('slug', event.target.value)} /></Field><Field label="Display category"><TextInput value={article.category || ''} onChange={event => updateArticle('category', event.target.value)} /></Field><Field label="Filter keywords"><TextInput value={article.categories || ''} onChange={event => updateArticle('categories', event.target.value)} /></Field><Field label="Image alt text"><TextInput value={article.alt || ''} onChange={event => updateArticle('alt', event.target.value)} /></Field></div><div className="grid gap-4 md:grid-cols-2"><ImageField label="Main blog image" value={article.image || ''} onChange={value => updateArticle('image', value)} imageOptions={imageOptions} /><ImageField label="Supporting image" value={article.secondaryImage || ''} onChange={value => updateArticle('secondaryImage', value)} imageOptions={imageOptions} /></div><Field label="Short summary"><TextArea rows={3} value={article.summary || ''} onChange={event => updateArticle('summary', event.target.value)} /></Field><Repeat title="Takeaways" items={article.takeaways || []} kind="takeaways" onAdd={addListItem} onUpdate={updateList} onRemove={removeListItem} /><Repeat title="Article paragraphs" textarea items={article.body || []} kind="body" onAdd={addListItem} onUpdate={updateList} onRemove={removeListItem} /><Button tone="danger" onClick={() => { if(confirm('Delete this blog?')) setContent(current => sync({ ...current, articles: current.articles.filter((_, i) => i !== articleIndex) })); }}>Delete blog</Button></Editor>}</section>;
}

function ImagesTab({ content, setContent, uploading, mediaDraft, setMediaDraft, uploadMedia, sync, mediaSearch, setMediaSearch }){
  function removeMedia(id){ if(confirm('Remove this media record? Blob file stays stored, but it disappears from the named library.')) setContent(current => sync({ ...current, media: (current.media || []).filter(item => item.id !== id) })); }
  const items = (content.media || []).filter(item => `${item.name || ''} ${item.description || ''}`.toLowerCase().includes(mediaSearch.toLowerCase()));
  return <section className="grid gap-5"><Editor title="Upload Images"><form onSubmit={uploadMedia} onDrop={event => { event.preventDefault(); const file = event.dataTransfer.files?.[0]; if(file) setMediaDraft(current => ({ ...current, file, name: current.name || file.name.replace(/\.[^.]+$/, '') })); }} onDragOver={event => event.preventDefault()} className="grid gap-4 rounded-lg border border-dashed border-slate-300 bg-[#FAFBF8] p-6 lg:grid-cols-[1fr_1fr_auto] lg:items-end"><Field label="Image name"><TextInput value={mediaDraft.name} onChange={event => setMediaDraft(current => ({ ...current, name: event.target.value }))} placeholder="Homepage hero, Nadeem portrait..." /></Field><Field label="Description"><TextInput value={mediaDraft.description} onChange={event => setMediaDraft(current => ({ ...current, description: event.target.value }))} placeholder="Where this image is useful" /></Field><label className="grid gap-2 text-xs font-semibold uppercase tracking-wide text-neutral-600"><span>File</span><input type="file" accept="image/*" onChange={event => setMediaDraft(current => ({ ...current, file: event.target.files?.[0] || null, name: current.name || event.target.files?.[0]?.name?.replace(/\.[^.]+$/, '') || '' }))} className="block h-11 text-sm file:mr-3 file:h-11 file:border-0 file:rounded-md file:bg-[#18372F] file:px-4 file:text-sm file:font-semibold file:text-white" /></label><div className="lg:col-span-3"><Button type="submit" disabled={uploading === 'media'} className="rounded-md cms-green">{uploading === 'media' ? 'Uploading...' : 'Upload to media library'}</Button><p className="mt-2 text-xs text-neutral-500">Drag and drop or choose a file. Upload once, reuse everywhere.</p></div></form></Editor><Editor title="Media Library"><div className="mb-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"><p className="text-sm text-slate-500">Reusable images for projects, blogs and site sections.</p><TextInput value={mediaSearch} onChange={event => setMediaSearch(event.target.value)} placeholder="Search images..." /></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">{items.map(item => <div key={item.id || item.url} className="rounded-lg border cms-border bg-white p-2"><img src={item.url} alt="" className="h-32 w-full rounded-md bg-neutral-100 object-cover" /><div className="mt-2 min-w-0"><b className="block truncate text-sm">{item.name || 'Untitled image'}</b><p className="line-clamp-2 text-xs text-neutral-500">{item.description || item.url}</p><Button tone="danger" className="mt-2 h-8 rounded-md px-3 text-xs" onClick={() => removeMedia(item.id)}>Remove</Button></div></div>)}{!items.length && <p className="col-span-full rounded-lg border border-dashed border-neutral-300 p-6 text-sm text-neutral-500">No media found.</p>}</div></Editor></section>;
}

function SiteContentTab({ content, updateSite, imageOptions }){
  return <Editor title="Assign Site Images"><div className="grid gap-3 md:grid-cols-2">{siteImageFields.map(([key, title, help]) => <div key={key} className="grid grid-cols-[64px_1fr] gap-3 rounded-lg border cms-border bg-white p-3"><img src={content.site[key] || ''} alt="" className="h-16 w-16 rounded-md bg-neutral-100 object-cover" /><div className="min-w-0"><h3 className="text-sm font-semibold cms-text">{title}</h3><p className="mb-3 mt-1 line-clamp-2 text-xs text-neutral-500">{help}</p><ImageField label="Image" value={content.site[key] || ''} onChange={value => updateSite(key, value)} imageOptions={imageOptions} /></div></div>)}</div></Editor>;
}

function ItemList({ title, items, active, onSelect, onAdd, label, sublabel }){
  return <aside className="h-max border border-neutral-200 bg-white p-3 shadow-sm lg:sticky lg:top-24"><div className="mb-3 flex items-center justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">Manage</p><h2 className="text-lg font-semibold">{title}</h2></div><Button className="h-9 px-3 text-xs" onClick={onAdd}>Add</Button></div><div className="grid max-h-[72vh] gap-1 overflow-auto pr-1">{items.map((item, index) => <button key={`${label(item)}-${index}`} onClick={() => onSelect(index)} className={cx('grid grid-cols-[42px_1fr] gap-2 border p-1.5 text-left transition', active === index ? 'border-black bg-neutral-50' : 'border-neutral-200 bg-white hover:border-neutral-400')}><img src={item.image || ''} alt="" className="h-10 w-10 bg-neutral-100 object-cover" /><span className="min-w-0"><b className="block truncate text-xs leading-tight">{label(item) || 'Untitled'}</b><span className="mt-1 block truncate text-[11px] capitalize text-neutral-500">{sublabel(item)}</span></span></button>)}</div></aside>;
}

function Editor({ title, children }){
  return <section className="rounded-lg border cms-border bg-white p-5"><div className="mb-5 border-b cms-border pb-4"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">Editor</p><h2 className="mt-1 text-2xl font-semibold cms-text">{title}</h2></div><div className="grid gap-5">{children}</div></section>;
}

function Preview({ image, title, text }){
  return <div className="grid gap-3 border border-neutral-200 bg-neutral-50 p-3 md:grid-cols-[96px_1fr] md:items-center"><img src={image || ''} alt="" className="h-20 w-full border border-neutral-200 bg-white object-cover md:w-24" /><div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-neutral-500">Preview</p><h3 className="mt-1 truncate text-xl font-semibold">{title || 'Untitled'}</h3><p className="mt-1 line-clamp-2 text-xs leading-5 text-neutral-600">{text || 'Add a short summary for cards and detail pages.'}</p></div></div>;
}

function ProjectStatusControl({ value, onChange }){
  const options = [['ongoing', 'Ongoing'], ['completed', 'Completed']];
  return <div className="grid gap-2"><span className="text-xs font-semibold uppercase tracking-wide text-neutral-600">Project status</span><div className="grid grid-cols-2 overflow-hidden rounded-md border cms-border bg-white p-1">{options.map(([key, label]) => <button key={key} type="button" onClick={() => onChange(key)} className={cx('h-10 rounded px-3 text-sm font-semibold transition', value === key ? 'bg-[#18372F] text-white' : 'text-[#18372F] hover:bg-[#EEF3EF]')}>{label}</button>)}</div><p className="text-xs text-neutral-500">Controls whether this project appears under ongoing or completed sections and filters.</p></div>;
}

function ImageField({ label, value, onChange, imageOptions = [] }){
  const library = imageOptions.filter(image => image.source === 'Media Library');
  const uploaded = imageOptions.filter(image => image.source === 'Uploaded');
  const builtin = imageOptions.filter(image => image.source !== 'Uploaded' && image.source !== 'Media Library');
  function optionGroup(title, options){
    if(!options.length) return null;
    return <optgroup label={title}>{options.map(image => <option key={`${title}-${image.url}`} value={image.url}>{image.label || image.url}</option>)}</optgroup>;
  }
  return <div className="grid gap-2"><Field label={label}><TextInput value={value} onChange={event => onChange(event.target.value)} placeholder="Image URL or path" /></Field><div className="grid grid-cols-[52px_1fr] gap-2"><img src={value || ''} alt="" className="h-12 w-12 border border-neutral-200 bg-neutral-100 object-cover" /><select value="" onChange={event => { if(event.target.value) onChange(event.target.value); }} className="h-12 min-w-0 border border-neutral-300 bg-white px-3 text-sm text-black"><option value="">{imageOptions.length ? `Pick reusable image (${imageOptions.length})` : 'No images loaded'}</option>{optionGroup('Media Library', library)}{optionGroup('Uploaded Blob URLs', uploaded)}{optionGroup('Built-in Images folder', builtin)}</select></div>{value ? <span className="max-w-full truncate text-[11px] text-neutral-500">{value}</span> : null}</div>;
}

function Repeat({ title, items, kind, textarea = false, onAdd, onUpdate, onRemove }){
  return <div className="grid gap-3"><div className="flex items-center justify-between gap-3"><h3 className="text-lg font-semibold">{title}</h3><Button tone="light" onClick={() => onAdd(kind)}>Add item</Button></div>{items.map((item, index) => <div key={index} className="grid gap-2 md:grid-cols-[1fr_auto]">{textarea ? <TextArea value={item} onChange={event => onUpdate(kind, index, event.target.value)} /> : <TextInput value={item} onChange={event => onUpdate(kind, index, event.target.value)} />}<Button tone="danger" onClick={() => onRemove(kind, index)}>Remove</Button></div>)}</div>;
}
