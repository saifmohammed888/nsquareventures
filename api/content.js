const fs = require('fs');
const path = require('path');
const vm = require('vm');

const CONTENT_PATH = 'cms/content.json';

function readScriptData(file, globalName){
  const code = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
  const context = { window: {} };
  vm.runInNewContext(code, context);
  return context.window[globalName] || [];
}

function defaultContent(){
  return {
    projects: readScriptData('projects-data.js', 'NSQUARE_PROJECTS'),
    articles: readScriptData('journal-data.js', 'NSQUARE_ARTICLES'),
    site: {
      homeHeroImage: 'Images/Praveen Villa - Indiranagar.png',
      projectsHeroImage: 'Images/Elevation/Praveen Villa - Indiranagar.png',
      journalHeroImage: 'Images/wireframe.jpg',
      contactHeroImage: 'Images/Elevation/Samhitha com.png',
      processImage: 'Images/Elevation/Dr.Sudha-7.png'
    },
    updatedAt: new Date().toISOString()
  };
}

function authorized(req){
  const password = process.env.CMS_PASSWORD;
  if(!password) return false;
  return req.headers['x-cms-password'] === password;
}

async function readBlobContent(){
  if(!process.env.BLOB_READ_WRITE_TOKEN) return null;
  const { head } = await import('@vercel/blob');
  try{
    const blob = await head(CONTENT_PATH);
    const response = await fetch(blob.url, { cache: 'no-store' });
    if(!response.ok) return null;
    return await response.json();
  }catch(error){
    return null;
  }
}

async function writeBlobContent(content){
  if(!process.env.BLOB_READ_WRITE_TOKEN){
    const error = new Error('BLOB_READ_WRITE_TOKEN is not configured.');
    error.statusCode = 503;
    throw error;
  }
  const { put } = await import('@vercel/blob');
  return put(CONTENT_PATH, JSON.stringify(content, null, 2), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json'
  });
}

module.exports = async function handler(req, res){
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

  if(req.method === 'GET'){
    const blobContent = await readBlobContent();
    return res.status(200).json(blobContent || defaultContent());
  }

  if(req.method === 'POST'){
    if(!authorized(req)){
      return res.status(401).json({ error: 'Unauthorized' });
    }
    try{
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const content = {
        projects: Array.isArray(body.projects) ? body.projects : [],
        articles: Array.isArray(body.articles) ? body.articles : [],
        site: body.site && typeof body.site === 'object' ? body.site : {},
        updatedAt: new Date().toISOString()
      };
      await writeBlobContent(content);
      return res.status(200).json({ ok: true, content });
    }catch(error){
      return res.status(error.statusCode || 400).json({ error: error.message || 'Unable to save content.' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
};
