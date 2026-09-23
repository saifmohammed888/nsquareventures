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
function TextInput(props){ return <input {...props} className="h-11 rounded-none border border-neutral-300 bg-white px-3 text-sm text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/10" />; }
function TextArea(props){ return <textarea {...props} className="min-h-28 rounded-none border border-neutral-300 bg-white px-3 py-3 text-sm text-black outline-none transition focus:border-black focus:ring-2 focus:ring-black/10" />; }
function Button({ tone = 'dark', className = '', ...props }){
  return <button {...props} className={cx('inline-flex h-11 items-center justify-center border px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50', tone === 'dark' && 'border-black bg-black text-white hover:bg-neutral-800', tone === 'light' && 'border-neutral-300 bg-white text-black hover:border-black', tone === 'danger' && 'border-red-700 bg-white text-red-700 hover:bg-red-50', className)} />;
}

export default function Admin(){
  const [password, setPassword] = useState('');
  const [authed, setAuthed] = useState(false);
  const [status, setStatus] = useState('Locked.');
  const [tab, setTab] = useState('projects');
  const [content, setContent] = useState({ projects: [], articles: [], site: {} });
  const [projectIndex, setProjectIndex] = useState(0);
  const [articleIndex, setArticleIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState('');
  const [raw, setRaw] = useState('');
  const [imageOptions, setImageOptions] = useState([]);

  const project = content.projects[projectIndex] || null;
  const article = content.articles[articleIndex] || null;
  const stats = useMemo(() => [['Projects', content.projects.length], ['Blogs', content.articles.length], ['Site images', Object.values(content.site || {}).filter(Boolean).length]], [content]);

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
    const next = sync({ projects: data.projects || [], articles: data.articles || [], site: data.site || {} });
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
      const response = await fetch('/api/content', { method: 'POST', headers: authHeaders({ 'content-type': 'application/json' }), body: JSON.stringify(body) });
      const data = await response.json();
      if(!response.ok) throw new Error(data.error || 'Unable to save content.');
      const saved = sync({ projects: data.content.projects || [], articles: data.content.articles || [], site: data.content.site || {} });
      setContent(saved);
      setStatus('Saved. Refresh the public site to see updates.');
    }catch(error){ setStatus(error.message); }
    finally{ setSaving(false); }
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

  async function uploadImage(target, file){
    if(!file) return;
    setUploading(target);
    setStatus(`Uploading ${file.name}...`);
    try{
      const response = await fetch(`/api/upload?filename=${encodeURIComponent(file.name)}`, { method: 'POST', headers: authHeaders({ 'content-type': file.type || 'application/octet-stream' }), body: file });
      const data = await response.json();
      if(!response.ok) throw new Error(data.error || 'Upload failed.');
      const [kind, key] = target.split('.');
      if(kind === 'project') updateProject(key, data.url);
      if(kind === 'article') updateArticle(key, data.url);
      if(kind === 'site') updateSite(key, data.url);
      await loadImages();
      setStatus('Image uploaded. Save changes when ready.');
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
      <Head><title>Nsquare CMS</title></Head>
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      <main className="min-h-screen bg-neutral-50 text-black">
        <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 px-5 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div><p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">Nsquare CMS</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Website content</h1><p className="mt-1 text-sm text-neutral-600">{status}</p></div>
            <div className="flex flex-wrap gap-2"><Button onClick={saveContent} disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</Button><Button tone="light" onClick={() => loadContent().catch(error => setStatus(error.message))}>Reload</Button><Button tone="light" onClick={logout}>Lock</Button></div>
          </div>
        </header>

        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-6 lg:grid-cols-[240px_1fr]">
          <aside className="h-max border border-neutral-200 bg-white p-3 shadow-sm lg:sticky lg:top-24">
            <nav className="grid gap-1">{['projects', 'blogs', 'images', 'raw'].map(item => <button key={item} onClick={() => setTab(item)} className={cx('px-3 py-3 text-left text-sm font-semibold capitalize', tab === item ? 'bg-black text-white' : 'bg-white text-black hover:bg-neutral-100')}>{item === 'raw' ? 'Advanced JSON' : item}</button>)}</nav>
            <div className="mt-4 grid gap-2 border-t border-neutral-200 pt-4">{stats.map(([label, value]) => <div key={label} className="flex items-center justify-between text-sm"><span className="text-neutral-500">{label}</span><b>{value}</b></div>)}</div>
          </aside>

          {tab === 'projects' && <ProjectsTab imageOptions={imageOptions} content={content} setContent={setContent} project={project} projectIndex={projectIndex} setProjectIndex={setProjectIndex} updateProject={updateProject} updateList={updateList} addListItem={addListItem} removeListItem={removeListItem} uploadImage={uploadImage} uploading={uploading} sync={sync} />}
          {tab === 'blogs' && <BlogsTab imageOptions={imageOptions} content={content} setContent={setContent} article={article} articleIndex={articleIndex} setArticleIndex={setArticleIndex} updateArticle={updateArticle} updateList={updateList} addListItem={addListItem} removeListItem={removeListItem} uploadImage={uploadImage} uploading={uploading} sync={sync} />}
          {tab === 'images' && <ImagesTab imageOptions={imageOptions} content={content} updateSite={updateSite} uploadImage={uploadImage} uploading={uploading} />}
          {tab === 'raw' && <Editor title="Advanced JSON"><p className="text-sm text-neutral-600">Use this only for debugging or bulk copy/paste edits.</p><textarea value={raw} onChange={event => setRaw(event.target.value)} spellCheck={false} className="min-h-[620px] w-full border border-neutral-300 bg-white p-4 font-mono text-xs outline-none focus:border-black" /></Editor>}
        </div>
      </main>
    </>
  );
}

function ProjectsTab({ content, setContent, project, projectIndex, setProjectIndex, updateProject, updateList, addListItem, removeListItem, uploadImage, uploading, sync, imageOptions }){
  return <section className="grid gap-5 lg:grid-cols-[340px_1fr]"><ItemList title="Projects" items={content.projects} active={projectIndex} onSelect={setProjectIndex} onAdd={() => { setContent(current => sync({ ...current, projects: [...current.projects, { ...emptyProject }] })); setProjectIndex(content.projects.length); }} label={item => item.name} sublabel={item => `${item.status || 'draft'} · ${item.location || 'No location'}`} />{project && <Editor title={project.name || 'Project'}><Preview image={project.image} title={project.name} text={project.summary} /><div className="grid gap-4 md:grid-cols-2"><Field label="Project name"><TextInput value={project.name || ''} onChange={event => updateProject('name', event.target.value)} /></Field><Field label="Slug"><TextInput value={project.slug || ''} onChange={event => updateProject('slug', event.target.value)} /></Field><Field label="Status"><select value={project.status || 'ongoing'} onChange={event => updateProject('status', event.target.value)} className="h-11 border border-neutral-300 bg-white px-3"><option value="ongoing">Ongoing</option><option value="completed">Completed</option></select></Field><Field label="Type filters"><TextInput value={project.type || ''} onChange={event => updateProject('type', event.target.value)} placeholder="villa residential" /></Field><Field label="Location"><TextInput value={project.location || ''} onChange={event => updateProject('location', event.target.value)} /></Field><Field label="Area"><TextInput value={project.area || ''} onChange={event => updateProject('area', event.target.value)} /></Field><Field label="Client / owner"><TextInput value={project.client || ''} onChange={event => updateProject('client', event.target.value)} /></Field></div><Field label="Short card summary"><TextArea rows={3} value={project.summary || ''} onChange={event => updateProject('summary', event.target.value)} /></Field><Field label="Project detail text"><TextArea rows={5} value={project.details || ''} onChange={event => updateProject('details', event.target.value)} /></Field><ImageField label="Main image" value={project.image || ''} target="project.image" uploading={uploading} onChange={value => updateProject('image', value)} onUpload={uploadImage} imageOptions={imageOptions} /><ImageField label="Second image" value={project.secondaryImage || ''} target="project.secondaryImage" uploading={uploading} onChange={value => updateProject('secondaryImage', value)} onUpload={uploadImage} imageOptions={imageOptions} /><Repeat title="Scope" items={project.scope || []} kind="scope" onAdd={addListItem} onUpdate={updateList} onRemove={removeListItem} /><Button tone="danger" onClick={() => { if(confirm('Delete this project?')) setContent(current => sync({ ...current, projects: current.projects.filter((_, i) => i !== projectIndex) })); }}>Delete project</Button></Editor>}</section>;
}

function BlogsTab({ content, setContent, article, articleIndex, setArticleIndex, updateArticle, updateList, addListItem, removeListItem, uploadImage, uploading, sync, imageOptions }){
  return <section className="grid gap-5 lg:grid-cols-[340px_1fr]"><ItemList title="Blogs" items={content.articles} active={articleIndex} onSelect={setArticleIndex} onAdd={() => { setContent(current => sync({ ...current, articles: [...current.articles, { ...emptyArticle }] })); setArticleIndex(content.articles.length); }} label={item => item.title} sublabel={item => item.category || 'No category'} />{article && <Editor title={article.title || 'Blog'}><Preview image={article.image} title={article.title} text={article.summary} /><div className="grid gap-4 md:grid-cols-2"><Field label="Title"><TextInput value={article.title || ''} onChange={event => updateArticle('title', event.target.value)} /></Field><Field label="Slug"><TextInput value={article.slug || ''} onChange={event => updateArticle('slug', event.target.value)} /></Field><Field label="Display category"><TextInput value={article.category || ''} onChange={event => updateArticle('category', event.target.value)} /></Field><Field label="Filter keywords"><TextInput value={article.categories || ''} onChange={event => updateArticle('categories', event.target.value)} /></Field><Field label="Image alt text"><TextInput value={article.alt || ''} onChange={event => updateArticle('alt', event.target.value)} /></Field></div><Field label="Short summary"><TextArea rows={3} value={article.summary || ''} onChange={event => updateArticle('summary', event.target.value)} /></Field><ImageField label="Main blog image" value={article.image || ''} target="article.image" uploading={uploading} onChange={value => updateArticle('image', value)} onUpload={uploadImage} imageOptions={imageOptions} /><ImageField label="Supporting image" value={article.secondaryImage || ''} target="article.secondaryImage" uploading={uploading} onChange={value => updateArticle('secondaryImage', value)} onUpload={uploadImage} imageOptions={imageOptions} /><Repeat title="Takeaways" items={article.takeaways || []} kind="takeaways" onAdd={addListItem} onUpdate={updateList} onRemove={removeListItem} /><Repeat title="Article paragraphs" textarea items={article.body || []} kind="body" onAdd={addListItem} onUpdate={updateList} onRemove={removeListItem} /><Button tone="danger" onClick={() => { if(confirm('Delete this blog?')) setContent(current => sync({ ...current, articles: current.articles.filter((_, i) => i !== articleIndex) })); }}>Delete blog</Button></Editor>}</section>;
}

function ImagesTab({ content, updateSite, uploadImage, uploading, imageOptions }){
  return <Editor title="Site images"><div className="grid gap-4 md:grid-cols-2">{siteImageFields.map(([key, title, help]) => <div key={key} className="border border-neutral-200 bg-white p-4"><img src={content.site[key] || ''} alt="" className="mb-4 h-48 w-full border border-neutral-200 bg-neutral-100 object-cover" /><h3 className="text-lg font-semibold">{title}</h3><p className="mb-4 mt-1 text-sm text-neutral-600">{help}</p><ImageField label="Image" value={content.site[key] || ''} target={`site.${key}`} uploading={uploading} onChange={value => updateSite(key, value)} onUpload={uploadImage} imageOptions={imageOptions} /></div>)}</div></Editor>;
}

function ItemList({ title, items, active, onSelect, onAdd, label, sublabel }){
  return <aside className="h-max border border-neutral-200 bg-white p-4 shadow-sm lg:sticky lg:top-24"><div className="mb-4 flex items-center justify-between gap-3"><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">Manage</p><h2 className="text-xl font-semibold">{title}</h2></div><Button onClick={onAdd}>Add</Button></div><div className="grid max-h-[70vh] gap-2 overflow-auto pr-1">{items.map((item, index) => <button key={`${label(item)}-${index}`} onClick={() => onSelect(index)} className={cx('grid grid-cols-[64px_1fr] gap-3 border p-2 text-left transition', active === index ? 'border-black bg-neutral-50' : 'border-neutral-200 bg-white hover:border-neutral-400')}><img src={item.image || ''} alt="" className="h-14 w-16 bg-neutral-100 object-cover" /><span><b className="block text-sm leading-tight">{label(item) || 'Untitled'}</b><span className="mt-1 block text-xs capitalize text-neutral-500">{sublabel(item)}</span></span></button>)}</div></aside>;
}

function Editor({ title, children }){
  return <section className="border border-neutral-200 bg-white p-5 shadow-sm"><div className="mb-5 border-b border-neutral-200 pb-4"><p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">Editor</p><h2 className="mt-1 text-2xl font-semibold">{title}</h2></div><div className="grid gap-5">{children}</div></section>;
}

function Preview({ image, title, text }){
  return <div className="grid gap-4 border border-neutral-200 bg-neutral-50 p-4 md:grid-cols-[220px_1fr] md:items-center"><img src={image || ''} alt="" className="h-40 w-full border border-neutral-200 bg-white object-cover md:w-[220px]" /><div><p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">Preview</p><h3 className="mt-1 text-2xl font-semibold">{title || 'Untitled'}</h3><p className="mt-2 text-sm leading-6 text-neutral-600">{text || 'Add a short summary for cards and detail pages.'}</p></div></div>;
}

function ImageField({ label, value, target, uploading, onChange, onUpload, imageOptions = [] }){
  const uploaded = imageOptions.filter(image => image.source === 'Uploaded');
  const builtin = imageOptions.filter(image => image.source !== 'Uploaded');
  function optionGroup(title, options){
    if(!options.length) return null;
    return <optgroup label={title}>{options.map(image => <option key={image.url} value={image.url}>{image.label}</option>)}</optgroup>;
  }
  return <div className="grid gap-2"><Field label={label}><TextInput value={value} onChange={event => onChange(event.target.value)} placeholder="Image path or uploaded Blob URL" /></Field><select value="" onChange={event => { if(event.target.value) onChange(event.target.value); }} className="h-11 border border-neutral-300 bg-white px-3 text-sm text-black"><option value="">{imageOptions.length ? `Choose existing image (${imageOptions.length})...` : 'No existing images loaded'}</option>{optionGroup('Uploaded to Blob', uploaded)}{optionGroup('Built-in Images folder', builtin)}</select><div className="flex flex-wrap items-center gap-2"><label className="inline-flex h-11 cursor-pointer items-center justify-center border border-neutral-300 bg-white px-4 text-sm font-semibold text-black hover:border-black">{uploading === target ? 'Uploading...' : 'Upload image'}<input type="file" accept="image/*" hidden onChange={event => onUpload(target, event.target.files?.[0])} /></label>{value ? <span className="max-w-full truncate text-xs text-neutral-500">{value}</span> : null}</div></div>;
}

function Repeat({ title, items, kind, textarea = false, onAdd, onUpdate, onRemove }){
  return <div className="grid gap-3"><div className="flex items-center justify-between gap-3"><h3 className="text-lg font-semibold">{title}</h3><Button tone="light" onClick={() => onAdd(kind)}>Add item</Button></div>{items.map((item, index) => <div key={index} className="grid gap-2 md:grid-cols-[1fr_auto]">{textarea ? <TextArea value={item} onChange={event => onUpdate(kind, index, event.target.value)} /> : <TextInput value={item} onChange={event => onUpdate(kind, index, event.target.value)} />}<Button tone="danger" onClick={() => onRemove(kind, index)}>Remove</Button></div>)}</div>;
}
