import { useState } from 'react';
import Carousel from '../components/Carousel';
import { Layout, ContactCTA, useContent } from '../components/Public';

const assetUrl = url => /^(https?:\/\/|\/)/i.test(url || '') ? url : `/${url}`;

function ProjectCard({ project }) {
  const slides = [project.image, ...(project.secondaryImages || [])]
    .filter(Boolean)
    .filter(image => image === project.image || !/wireframe|signature|architect-|favicon|logo/i.test(image))
    .filter((image, index, list) => list.indexOf(image) === index)
    .map((image, index) => ({ image: assetUrl(image), alt: `${project.name}${index ? ' — additional view' : ''}` }));
  const description = project.summary || project.details;

  return (
    <article className="ns-work">
      <a className="ns-work-card-link" href={`/works/${project.slug}`} aria-label={`View ${project.name} project details`}>
        <Carousel slides={slides} controls={false} duration={6} transition={0.6} />
        <div className="ns-work-details">
          <h2>{project.name}</h2>
          <p className="ns-work-location">{project.location}</p>
          {description && <p className="ns-work-summary">{description}</p>}
          <dl>
            <div><dt>Area</dt><dd>{project.area || '—'}</dd></div>
            <div><dt>Status</dt><dd>{project.status || 'Ongoing'}</dd></div>
            {project.client && <div><dt>Client</dt><dd>{project.client}</dd></div>}
          </dl>
          <span className="ns-work-link">View project <span aria-hidden="true">→</span></span>
        </div>
      </a>
    </article>
  );
}

export default function Works() {
  const { data, error } = useContent();
  const [tag, setTag] = useState('');
  const [search, setSearch] = useState('');
  const projects = (data?.projects || []).filter(project =>
    (!tag || project.tagIds.includes(tag)) && project.name.toLowerCase().includes(search.trim().toLowerCase())
  );
  const hero = data?.pageHeroes?.works;

  return (
    <Layout title="Works" active="Works">
      <section className="ns-page-hero">
        <div className="ns-page-copy">
          <div className="ns-overline">{hero?.eyebrow || 'Selected projects'}</div>
          <h1>{hero?.title || 'Works.'}</h1>
          <p>{hero?.copy || 'Our work spans villas, residences, commercial buildings, apartments and schools in Bengaluru and across Karnataka. Project dimensions and current status are shown below.'}</p>
          <div className="ns-page-keywords">{hero?.keywords || 'Villas · Residences · Commercial · Institutions'}</div>
        </div>
        <div className="ns-page-image">
          {(hero?.image || data?.projects?.[1]?.image) && <img src={assetUrl(hero?.image || data.projects[1].image)} alt={hero?.title || data.projects[1]?.name || 'N Square Ventures work'} />}
        </div>
      </section>

      <section className="ns-filters" aria-label="Filter works">
        <input type="search" aria-label="Search project names" placeholder="Search project names…" value={search} onChange={event => setSearch(event.target.value)} />
        <div className="ns-tags">
          {[{ id: '', name: 'All' }, ...(data?.tags || [])].map(item => (
            <button key={item.id} aria-pressed={tag === item.id} onClick={() => setTag(item.id)}>{item.name}</button>
          ))}
        </div>
        <span role="status">{data ? `${projects.length} works` : error || 'Loading works…'}</span>
      </section>

      <section className="ns-works">
        {projects.map(project => <ProjectCard key={project.slug} project={project} />)}
        {data && !projects.length && <p className="ns-empty">No works match this selection. Clear your search or choose another tag.</p>}
      </section>
      <ContactCTA />
    </Layout>
  );
}
