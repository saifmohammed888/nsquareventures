// Additive v2 migration. Stable tag IDs preserve relationships across renames.
const slug = value => String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'tag';
const visible = record => record.published !== false && record.private !== true && record.status !== 'draft';
const imagePath = value => typeof value === 'string' && (/^(https?:\/\/|\/?Images\/|\/uploads\/)/i.test(value)) ? value : '';
const principal = value => typeof value === 'string' ? value.replace(/Principal Architect/g, 'Principal Designer') : value;
const contactHeading = value => typeof value === 'string' && /^let['’]s buildwhat['’]s next\.$/i.test(value.trim()) ? value.replace(/buildwhat/i, 'build\nwhat') : value;
const introduction = 'N Square Ventures works across architecture, interiors and construction, bringing spatial design, material choices and execution into a connected process. The practice approaches each project through its context, everyday use and the relationship between the overall idea and its details.';
const pageHeroes = {
  works: { eyebrow:'Selected projects', title:'Works.', copy:'Our work spans villas, residences, commercial buildings, apartments and schools in Bengaluru and across Karnataka. Project dimensions and current status are shown below.', keywords:'Villas · Residences · Commercial · Institutions', image:'Images/Elevation/Praveen Villa - Indiranagar.png' },
  office: { eyebrow:'People · Practice · Perspective', title:'Office.', copy:introduction, keywords:'Associates · Staff · Design · Delivery', image:'Images/architect-nadeem-studio.png' },
  contact: { eyebrow:'Let’s connect', title:'Let’s build\nwhat’s next.', copy:'Whether you’re planning a new home, exploring a development, need elevation design support, or want to discuss a collaboration — start the conversation here.', keywords:'People · Plans · Places · Possibilities' }
};
const associates = [
  ['nadeem','Mohammed Nadeem Uzamah','Principal Designer','Leading design direction, client coordination and delivery vision.','Leadership','Images/architect-nadeem-studio.png'],
  ['pralabhi','Pralabhi Associates','Structural Engineers','Structural design inputs and technical coordination.','Specialist consultants'],
  ['millennium','Millennium Pools','Pool Consultant','Swimming pool systems, specifications and execution guidance.','Specialist consultants'],
  ['puttaswamy','Puttaswamy & Company','Chartered Accountants','Accounting, taxation and financial compliance support.','Financial associates'],
  ['urban-money','Urban Money Corporate DSA','Finance & Banking','Construction finance and banking consultation.','Financial associates'],
  ['mir-zia','Mir Zia Ulla','Legal Advisor','Advocate & Notary of India.','Professional associates']
].map(([id,name,role,bio,category,image]) => ({id,name,role,bio,category,image:image || '',published:true}));

