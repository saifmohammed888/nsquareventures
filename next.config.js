/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  async redirects(){
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/projects.html', destination: '/works', permanent: true },
      { source: '/project-detail.html', destination: '/works', permanent: true },
      { source: '/journal.html', destination: '/', permanent: true },
      { source: '/journal-detail.html', destination: '/', permanent: true },
      { source: '/gallery.html', destination: '/', permanent: true },
      { source: '/expertise.html', destination: '/office', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      { source: '/admin.html', destination: '/admin', permanent: true },
      { source: '/journal', destination: '/', permanent: true },
      { source: '/journal-detail', destination: '/', permanent: true },
      { source: '/gallery', destination: '/', permanent: true },
      { source: '/projects', destination: '/works', permanent: true },
      { source: '/expertise', destination: '/office', permanent: true },
      { source: '/project-detail', destination: '/works', permanent: true }
    ];
  }
};

module.exports = nextConfig;
