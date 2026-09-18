const header = document.querySelector('.site-header');
addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 40), { passive: true });
document.querySelector('.menu').addEventListener('click', () => alert('Navigation coming soon.'));
