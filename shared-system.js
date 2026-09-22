(function(){
  const triggerSelectors = ['.site-menu-trigger', '#menuOpen', '.menu-dot', '.dot'];
  const triggers = [...document.querySelectorAll(triggerSelectors.join(','))];
  const side = document.getElementById('siteSide') || document.getElementById('side');
  const scrim = document.getElementById('siteScrim') || document.getElementById('scrim');
  if(!side || !scrim || !triggers.length) return;

  function setMenu(open){
    side.classList.toggle('open', open);
    scrim.classList.toggle('open', open);
    side.setAttribute('aria-hidden', String(!open));
    triggers.forEach(trigger => trigger.setAttribute('aria-expanded', String(open)));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  triggers.forEach(trigger => {
    trigger.setAttribute('role', trigger.tagName === 'BUTTON' ? 'button' : 'button');
    trigger.setAttribute('aria-label', 'Open navigation');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', event => {
      event.preventDefault();
      setMenu(true);
    });
  });

  document.querySelectorAll('#siteMenuClose,#menuClose,.site-close').forEach(close => {
    close.addEventListener('click', () => setMenu(false));
  });
  scrim.addEventListener('click', () => setMenu(false));
  document.addEventListener('keydown', event => {
    if(event.key === 'Escape') setMenu(false);
  });
  side.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
})();
