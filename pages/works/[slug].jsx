import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Carousel from '../../components/Carousel';
import { ContactCTA, Layout, useContent } from '../../components/Public';

const assetUrl = url => /^(https?:\/\/|\/)/i.test(url || '') ? url : `/${url}`;

function projectImages(project){
  const additionalImages = Array.isArray(project.secondaryImages) ? project.secondaryImages : [];
  return [project.image, ...additionalImages, project.secondaryImage]
    .filter(Boolean)
    .filter(image => image === project.image || !/wireframe|signature|architect-|favicon|logo/i.test(image))
    .filter((image, index, list) => list.indexOf(image) === index)
    .map((image, index) => ({ image: assetUrl(image), alt: `${project.name}${index ? ' — additional view' : ''}` }));
}

function ImageLightbox({ images, initialIndex, onClose }){
  const [index, setIndex] = useState(initialIndex);
  const item = images[index];
  const move = amount => setIndex(current => (current + amount + images.length) % images.length);
  useEffect(() => {
    const keydown = event => {
      if(event.key === 'Escape') onClose();
      if(event.key === 'ArrowLeft') move(-1);
      if(event.key === 'ArrowRight') move(1);
    };
    document.addEventListener('keydown', keydown);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', keydown); document.body.style.overflow = ''; };
  }, [images.length, onClose]);
  return <div className="ns-lightbox" role="dialog" aria-modal="true" aria-label="Fullscreen project image">
    <button type="button" className="ns-lightbox-close" onClick={onClose} autoFocus aria-label="Close fullscreen image">Close ×</button>
    {images.length > 1 && <button type="button" className="ns-lightbox-prev" onClick={() => move(-1)} aria-label="Previous image">←</button>}
    <img src={item.image} alt={item.alt} />
    {images.length > 1 && <button type="button" className="ns-lightbox-next" onClick={() => move(1)} aria-label="Next image">→</button>}
    {images.length > 1 && <p className="ns-lightbox-count" aria-live="polite">{index + 1} / {images.length}</p>}
  </div>;
}

function ProjectDetails({ project, previous, next }) {
  const images = projectImages(project);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  return <>
    <section className="ns-project-detail-hero">
      <div className="ns-project-detail-copy">
        <p className="ns-overline">Selected project</p>
        <h1>{project.name}</h1>
        <p>{project.location}</p>
        <a href="/works" className="ns-back-link">← Back to Works</a>
        <nav className="ns-project-neighbours" aria-label="Adjacent projects">
          {previous ? <a href={`/works/${previous.slug}`}>← Previous <span>{previous.name}</span></a> : <span />}
          {next ? <a href={`/works/${next.slug}`}>Next <span>{next.name}</span> →</a> : <span />}
        </nav>
        <p className="ns-overline">Project overview</p>
        <p className="ns-project-detail-summary">{project.details || project.summary || 'Project information will be added shortly.'}</p>
        <dl className="ns-project-facts">
          <div><dt>Location</dt><dd>{project.location || '—'}</dd></div>
          <div><dt>Area</dt><dd>{project.area || '—'}</dd></div>
          <div><dt>Status</dt><dd>{project.status || 'Ongoing'}</dd></div>
          {project.client && <div><dt>Client</dt><dd>{project.client}</dd></div>}
        </dl>
        {project.scope?.length > 0 && <div className="ns-project-scope"><p className="ns-overline">Scope of work</p><ul>{project.scope.map(item => <li key={item}>{item}</li>)}</ul></div>}
      </div>
      <div className="ns-project-image-stack"><Carousel slides={images} controls={images.length > 1} duration={3} transition={0.6} fit="contain" sizes="(max-width: 760px) 100vw, 50vw" onImageClick={(_, index) => setLightboxIndex(index)} /></div>
    </section>
    {lightboxIndex !== null && <ImageLightbox images={images} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />}
  </>;
}

export default function WorkDetail() {
  const router = useRouter();
  const { data, error } = useContent();
  const projects = data?.projects || [];
  const projectIndex = projects.findIndex(item => item.slug === router.query.slug);
  const project = projectIndex >= 0 ? projects[projectIndex] : null;
  const previous = projectIndex > 0 ? projects[projectIndex - 1] : null;
  const next = projectIndex >= 0 && projectIndex < projects.length - 1 ? projects[projectIndex + 1] : null;

  return <Layout title={project?.name || 'Project'} active="Works">
    {!router.isReady || !data ? <p className="ns-project-state">{error || 'Loading project…'}</p> : project ? <ProjectDetails project={project} previous={previous} next={next} /> : <section className="ns-project-state"><h1>Project not found.</h1><a href="/works">Back to Works</a></section>}
    <ContactCTA />
  </Layout>;
}
