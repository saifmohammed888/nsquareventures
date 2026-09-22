/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  async redirects(){
    return [
      { source: '/index.html', destination: '/', permanent: true },
      { source: '/projects.html', destination: '/projects', permanent: true },
      { source: '/project-detail.html', destination: '/project-detail', permanent: true },
      { source: '/journal.html', destination: '/journal', permanent: true },
      { source: '/journal-detail.html', destination: '/journal-detail', permanent: true },
      { source: '/expertise.html', destination: '/expertise', permanent: true },
      { source: '/contact.html', destination: '/contact', permanent: true },
      { source: '/admin.html', destination: '/admin', permanent: true }
    ];
  }
};

module.exports = nextConfig;
