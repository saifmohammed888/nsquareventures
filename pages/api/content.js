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
    const adminRequest = String(req.query?.admin || '') === '1';
    // Public pages can read filtered content without credentials.  The CMS
    // explicitly asks for an administrative read and must always authenticate.
    if((adminRequest || req.headers['x-cms-password']) && !authorized(req)) return res.status(401).json({error:'Unauthorized'});
    try{
      const storedContent = await readStoredContent();
      const content = migrate(storedContent || defaultContent());
      return res.status(200).json(authorized(req) ? content : publicContent(content));
    }catch(error){
      // The public site should remain available if an optional content store
      // (for example, a database connection) is temporarily unavailable.
      // Default content is bundled with the application and is safe to serve.
      try{
        const content = migrate(defaultContent());
        return res.status(200).json(authorized(req) ? content : publicContent(content));
      }catch(fallbackError){
        return res.status(503).json({error:'Content is temporarily unavailable.'});
      }
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
