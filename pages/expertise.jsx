import { ContactCTA, Layout, useContent } from '../components/Public';

const assetUrl = url => /^(https?:\/\/|\/)/i.test(url || '') ? url : `/${url}`;

function PeopleSection({ title, eyebrow, people, variant = '', intro }) {
  return (
    <section className="ns-office-section">
      <div className="ns-office-section-head">
        <div>
          <p className="ns-overline">{eyebrow}</p>
          <h2>{title}</h2>
        </div>
        <p>{intro || (title === 'Associates'
          ? 'A trusted group of specialist partners who add technical depth and practical insight to each project.'
          : 'The people who support design development, coordination and delivery across every project.')}</p>
      </div>

      {people.length ? (
        <div className={`ns-office-people-grid ${variant}`}>
          {people.map((person, index) => (
            <article className="ns-office-person-card" key={person.id}>
              <span className="ns-office-person-number">{String(index + 1).padStart(2, '0')}</span>
              {person.image ? <img src={assetUrl(person.image)} alt={person.name} loading="lazy" /> : variant.includes('staff') && <div className="ns-office-person-illustration" aria-hidden="true"><svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="21" r="10"/><path d="M14 54c2-11 9-17 18-17s16 6 18 17"/></svg></div>}
              <div className="ns-office-person-content">
                <h3>{person.name}</h3>
                <p className="ns-office-role">{person.role}</p>
                {person.category && <p className="ns-office-category">{person.category}</p>}
                {person.bio && <p className="ns-office-bio">{person.bio}</p>}
                {person.link && <a href={person.link} target="_blank" rel="noopener noreferrer">Visit website <span aria-hidden="true">↗</span></a>}
                {person.contact && <small>{person.contact}</small>}
              </div>
            </article>
          ))}
        </div>
      ) : <p className="ns-office-empty">Team information will be shared here.</p>}
    </section>
  );
}

export default function Office() {
  const { data, error } = useContent();
  const heroProject = data?.projects?.[0];

  return (
    <Layout title="Office" active="Office">
      <section className="ns-page-hero ns-office-page-hero">
        <div className="ns-page-copy">
          <div className="ns-overline">People · Practice · Perspective</div>
          <h1>Office.</h1>
          <p>{data?.home.introduction || 'N Square Ventures brings together design thinking, technical knowledge and on-ground experience to deliver spaces made for real life.'}</p>
          <div className="ns-page-keywords">Associates · Staff · Design · Delivery</div>
        </div>
        <div className="ns-page-image">
          {heroProject?.image && <img src={assetUrl(heroProject.image)} alt={heroProject.name} />}
        </div>
      </section>

      {data ? <>
        <PeopleSection title="Associates" eyebrow="Office" people={data.associates} variant="ns-office-associates-grid" />
        <PeopleSection title="Staff" eyebrow="N Square Ventures" people={data.staff} variant="ns-office-staff-grid" intro="The in-house team supporting planning, interiors, drawings, coordination and project delivery." />
      </> : <p className="ns-heading" role="status">{error || 'Loading the office…'}</p>}
      <ContactCTA />
    </Layout>
  );
}
