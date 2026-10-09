import { Layout, useContent } from '../components/Public';

const address = '465, 2nd Main Rd, opposite to TVS Service Centre, 3rd Block, HBR Layout, Bengaluru, Karnataka 560043';
const mapUrl = 'https://www.google.com/maps/place/N+Square/@13.0264548,77.588248,14z/data=!4m10!1m2!2m1!1s465,+2nd+Main+Rd,+opposite+to+TVS+Service+Centre,+3rd+Block,+HBR+Layout,+Bengaluru,+Karnataka+560043!3m6!1s0x3bae1707cde8a947:0x1e2781d4000ee764!8m2!3d13.0264548!4d77.6263568!15sCmQ0NjUsIDJuZCBNYWluIFJkLCBvcHBvc2l0ZSB0byBUVlMgU2VydmljZSBDZW50cmUsIDNyZCBCbG9jaywgSEJSIExheW91dCwgQmVuZ2FsdXJ1LCBLYXJuYXRha2EgNTYwMDQzIgOIAQGSARFhcmNoaXRlY3R1cmVfZmlybeABAA!16s%2Fg%2F11fk1kql1x?entry=ttu&g_ep=EgoyMDI2MTAwNS4wIKXMDSoASAFQAw%3D%3D';
const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(`N Square Architects, ${address}`)}&output=embed`;

export default function Contact() {
  const { data } = useContent();
  const hero = data?.pageHeroes?.contact;
  return (
    <Layout title="Contact" active="Contact">
      <main className="ns-contact">
        <section className="ns-contact-hero">
          <div className="ns-contact-hero-copy">
            <p className="ns-overline">{hero?.eyebrow || 'Let’s connect'}</p>
            <h1>{(hero?.title || 'Let’s build\nwhat’s next.').split('\n').map((line, index) => <span key={line}>{index > 0 && <br />}{line}</span>)}</h1>
            <p className="ns-contact-intro">{hero?.copy || 'Whether you’re planning a new home, exploring a development, need elevation design support, or want to discuss a collaboration — start the conversation here.'}</p>
            <p className="ns-page-keywords">{hero?.keywords || 'People · Plans · Places · Possibilities'}</p>
          </div>

          <div className="ns-contact-hero-image">
            <iframe
              title="N Square Architects location"
              src={mapEmbedUrl}
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

        </section>

        <section className="ns-contact-main" aria-label="Contact N Square Ventures">
          <aside className="ns-contact-details">
            <p className="ns-overline">Contact details</p>

            <div className="ns-contact-detail">
              <span>Call</span>
              <a href="tel:+919844144753">+91 98441 44753</a>
            </div>

            <div className="ns-contact-detail">
              <span>Email</span>
              <a href="mailto:nquareventures@gmail.com">nquareventures@gmail.com</a>
            </div>

            <div className="ns-contact-detail">
              <span>Office</span>
              <address>{address}</address>
              <a className="ns-map-link" href={mapUrl} target="_blank" rel="noreferrer">
                Open in Google Maps <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="ns-contact-detail">
              <span>Office hours</span>
              <p>10 am–7 pm</p>
            </div>
          </aside>

          <form className="ns-contact-form" data-contact-form data-whatsapp-number="919844144753">
            <div className="ns-contact-form-heading">
              <p className="ns-overline">Project enquiry</p>
              <h2>Tell us about your project.</h2>
            </div>

            <div className="ns-contact-fields">
              <label>
                <span>Your name</span>
                <input name="name" type="text" autoComplete="name" required />
              </label>
              <label>
                <span>Email address</span>
                <input name="email" type="email" autoComplete="email" required />
              </label>
              <label>
                <span>Phone number</span>
                <input name="phone" type="tel" autoComplete="tel" required />
              </label>
              <label>
                <span>Project type</span>
                <select name="projectType" defaultValue="">
                  <option value="" disabled>Select a project type</option>
                  <option>Villa / Residence</option>
                  <option>Apartment</option>
                  <option>Commercial</option>
                  <option>School / Institutional</option>
                  <option>Interior</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="ns-contact-message">
                <span>Project details</span>
                <textarea name="message" rows="5" required />
              </label>
            </div>

            <button className="ns-contact-submit" type="submit">
              Continue on WhatsApp <span aria-hidden="true">→</span>
            </button>
            <p className="ns-contact-form-note">
              This opens a prefilled WhatsApp message for you to review and send.
            </p>
          </form>
        </section>

      </main>
    </Layout>
  );
}
