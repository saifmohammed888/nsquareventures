import { useMemo, useState } from 'react';
import { Layout, useContent } from '../components/Public';

const assetUrl = url => /^(https?:\/\/|\/)/i.test(url || '') ? url : `/${url}`;

function projectImages(project){
  const additional = Array.isArray(project.secondaryImages) ? project.secondaryImages : [];
  return [project.image, ...additional, project.secondaryImage]
    .filter(Boolean)
    .filter((image, index, list) => list.indexOf(image) === index)
    .map((image, index) => ({ image: assetUrl(image), project, index }));
}

export default function Gallery(){
  const { data, error } = useContent();
  const [tab, setTab] = useState('ongoing');
  const images = useMemo(() => (data?.projects || [])
    .filter(project => tab === 'all' || project.status !== 'completed')
    .flatMap(projectImages), [data, tab]);

  return <Layout title="Gallery" active="Gallery">
    <section className="ns-gallery-heading">
      <p className="ns-overline">Project gallery</p>
      <h1>Images from<br />our work.</h1>
      <p>Browse project imagery across N Square Ventures.</p>
    </section>
    <section className="ns-gallery" aria-label="Project image gallery">
      <div className="ns-gallery-tabs" role="tablist" aria-label="Gallery filter">
        <button type="button" role="tab" aria-selected={tab === 'ongoing'} onClick={() => setTab('ongoing')}>Ongoing Projects</button>
        <button type="button" role="tab" aria-selected={tab === 'all'} onClick={() => setTab('all')}>All Projects</button>
      </div>
      {!data ? <p className="ns-gallery-state">{error || 'Loading gallery…'}</p> : <div className="ns-gallery-grid">
        {images.map(({ image, project, index }) => <a key={`${project.slug}-${image}`} href={`/works/${project.slug}`} className="ns-gallery-item" aria-label={`View ${project.name}`}>
          <img src={image} alt={`${project.name}${index ? ' — additional view' : ''}`} loading="lazy" />
          <span>{project.name}</span>
        </a>)}
        {!images.length && <p className="ns-gallery-state">No images are available for this selection.</p>}
      </div>}
    </section>
  </Layout>;
}
