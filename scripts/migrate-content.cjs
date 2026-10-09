const {readStoredContent,defaultContent,writeDatabaseContent,normalizeContent}=require('../lib/content-store');
const fs=require('node:fs');
(async()=>{
 const previous=await readStoredContent();
 if(previous){fs.mkdirSync('.content-backups',{recursive:true});fs.writeFileSync(`.content-backups/content-${Date.now()}.json`,JSON.stringify(previous,null,2),{mode:0o600});}
 await writeDatabaseContent(normalizeContent(previous||defaultContent()));
 console.log('Content migrated to v2. Existing records preserved; backup created if stored content existed.');
})().catch(e=>{console.error(e.message);process.exitCode=1;});
