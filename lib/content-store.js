const fs = require('fs');
const path = require('path');
const vm = require('vm');

const LOCAL_CONTENT_PATH = path.join(process.cwd(), 'cms-content.local.json');
const CONTENT_ROW_ID = 'site';

function readScriptData(file, globalName){
  const publicFile = path.join(process.cwd(), 'public', file);
  const code = fs.readFileSync(publicFile, 'utf8');
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
  const password = process.env.CMS_PASSWORD || (process.env.NODE_ENV === 'development' ? 'admin123' : '');
  if(!password) return false;
  return req.headers['x-cms-password'] === password;
}

function hasDatabase(){
  return Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL || process.env.DATABASE_URL);
}

async function sqlQuery(strings, ...values){
  const { sql } = await import('@vercel/postgres');
  return sql(strings, ...values);
}

async function ensureContentTable(){
  await sqlQuery`
    CREATE TABLE IF NOT EXISTS cms_content (
      id TEXT PRIMARY KEY,
      content JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

async function readDatabaseContent(){
  if(!hasDatabase()) return null;
  await ensureContentTable();
  const result = await sqlQuery`
    SELECT content
    FROM cms_content
    WHERE id = ${CONTENT_ROW_ID}
    LIMIT 1
  `;
  return result.rows[0]?.content || null;
}

async function writeDatabaseContent(content){
  if(!hasDatabase()){
    if(process.env.VERCEL || process.env.NODE_ENV === 'production'){
      throw new Error('Database is not configured. Add DATABASE_URL or POSTGRES_URL in Vercel environment variables and redeploy.');
    }
    fs.writeFileSync(LOCAL_CONTENT_PATH, JSON.stringify(content, null, 2));
    return;
  }

  await ensureContentTable();
  await sqlQuery`
    INSERT INTO cms_content (id, content, updated_at)
    VALUES (${CONTENT_ROW_ID}, ${JSON.stringify(content)}::jsonb, NOW())
    ON CONFLICT (id)
    DO UPDATE SET content = EXCLUDED.content, updated_at = NOW()
  `;
}

async function readStoredContent(){
  const databaseContent = await readDatabaseContent();
  if(databaseContent) return databaseContent;

  if(fs.existsSync(LOCAL_CONTENT_PATH)){
    return JSON.parse(fs.readFileSync(LOCAL_CONTENT_PATH, 'utf8'));
  }

  return null;
}

function normalizeContent(body){
  return {
    projects: Array.isArray(body.projects) ? body.projects : [],
    articles: Array.isArray(body.articles) ? body.articles : [],
    site: body.site && typeof body.site === 'object' ? body.site : {},
    updatedAt: new Date().toISOString()
  };
}

module.exports = {
  authorized,
  defaultContent,
  normalizeContent,
  readStoredContent,
  writeDatabaseContent
};
