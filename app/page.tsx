"use client";

import { useEffect, useRef, useState } from "react";

type Section = "intro" | "about" | "research" | "beyond";
type ResearchItem = { title: string; status: string; summary: string; authors?: string[]; link?: string; linkLabel?: string; image?: string; imageAlt?: string };

const navigation: { id: Section; label: string }[] = [
  { id: "about", label: "About" },
  { id: "research", label: "Research" },
  { id: "beyond", label: "Beyond" },
];

const selected: ResearchItem[] = [
  {
    title: "From Citations to Evidence: Citation Provenance in Citation-Supported AI Answers",
    status: "Under review",
    authors: ["Yuxuan Du", "Phongsakon Konrad", "Shuai Ma", "Qiao Jin", "Xinru Wang", "Zhuoran Lu"],
    image: "/research/citation.webp",
    imageAlt: "Paper teaser showing citation-supported AI answers and the provenance of their underlying evidence",
    summary: "Multiple citations in an AI answer do not necessarily represent independent underlying evidence. This project traces their provenance to the underlying evidence and examines how making citation dependence visible shapes users’ judgments.",
  },
  {
    title: "Fact-check Your Information (FYI): A Design Probe to Understand How People Actually Fact-check Data-Driven Articles",
    status: "IEEE TVCG, in press · IEEE VIS 2026",
    authors: ["Nguyen-Truong Thinh*", "Yuxuan Du*", "Phongsakon Mark Konrad", "Arpit Narechania"],
    image: "/research/fyi.webp",
    imageAlt: "FYI design probe with claim detection, AI chat, automated checks, table inspection, and visualization",
    summary: "FYI is an interactive design probe for studying how people fact-check data-driven claims using AI chat, visualization, automated checks, and table inspection. Through user studies, we examine how readers combine these tools when verifying claims and calibrating trust.",
    link: "https://fyi.datavisards-hkust.workers.dev/",
    linkLabel: "Project",
  },
  {
    title: "Who Chooses How Preferences Are Aggregated? Auditing Aggregation-Rule Authority in LLM-Based Group Recommendation",
    status: "Under review · arXiv:2608.23966",
    authors: ["Yuxuan Du"],
    image: "/research/group-authority.webp",
    imageAlt: "Conceptual illustration of different users' preferences and three possible sources of aggregation-rule authority: users, model, or unspecified",
    summary: "Group recommendations require some way of combining different users’ preferences. This project examines how LLMs behave when authority to choose that rule is left unspecified, retained by users, or delegated to the model.",
    link: "https://arxiv.org/abs/2608.23966",
    linkLabel: "Preprint",
  },
  {
    title: "What Personalized Agents Make Visible: A Diagnostic Framework for AI-Mediated Judgment",
    status: "UbiComp/ISWC 2026 Reality Mediation Workshop · UbiComp Companion",
    authors: ["Yuxuan Du", "Shuai Ma", "Zhuoran Lu"],
    image: "/research/personalized-evidence.webp",
    imageAlt: "Conceptual illustration of two users viewing partly shared and partly distinct evidence through overlapping personalized panes",
    summary: "Personalized agents can shape which evidence users encounter on the path to a recommendation. This work develops a diagnostic framework for examining how personalization affects evidence visibility and shared ground across users.",
  },
];

const ongoing: ResearchItem[] = [
  {
    title: "Grounded LLM Verification and Evaluation",
    status: "Manuscript in preparation",
    summary: "How do evidence access, source-use rules, and citation requirements shape LLM verification outcomes?",
  },
  {
    title: "Scope Fidelity in LLM-Assisted Refinement",
    status: "Work in progress",
    summary: "When users ask an LLM to refine text, does it keep substantive changes within the scope they authorized, or introduce broader changes of its own?",
  },
  {
    title: "HelpfulWidgets: AI-Enhanced Interface Widgets",
    status: "Early-stage project",
    summary: "How can generative AI adapt existing interface widgets to users’ immediate needs while keeping the enhancement connected to the original interface and its functionality?",
  },
];

const earlier: ResearchItem[] = [
  {
    title: "Impact of Cognitive Biases on Environmental Compliance Risk Perceptions in International Construction Projects",
    status: "Frontiers in Psychology, 2024",
    authors: ["Tengyuan Chang", "Yuxuan Du", "Xiaopeng Deng", "Xianru Wang"],
    summary: "Cognitive biases can shape how environmental-compliance risks are perceived. This work examines these judgments in international construction projects.",
    link: "https://doi.org/10.3389/fpsyg.2024.1397306",
    linkLabel: "DOI",
  },
];