function migrate(body = {}){
  const tags = (body.tags || []).map(t => ({...t}));
  const usedProjectSlugs = new Set();
  const projects = (body.projects || []).map(p => {
    let tagIds = p.tagIds;
    if(!Array.isArray(tagIds)) tagIds = String(p.type || '').split(/\s+/).filter(Boolean).map(type => {
      let tag = tags.find(t => t.slug === slug(type));
      if(!tag){ tag = {id:`legacy-${slug(type)}`,slug:slug(type),name:type.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}; tags.push(tag); }
      return tag.id;
    });
    const secondaryImages = [...new Set([
      ...(Array.isArray(p.secondaryImages) ? p.secondaryImages : []),
      p.secondaryImage
    ].filter(imagePath))].filter(image => image !== p.image);
    const baseSlug = slug(p.slug || p.name || 'work'); let projectSlug = baseSlug, suffix = 2;
    while(usedProjectSlugs.has(projectSlug)) projectSlug = `${baseSlug}-${suffix++}`;
    usedProjectSlugs.add(projectSlug);
    return {...p, slug:projectSlug, published:p.published ?? p.status !== 'draft', tagIds:[...new Set(tagIds)].filter(id=>tags.some(t=>t.id===id)), secondaryImages, secondaryImage:secondaryImages[0] || '', details:principal(p.details), credits:principal(p.credits)};
  });
  const normalizePeople = people => people.map(p => ({...p, role:/nadeem/i.test(p.name) ? principal(p.role) : p.role, bio:/nadeem/i.test(p.name) ? principal(p.bio) : p.bio}));
  return {...body, schemaVersion:2, projects, tags, articles:body.articles || [], media:body.media || [], site:body.site || {},
    home:{introduction, slides:body.site?.homeHeroImage ? [{id:'legacy-hero',image:body.site.homeHeroImage,alt:'N Square Ventures residential design'}] : [], ...body.home},
    associates:normalizePeople(body.associates || associates),
    staff:normalizePeople(body.staff || [{id:'nabeel',name:'Mohammed Nabeel',role:'Project Architect',bio:'Architecture planning, drawings and design coordination.',published:true}]),
    pageHeroes:{...pageHeroes,...body.pageHeroes,works:{...pageHeroes.works,...body.pageHeroes?.works},office:{...pageHeroes.office,...body.pageHeroes?.office},contact:{...pageHeroes.contact,...body.pageHeroes?.contact,title:contactHeading(body.pageHeroes?.contact?.title || pageHeroes.contact.title)}},
    presentation:{enabled:true,source:'all',projectIds:[],images:[],duration:7,transition:1,fit:'contain',...body.presentation}
  };
}
function validate(body){
  const submittedSlugs = new Set();
  for(const project of body.projects || []){
    const value = String(project.slug || '').trim();
    if(!value) throw new Error(`Every work needs a URL slug. Add one for ${project.name || 'the untitled work'}.`);
    const normalized = slug(value);
    if(submittedSlugs.has(normalized)) throw new Error(`Work slugs must be unique. “${normalized}” is used more than once.`);
    submittedSlugs.add(normalized);
  }
  const data = migrate(body);
  const names = new Set(), ids = new Set(), slugs = new Set();
  data.tags.forEach(tag => {
    tag.name = String(tag.name || '').trim();
    if(!tag.name || names.has(tag.name.toLowerCase()) || !tag.id || ids.has(tag.id)) throw new Error('Tags need unique names and IDs.');
    names.add(tag.name.toLowerCase()); ids.add(tag.id);
    const base = slug(tag.name); let next = base, n=2;
    while(slugs.has(next)) next = `${base}-${n++}`;
    tag.slug = next; slugs.add(next);
  });
  for(const key of ['associates','staff']) for(const person of data[key]){
    if(!String(person.name || '').trim()) throw new Error('People records require a name.');
    if(person.link && !/^https?:\/\//i.test(person.link)) throw new Error('External links must begin with https:// or http://.');
  }
  const p = data.presentation;
  p.duration = Math.min(120,Math.max(2,Number(p.duration)||7));
  p.transition = Math.min(p.duration/2,Math.max(0,Number(p.transition)||0));
  p.fit = p.fit === 'cover' ? 'cover' : 'contain';
  p.source = ['all','projects','images'].includes(p.source) ? p.source : 'all';
  return data;
}
function publicContent(body){
  const data = migrate(body);
  const blocked = new Set(data.media.filter(m=>!visible(m)).map(m=>m.url));
  const projectImages = project => [project.image,...(Array.isArray(project.secondaryImages) ? project.secondaryImages : []),project.secondaryImage];
  const publishedImages = new Set(data.projects.filter(visible).flatMap(projectImages));
  data.projects.filter(p=>!visible(p)).flatMap(projectImages).filter(url=>url&&!publishedImages.has(url)).forEach(url=>blocked.add(url));
  const eligible = url => imagePath(url) && !blocked.has(url);
  const projects = data.projects.filter(visible).map(p=>{
    const secondaryImages = [...new Set([
      ...(Array.isArray(p.secondaryImages) ? p.secondaryImages : []),
      p.secondaryImage
    ])].filter(image => eligible(image) && image !== p.image);
    return {...p,image:eligible(p.image)?p.image:'',secondaryImages,secondaryImage:secondaryImages[0] || ''};
  });
  const tags = data.tags.filter(t=>projects.some(p=>p.tagIds.includes(t.id)));
  let slides=[];
  if(data.presentation.enabled){
    if(data.presentation.source === 'images') slides = (data.presentation.images || []).filter(s=>eligible(s.image) && !data.media.some(m=>m.url===s.image && m.presentationEligible===false));
    else slides = projects.filter(p=>p.presentationEligible!==false && (data.presentation.source==='all' || data.presentation.projectIds.includes(p.slug))).flatMap(p=>[p.image,...(p.secondaryImages || [])].filter(url=>eligible(url) && !/wireframe|signature|architect-|favicon|logo/i.test(url) && !data.media.some(m=>m.url===url && m.presentationEligible===false)).map(image=>({image,alt:p.name})));
  }
  const seen = new Set(); slides = slides.filter(s=>!seen.has(s.image) && seen.add(s.image));
  const people = list => list.filter(visible).map(p=>({...p,image:eligible(p.image)?p.image:''}));
  const site = Object.fromEntries(Object.entries(data.site).map(([key,value])=>[key,blocked.has(value)?null:value]));
  const pageHeroOutput = Object.fromEntries(Object.entries(data.pageHeroes).map(([key,hero])=>[key,{...hero,image:eligible(hero.image)?hero.image:''}]));
  return {schemaVersion:data.schemaVersion,updatedAt:data.updatedAt,site, projects,tags,articles:data.articles.filter(visible).map(a=>({...a,image:eligible(a.image)?a.image:'',secondaryImage:eligible(a.secondaryImage)?a.secondaryImage:''})),media:[], associates:people(data.associates),staff:people(data.staff),home:{...data.home,slides:data.home.slides.filter(s=>eligible(s.image))},pageHeroes:pageHeroOutput,presentation:{enabled:data.presentation.enabled,duration:data.presentation.duration,transition:data.presentation.transition,fit:data.presentation.fit,slides}};
}
module.exports = {migrate,validate,publicContent,visible,imagePath};
