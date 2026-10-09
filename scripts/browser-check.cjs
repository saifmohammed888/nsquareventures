const {chromium}=require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch({headless:true,channel:'chrome'});const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 fs.mkdirSync('test-results',{recursive:true});
 for(const route of ['/','/projects','/expertise','/project-detail?project=ravine-villa','/contact','/presentation']){
  await page.goto('http://localhost:3001'+route);await page.waitForTimeout(2200);
  if(route!=='/presentation'){await page.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=700){scrollTo(0,y);await new Promise(r=>setTimeout(r,100));}scrollTo(0,0);});await page.waitForTimeout(600);}
  console.log('layout',route,await page.evaluate(()=>({overflow:document.documentElement.scrollWidth>innerWidth,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth&&i.getAttribute('src')).map(i=>i.getAttribute('src'))})));
  await page.screenshot({path:'test-results/'+(route==='/'?'home':route.split('?')[0].slice(1))+'.png',fullPage:true});
  console.log(route,await page.title(), await page.locator('h1').allTextContents(),await page.locator('nav[aria-label="Primary"] a').allTextContents());
 }
 await page.goto('http://localhost:3001/projects');await page.getByPlaceholder('Search project names…').fill('ravine');await page.waitForTimeout(500);console.log('search count',await page.locator('.ns-work').count());
 await page.getByRole('button',{name:'Commercial',exact:true}).click();console.log('combined empty',await page.getByText('No works match', {exact:false}).count());
 await page.getByRole('button',{name:'Reset',exact:true}).click();console.log('reset count',await page.locator('.ns-work').count());
 await page.setViewportSize({width:390,height:844});
 for(const route of ['/','/projects','/expertise']){await page.goto('http://localhost:3001'+route);await page.waitForTimeout(1500);console.log('mobile overflow',route,await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));await page.screenshot({path:'test-results/mobile-'+(route==='/'?'home':route.slice(1))+'.png',fullPage:true});}
 console.log('PAGE_ERRORS',errors);await browser.close();if(errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