function ResearchList({ items }: { items: ResearchItem[] }) {
  return (
    <div className="research-list">
      {items.map((item) => (
        <article className={`research-item${item.image ? " research-item-illustrated" : ""}`} key={item.title}>
          {item.image && <figure className="research-thumbnail"><img src={item.image} width="900" height="600" alt={item.imageAlt} loading="lazy" decoding="async" /></figure>}
          <div className="research-details">
            <h3>{item.title}</h3>
            {item.authors && <p className="research-authors">{item.authors.map((author, index) => <span key={author}>{index > 0 && ", "}{author.startsWith("Yuxuan Du") ? <strong>{author}</strong> : author}</span>)}</p>}
            <p className="research-status">{item.status}{item.link && <> · <a className="text-link" href={item.link} target="_blank" rel="noreferrer">{item.linkLabel}</a></>}</p>
            <p className="research-summary">{item.summary}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function ContactIcon({ type }: { type: "email" | "linkedin" | "cv" }) {
  return <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {type === "email" && <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></>}
    {type === "linkedin" && <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7.5 10v7M7.5 7v.1M11 17v-7M11 13c0-4 6-4 6 0v4" /></>}
    {type === "cv" && <><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5M9 12h6M9 16h6" /></>}
  </svg>;
}

function getSection(): Section {
  const hash = window.location.hash.slice(1);
  if (hash === "research" || hash === "publications" || hash === "experience") return "research";
  if (hash === "about" || hash === "cv") return "about";
  if (hash === "beyond") return "beyond";
  return "intro";
}

export default function Home() {
  const [section, setSection] = useState<Section>("intro");
  const content = useRef<HTMLElement>(null);

  useEffect(() => {
    const update = () => setSection(getSection());
    const frame = window.requestAnimationFrame(update);
    window.addEventListener("hashchange", update);
    window.addEventListener("popstate", update);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", update);
      window.removeEventListener("popstate", update);
    };
  }, []);

  const navigate = (next: Section) => {
    window.history.pushState(null, "", next === "intro" ? window.location.pathname : `#${next}`);
    setSection(next);
    window.scrollTo({ top: 0, behavior: "instant" });
    if (next !== "intro") window.requestAnimationFrame(() => content.current?.focus({ preventScroll: true }));
  };

  return (
    <>
      <main className="entrance" hidden={section !== "intro"}>
        <button className="entrance-surface" onClick={() => navigate("about")} aria-label="Enter Yuxuan Du’s website">
          <span className="entrance-atmosphere" aria-hidden="true" />
          <span className="entrance-tint" aria-hidden="true" />
          <img className="entrance-photo" src="/photos/entrance-1280.webp" srcSet="/photos/entrance-640.webp 640w, /photos/entrance-1280.webp 1280w" sizes="(max-width: 700px) min(88vw, 430px), min(56vw, 520px, 68svh)" width="1280" height="1920" fetchPriority="high" alt="Yuxuan Du in her graduation gown, looking back with a smile" />
          <span className="entrance-caption">
            <h1 className="entrance-title"><span className="entrance-greeting">Hi, I’m</span>{" "}<em>Yuxuan Du.</em></h1>
            <span className="entrance-focus">I study how generative AI shapes human judgment and decision-making.</span>
            <span className="entrance-action">Let’s dive in</span>
          </span>
        </button>
      </main>

      <div className="main-site" hidden={section === "intro"}>
        <a className="skip-link" href="#main-content" onClick={(event) => { event.preventDefault(); content.current?.focus(); }}>Skip to content</a>
        <aside className="identity">
          <button className="identity-portrait-link" onClick={() => navigate("intro")} aria-label="Return to the entry page"><img className="identity-photo" src="/photos/portrait-soft-640.webp" width="640" height="427" alt="Portrait of Yuxuan Du in soft natural light" decoding="async" /></button>
          <p className="identity-name">Yuxuan Du</p>
          <div className="identity-links">
            <a className="identity-email" href="mailto:yuxuan.du.sherry@gmail.com"><ContactIcon type="email" /><span>yuxuan.du.sherry@gmail.com</span></a>
            <a href="https://www.linkedin.com/in/yuxuan-du-23015338a" target="_blank" rel="noreferrer" aria-label="Yuxuan Du on LinkedIn"><ContactIcon type="linkedin" />LinkedIn</a>
            <a href="/Yuxuan_Du_Academic_CV.pdf" target="_blank" rel="noreferrer" aria-label="View Yuxuan Du’s CV"><ContactIcon type="cv" />CV</a>
          </div>
        </aside>
        <header className="site-topbar">
          <nav className="section-nav" aria-label="Main navigation">
            {navigation.map((item) => <a key={item.id} href={`#${item.id}`} onClick={(event) => { event.preventDefault(); navigate(item.id); }} aria-current={section === item.id ? "page" : undefined}>{item.label}</a>)}
          </nav>
        </header>

        <main className="content" id="main-content" ref={content} tabIndex={-1}>
          <section className="page-section about-page" hidden={section !== "about"} aria-labelledby="about-heading">
            <header className="page-heading"><h2 id="about-heading">About me</h2></header>
            <div className="about-copy">
              <p className="about-lead">I’m Yuxuan Du, an early-career researcher working at the intersection of Human–AI Interaction, AI-mediated judgment and decision-making, and LLM evaluation. Broadly, I am interested in how generative AI shapes human judgment through the information and support it provides.</p>
              <p>My work spans both human-centered and computational research:</p>
              <ul className="research-sides"><li><strong>Human side:</strong> I study how people interpret AI-generated information and decide when and how much to rely on it in judgment and decision-making.</li><li><strong>Computational side:</strong> I use evaluation and auditing to study LLM-based systems and agents, especially in settings where they provide information or decision support.</li></ul>
              <div className="opportunity"><p><strong>I am currently preparing for PhD applications for 2027 and am open to new PhD opportunities and research collaborations.</strong> If you think our research interests overlap, feel free to <a href="mailto:yuxuan.du.sherry@gmail.com">email me</a>.</p></div>
              <h3 className="education-heading">Educational background</h3>
              <p>Before this, I began doctoral study at the Hong Kong University of Science and Technology (HKUST) in 2025 as a recipient of the Hong Kong Postgraduate Scholarship. I left the program in January 2026 following a change in funding. I am now continuing my research through ongoing collaborations while preparing to reapply for PhD study.</p>
              <p>I received my Master’s degree in Management from Southeast University in 2025, with a GPA of 3.9/4.0. I completed my Bachelor’s degree in Engineering at Central South University in 2022, graduating in the top 2% of my cohort.</p>
            </div>
          </section>

          <section className="page-section research-page" hidden={section !== "research"} aria-labelledby="research-heading">
            <header className="page-heading"><h2 id="research-heading">Research</h2></header>
            <div className="research-group"><h2 className="group-heading">Selected Research</h2><ResearchList items={selected} /><p className="author-note">* Equal contribution.</p></div>
            <div className="research-group"><h2 className="group-heading">Ongoing Research</h2><ResearchList items={ongoing} /></div>
            <div className="research-group earlier-group"><h2 className="group-heading">Earlier Research</h2><ResearchList items={earlier} /></div>
          </section>

          <section className="page-section beyond-page" hidden={section !== "beyond"} aria-labelledby="beyond-heading">
            <header className="page-heading"><h2 id="beyond-heading">Beyond Research</h2></header>
            <p className="beyond-copy">Outside research, strength training and bodybuilding are a big part of my life. I’m also an NSCA-Certified Personal Trainer (NSCA-CPT). I recently started bouldering and am still very much a beginner. I also enjoy dancing, hiking, drawing, and trying new things.</p>
            <div className="photo-journal">
              <figure className="journal-bouldering"><img src="/photos/bouldering-900.webp" srcSet="/photos/bouldering-450.webp 450w, /photos/bouldering-900.webp 900w" sizes="(max-width: 700px) 44vw, 245px" width="853" height="1138" alt="Yuxuan climbing an indoor bouldering wall" loading="lazy" decoding="async" /></figure>
              <figure className="journal-dance"><img src="/photos/dance-900.webp" srcSet="/photos/dance-450.webp 450w, /photos/dance-900.webp 900w" sizes="(max-width: 700px) 44vw, 245px" width="900" height="1200" alt="Yuxuan practising dance in a studio" loading="lazy" decoding="async" /></figure>
              <figure className="journal-matcha"><img src="/photos/matcha-900.webp" srcSet="/photos/matcha-450.webp 450w, /photos/matcha-900.webp 900w" sizes="(max-width: 700px) 44vw, 245px" width="900" height="1200" alt="Yuxuan whisking matcha in a ceramic bowl" loading="lazy" decoding="async" /></figure>
              <figure className="journal-hiking"><img src="/photos/hiking-900.webp" srcSet="/photos/hiking-450.webp 450w, /photos/hiking-900.webp 900w" sizes="(max-width: 700px) 44vw, 245px" width="900" height="1200" alt="Yuxuan hiking among snow-covered trees, holding trekking poles" loading="lazy" decoding="async" /></figure>
              <figure className="journal-drawing"><img src="/photos/drawing-900.webp" srcSet="/photos/drawing-450.webp 450w, /photos/drawing-900.webp 900w" sizes="(max-width: 700px) 44vw, 245px" width="900" height="1200" alt="An open sketchbook filled with hand-drawn plants beside a pen" loading="lazy" decoding="async" /></figure>
              <figure className="journal-outdoor"><img src="/photos/outdoor-climbing-900.webp" srcSet="/photos/outdoor-climbing-450.webp 450w, /photos/outdoor-climbing-900.webp 900w" sizes="(max-width: 700px) 44vw, 245px" width="900" height="1200" alt="Yuxuan climbing an outdoor rock face under a cloudy sky" loading="lazy" decoding="async" /></figure>
            </div>
          </section>
          <footer className="site-footer"><span>© {new Date().getFullYear()} Yuxuan Du</span></footer>
        </main>
      </div>
    </>
  );
}
