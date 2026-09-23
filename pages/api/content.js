const {
  authorized,
  defaultContent,
  normalizeContent,
  readStoredContent,
  writeDatabaseContent
} = require('../../lib/content-store');

export default async function handler(req, res){
  if(req.method === 'GET'){
    res.setHeader('Cache-Control', authorized(req) ? 'no-store' : 'public, max-age=0, s-maxage=15, stale-while-revalidate=300');
    try{
      const storedContent = await readStoredContent();
      return res.status(200).json(storedContent || defaultContent());
    }catch(error){
      return res.status(200).json(defaultContent());
    }
  }

  if(req.method === 'POST'){
    res.setHeader('Cache-Control', 'no-store');
    if(!authorized(req)){
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try{
      const content = normalizeContent(req.body || {});
      await writeDatabaseContent(content);
      return res.status(200).json({ ok: true, content });
    }catch(error){
      return res.status(error.statusCode || 400).json({ error: error.message || 'Unable to save content.' });
    }
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
