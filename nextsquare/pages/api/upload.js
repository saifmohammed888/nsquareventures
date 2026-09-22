const { authorized } = require('../../lib/content-store');

export const config = {
  api: {
    bodyParser: false
  }
};

function readBody(req){
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', chunk => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function cleanName(value){
  return String(value || 'image')
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90) || 'image';
}

export default async function handler(req, res){
  if(req.method !== 'POST'){
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if(!authorized(req)){
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if(!process.env.BLOB_READ_WRITE_TOKEN){
    return res.status(503).json({ error: 'BLOB_READ_WRITE_TOKEN is not configured.' });
  }

  try{
    const { put } = await import('@vercel/blob');
    const filename = cleanName(req.query.filename);
    const contentType = req.headers['content-type'] || 'application/octet-stream';
    const body = await readBody(req);
    const blob = await put(`cms/images/${Date.now()}-${filename}`, body, {
      access: 'public',
      contentType,
      addRandomSuffix: true
    });
    return res.status(200).json({ ok: true, url: blob.url });
  }catch(error){
    return res.status(400).json({ error: error.message || 'Upload failed.' });
  }
}
