import { useRouter } from 'next/router';
import Carousel from '../../components/Carousel';
import { ContactCTA, Layout, useContent } from '../../components/Public';

const assetUrl = url => /^(https?:\/\/|\/)/i.test(url || '') ? url : `/${url}`;

function ProjectDetails({ project }) {
  const images = [project.image, project.secondaryImage]
    .filter(Boolean)
    .filter(image => image === project.image || !/wireframe|signature|architect-|favicon|logo/i.test(image))
    .filter((image, index, list) => list.indexOf(image) === index)
    .map((image, index) => ({ image: assetUrl(image), alt: `${project.name}${index ? ' — additional view' : ''}` }));

  return (
    <>
      <section className="ns-project-detail-hero">
        <div className="ns-project-detail-copy">
          <p className="ns-overline">Selected project</p>
          <h1>{project.name}</h1>
          <p>{project.location}</p>
          <a href="/works" className="ns-back-link">← Back to Works</a>
          <p className="ns-overline">Project overview</p>
          <p className="ns-project-detail-summary">{project.details || project.summary || 'Project information will be added shortly.'}</p>
          <dl className="ns-project-facts">
            <div><dt>Location</dt><dd>{project.location || '—'}</dd></div>
            <div><dt>Area</dt><dd>{project.area || '—'}</dd></div>
            <div><dt>Status</dt><dd>{project.status || 'Ongoing'}</dd></div>
            {project.client && <div><dt>Client</dt><dd>{project.client}</dd></div>}
          </dl>
          {project.scope?.length > 0 && (
            <div className="ns-project-scope">
              <p className="ns-overline">Scope of work</p>
              <ul>{project.scope.map(item => <li key={item}>{item}</li>)}</ul>
            </div>
          )}
        </div>
        <div className="ns-project-image-stack"><Carousel slides={images} controls={false} duration={3} transition={0.6} /></div>
      </section>
    </>
  );
}

export default function WorkDetail() {
  const router = useRouter();
  const { data, error } = useContent();
  const project = data?.projects?.find(item => item.slug === router.query.slug);

  return (
    <Layout title={project?.name || 'Project'} active="Works">
      {!router.isReady || !data ? <p className="ns-project-state">{error || 'Loading project…'}</p> : project ? <ProjectDetails project={project} /> : <section className="ns-project-state"><h1>Project not found.</h1><a href="/works">Back to Works</a></section>}
      <ContactCTA />
    </Layout>
  );
}
