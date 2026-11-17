import Flutter from "@/components/Flutter";
import Pavilion from "@/components/Pavilion";
import { aboutText, CONTACTS } from "@/lib/about";
import { CRITERIA } from "@/lib/content";
import { getContext } from "@/lib/session";

/** Small drawn icons for the two contact buttons: a baby-blue cake and a slice of kiwi. */
const Icon = ({ kind }: { kind: "cake" | "kiwi" }) =>
  kind === "cake" ? (
    <svg className="ico" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect x="5" y="16" width="22" height="11" rx="3" fill="#fff6e9" />
      <path d="M5 19 q2.75 3 5.5 0 t5.5 0 t5.5 0 t5.5 0 V17 a3 3 0 0 0 -3 -3 H8 a3 3 0 0 0 -3 3Z" fill="#7cc4ee" />
      <rect x="9" y="9" width="14" height="6" rx="2.5" fill="#a9daf6" />
      <path d="M16 9 V5" stroke="#5b2940" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="16" cy="4" r="2.2" fill="#ff7fa8" />
      <rect x="3" y="26" width="26" height="3" rx="1.5" fill="#ffffff" />
    </svg>
  ) : (
    <svg className="ico" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="13" fill="#8a5a3a" />
      <circle cx="16" cy="16" r="11.2" fill="#9ccc3c" />
      <circle cx="16" cy="16" r="7.5" fill="#c3e36b" />
      <circle cx="16" cy="16" r="3" fill="#fbf7d8" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((d) => (
        <ellipse key={d} cx="16" cy="10.4" rx="0.8" ry="1.5" fill="#2b2118" transform={`rotate(${d} 16 16)`} />
      ))}
    </svg>
  );

export default async function About() {
  const { lang } = await getContext();
  const a = aboutText(lang);
  return (
    <div className="pav">
    <Flutter />
    <div className="wrap page about">
      <header className="abouthead">
        <Pavilion />
        <p className="eyebrow">{a.eyebrow}</p>
        <h1>{a.title}</h1>
      </header>

      <section className="aboutrow" aria-labelledby="about-what">
        <h2 id="about-what">{a.whatHead}</h2>
        <div className="prose">
          {a.what.map((p) => <p key={p}>{p}</p>)}
        </div>
      </section>

      <section className="aboutrow" aria-labelledby="about-goals">
        <h2 id="about-goals">{a.goalsHead}</h2>
        <div>
          <ol className="goals">
            {a.goals.map(([head, body], i) => (
              <li key={head}>
                <span className="goalnum num" aria-hidden="true">{i + 1}</span>
                <h3>{head}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
          <p className="small muted critline">
            {a.criteriaLead} {CRITERIA.map((c) => c[lang]).join(" · ")}
          </p>
        </div>
      </section>

      <section className="aboutrow" aria-labelledby="about-stop">
        <h2 id="about-stop">{a.stopHead}</h2>
        <div>
          <p className="muted">{a.stopLede}</p>
          <ul className="stops">
            {a.stops.map(([head, body]) => (
              <li key={head}>
                <h3>{head}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ul>
          <p className="stopend">{a.stopEnd}</p>
        </div>
      </section>

    </div>

    <footer className="reach" aria-labelledby="about-contact">
      <svg className="flap" viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <polygon points="0,0 100,0 50,20" />
      </svg>
      <span className="seal" aria-hidden="true">2600</span>
      <div className="wrap reachin">
        <div>
          <h2 id="about-contact">{a.contactHead}</h2>
          <p>{a.contactLede}</p>
          <details className="fb">
            <summary className="btn">✉ {a.feedback}</summary>
            <p className="small">{a.feedbackSoon}</p>
          </details>
        </div>
        <ul className="people">
          {CONTACTS.map((c) => (
            <li key={c.name}>
              <a className={`btn who ${c.icon}`} href={c.url} rel="noopener"><Icon kind={c.icon} />{c.name} {a.contactOn}</a>
              <span className="small">{c.role[lang]}</span>
            </li>
          ))}
        </ul>
      </div>
    </footer>
    </div>
  );
}
