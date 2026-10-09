const {
  authorized,
  defaultContent,
  normalizeContent,
  readStoredContent,
  writeDatabaseContent
} = require('../../lib/content-store');
const { migrate, publicContent } = require('../../lib/content-model');

export default async function handler(req, res){
  if(req.method === 'GET'){
    res.setHeader('Cache-Control', 'no-store');
    if(req.headers['x-cms-password'] && !authorized(req)) return res.status(401).json({error:'Unauthorized'});
    try{
      const storedContent = await readStoredContent();
      const content = migrate(storedContent || defaultContent());
      return res.status(200).json(authorized(req) ? content : publicContent(content));
    }catch(error){
      return res.status(503).json({error:'Content is temporarily unavailable.'});
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
