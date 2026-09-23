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
    media: [],
    site: {
      homeHeroImage: 'Images/Praveen Villa - Indiranagar.png',
      homeProcessImage: 'Images/Elevation/Dr.Sudha-7.png',
      homeProcessSketchImage: 'Images/wireframe.jpg',
      navigationMenuImage: 'Images/wireframe.jpg',
      projectsHeroImage: 'Images/Elevation/Praveen Villa - Indiranagar.png',
      projectsArtImage: 'Images/wireframe.jpg',
      journalHeroImage: 'Images/wireframe.jpg',
      contactHeroImage: 'Images/Elevation/Samhitha com.png',
      expertiseSignatureImage: 'Images/signature-nadeem.svg',
      expertiseArchitectImage: 'Images/architect-nadeem-studio.png',
      expertiseQuoteBackgroundImage: 'Images/WhatsApp Image 2026-09-18 at 7.12.32 PM.jpeg',
      expertiseQuoteAccentImage: 'Images/Sayeed Apartment - Yaseen Nagar.png',
      serviceArchitectureImage: 'Images/wireframe.jpg',
      serviceElevationImage: 'Images/Elevation/Praveen Villa - Indiranagar.png',
      serviceApprovalsImage: 'Images/Elevation/Trillium School.png',
      serviceConstructionImage: 'Images/Elevation/jaleel Complex RT Nagar.png',
      elevationQuoteBackgroundImage: 'Images/WhatsApp Image 2026-09-18 at 7.12.31 PM.jpeg',
      elevationProcessSketchImage: 'Images/wireframe.jpg',
      elevationProcessDevelopmentImage: 'Images/Elevation/Dr.Sudha-7.png',
      elevationProcessFinalImage: 'Images/Elevation/Praveen Villa - Indiranagar.png',
      elevationSelectedImage1: 'Images/Elevation/Praveen Villa - Indiranagar.png',
      elevationSelectedImage2: 'Images/Elevation/jaleel Complex RT Nagar.png',
      elevationSelectedImage3: 'Images/Elevation/Farooq Apartment HBR.png',
      elevationSelectedImage4: 'Images/Elevation/Samhitha com.png',
      elevationSelectedImage5: 'Images/Elevation/Reddy Commercial.png'
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
    projects: Array.isArray(body.projects) ? body.projects.map(project => ({
      ...project,
      status: String(project.status || '').toLowerCase() === 'completed' ? 'completed' : 'ongoing'
    })) : [],
    articles: Array.isArray(body.articles) ? body.articles : [],
    media: Array.isArray(body.media) ? body.media : [],
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
