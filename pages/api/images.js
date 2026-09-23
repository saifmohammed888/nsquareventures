const fs = require('fs');
const path = require('path');
const { authorized } = require('../../lib/content-store');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif']);

function walkImages(dir, baseDir, items){
  if(!fs.existsSync(dir)) return;
  for(const entry of fs.readdirSync(dir, { withFileTypes: true })){
    const fullPath = path.join(dir, entry.name);
    if(entry.isDirectory()){
      walkImages(fullPath, baseDir, items);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if(!IMAGE_EXTENSIONS.has(ext)) continue;
    const relative = path.relative(baseDir, fullPath).split(path.sep).join('/');
    items.push({
      label: relative.replace(/^Images\//, ''),
      source: 'Built-in',
      url: relative
    });
  }
}

async function blobImages(){
  if(!process.env.BLOB_READ_WRITE_TOKEN) return [];
  const { list } = await import('@vercel/blob');
  const blobs = [];
  let cursor;
  do{
    const page = await list({ prefix: 'cms/images/', cursor, limit: 1000 });
    blobs.push(...page.blobs);
    cursor = page.cursor;
  }while(cursor);
  return blobs.map(blob => ({
    label: blob.pathname.replace(/^cms\/images\//, ''),
    source: 'Uploaded',
    url: blob.url
  }));
}

export default async function handler(req, res){
  if(req.method !== 'GET'){
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if(!authorized(req)){
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try{
    const builtin = [];
    walkImages(path.join(process.cwd(), 'public', 'Images'), path.join(process.cwd(), 'public'), builtin);
    const uploaded = await blobImages();
    return res.status(200).json({ images: [...uploaded, ...builtin] });
  }catch(error){
    return res.status(500).json({ error: error.message || 'Unable to list images.' });
  }
}
