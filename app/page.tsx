"use client";

import { useEffect, useRef, useState } from "react";

type Section = "about" | "research" | "beyond";
type ResearchItem = { title: string; status: string; summary: string; publicationGroup?: "published"; authors?: string[]; link?: string; linkLabel?: string; image?: string; imageAlt?: string };

const navigation: { id: Section; label: string }[] = [
  { id: "about", label: "About" },
  { id: "research", label: "Research" },
  { id: "beyond", label: "Beyond" },
];

const selected: ResearchItem[] = [
  {
    title: "Understanding Evidence Dependence in AI Answers",
    status: "Under review",
    authors: ["Yuxuan Du", "Phongsakon Konrad", "Shuai Ma", "Qiao Jin", "Xinru Wang", "Zhuoran Lu"],
    image: "/research/citation.webp",
    imageAlt: "Paper teaser showing citation-supported AI answers and the provenance of their underlying evidence",
    summary: "Multiple citations in an AI answer do not necessarily represent independent underlying evidence. This project traces how cited sources relate to shared evidence and examines how making these relationships visible shapes users’ judgments.",
  },
  {
    title: "Fact-check Your Information (FYI): A Design Probe to Understand How People Actually Fact-check Data-Driven Articles",
    status: "IEEE TVCG, in press · IEEE VIS 2026",
    publicationGroup: "published",
    authors: ["Nguyen-Truong Thinh*", "Yuxuan Du*", "Phongsakon Mark Konrad", "Arpit Narechania"],
    image: "/research/fyi.webp",
    imageAlt: "FYI design probe with claim detection, AI chat, automated checks, table inspection, and visualization",
    summary: "FYI is an interactive design probe for studying how people fact-check data-driven claims using AI chat, visualization, automated checks, and table inspection. Through user studies, we examine how readers combine these tools when verifying claims and calibrating trust.",
    link: "https://fyi.datavisards-hkust.workers.dev/",
    linkLabel: "Project",
  },
  {
    title: "Evidence Use in LLM Verification",
    status: "Under review",
    authors: ["Yuxuan Du", "Phongsakon Konrad", "Serkan Ayvaz"],
    image: "/research/grounded-verification.webp",
    imageAlt: "SPACE overview showing evidence visibility, evidence-use constraints, post-generation control, and the matched-contrast study design",
    summary: "Grounded LLM verification can change several parts of the evaluation setup at once, making it difficult to tell what actually drives an observed improvement. This project introduces SPACE and a matched-contrast design to separate the effects of evidence visibility, evidence-use constraints, and post-generation control.",
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
    publicationGroup: "published",
    authors: ["Yuxuan Du", "Shuai Ma", "Zhuoran Lu"],
    image: "/research/personalized-evidence.webp",
    imageAlt: "Conceptual illustration of two users viewing partly shared and partly distinct evidence through overlapping personalized panes",
    summary: "Personalized agents can shape which evidence users encounter on the path to a recommendation. This work develops a diagnostic framework for examining how personalization affects evidence visibility and shared ground across users.",
  },
];

const ongoing: ResearchItem[] = [
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

const published = selected.filter((item) => item.publicationGroup === "published");
const underReview = selected.filter((item) => item.publicationGroup !== "published");

function ResearchList({ items, onEnlarge }: { items: ResearchItem[]; onEnlarge: (item: ResearchItem) => void }) {
  return (
    <div className="research-list">
      {items.map((item) => (
        <article className={`research-item${item.image ? " research-item-illustrated" : ""}`} key={item.title}>
          {item.image && <figure className="research-thumbnail"><button type="button" className="figure-trigger" onClick={() => onEnlarge(item)} aria-label={`Enlarge research figure: ${item.title}`} aria-haspopup="dialog"><img src={item.image} width="900" height="600" alt={item.imageAlt} loading="lazy" decoding="async" /><span className="figure-zoom" aria-hidden="true"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5M3 3l6 6M21 3l-6 6M3 21l6-6M21 21l-6-6" /></svg></span></button></figure>}
          <div className="research-details">
            <h4>{item.title}</h4>
            {item.authors && <p className="research-authors">{item.authors.map((author, index) => <span key={author}>{index > 0 && ", "}{author.startsWith("Yuxuan Du") ? <strong>{author}</strong> : author}</span>)}</p>}
            <p className="research-status">{item.status}{item.link && <> · <a className="text-link" href={item.link} target="_blank" rel="noreferrer">{item.linkLabel}</a></>}</p>
            <p className="research-summary">{item.summary}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function FigurePreview({ item, onClose }: { item: ResearchItem | null; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!item) return;
    const element = dialog.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [item]);

  return <dialog ref={dialog} className="figure-dialog" aria-labelledby="figure-dialog-title" onCancel={onClose} onKeyDown={(event) => {
    if (event.key === "Tab") {
      // The close button is the figure viewer's only interactive control.
      event.preventDefault();
      dialog.current?.querySelector<HTMLButtonElement>("button")?.focus();
    }
  }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="figure-dialog-content">
      <header><h2 id="figure-dialog-title">{item?.title}</h2><button type="button" className="dialog-close" onClick={onClose} aria-label="Close enlarged figure"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6" /></svg></button></header>
      {item?.image && <img src={item.image} alt={item.imageAlt} />}
    </div>
  </dialog>;
}

function ContactIcon({ type }: { type: "email" | "linkedin" | "cv" }) {
  return <svg className="contact-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {type === "email" && <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 6 9 7 9-7" /></>}
    {type === "linkedin" && <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7.5 10v7M7.5 7v.1M11 17v-7M11 13c0-4 6-4 6 0v4" /></>}
    {type === "cv" && <><path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8zM14 3v5h5M9 12h6M9 16h6" /></>}
  </svg>;
}

function getHashSection(): Section | null {
  const hash = window.location.hash.slice(1);
  if (hash === "research" || hash === "publications" || hash === "experience") return "research";
  if (hash === "about" || hash === "cv") return "about";
  if (hash === "beyond") return "beyond";
  return null;
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>("about");
  const [enlargedFigure, setEnlargedFigure] = useState<ResearchItem | null>(null);
  const content = useRef<HTMLElement>(null);

  useEffect(() => {
    const previousScrollRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    const sections = navigation.flatMap(({ id }) => {
      const element = document.getElementById(id);
      return element ? [{ id, element }] : [];
    });
    let frame = 0;

    const updateActiveSection = () => {
      const headerBottom = document.querySelector(".site-topbar")?.getBoundingClientRect().bottom ?? 0;
      const marker = headerBottom + Math.min(100, window.innerHeight * .15);
      let current: Section = "about";
      for (const { id, element } of sections) {
        if (element.getBoundingClientRect().top <= marker) current = id;
      }
      const pageHeight = document.documentElement.scrollHeight;
      if (pageHeight > window.innerHeight && window.scrollY + window.innerHeight >= pageHeight - 2) {
        current = sections.at(-1)?.id ?? current;
      }
      setActiveSection(current);
    };

    const requestUpdate = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        updateActiveSection();
      });
    };

    const alignHash = (initial = false) => {
      const target = getHashSection();
      if (target && (initial || window.location.hash.slice(1) !== target)) {
        if (window.location.hash.slice(1) !== target) {
          window.history.replaceState(null, "", `#${target}`);
        }
        document.getElementById(target)?.scrollIntoView({ behavior: "instant" });
      }
    };

    const handleHashChange = () => {
      alignHash();
      requestUpdate();
    };

    const handlePopState = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        if (getHashSection()) alignHash(true);
        else window.scrollTo({ top: 0, behavior: "instant" });
        updateActiveSection();
      });
    };

    frame = window.requestAnimationFrame(() => {
      frame = 0;
      alignHash(true);
      updateActiveSection();
    });
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("hashchange", handleHashChange);
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.cancelAnimationFrame(frame);
      window.history.scrollRestoration = previousScrollRestoration;
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return (
      <div className="main-site">
        <a className="skip-link" href="#main-content" onClick={(event) => { event.preventDefault(); content.current?.focus(); }}>Skip to content</a>
        <aside className="identity" aria-label="Profile and contact">
          <a className="identity-portrait-link" href="#about" aria-label="Back to About"><img className="identity-photo" src="/photos/portrait-soft-640.webp" width="640" height="427" alt="Portrait of Yuxuan Du in soft natural light" fetchPriority="high" decoding="async" /></a>
          <h1 className="identity-name">Yuxuan Du</h1>
          <p className="identity-opportunity">Seeking PhD opportunities <span>· 2027</span></p>
          <div className="identity-links">
            <a className="identity-email" href="mailto:yuxuan.du.sherry@gmail.com" title="yuxuan.du.sherry@gmail.com"><ContactIcon type="email" /><span>Email</span></a>
            <a href="https://www.linkedin.com/in/yuxuan-du-23015338a" target="_blank" rel="noreferrer" aria-label="Yuxuan Du on LinkedIn"><ContactIcon type="linkedin" />LinkedIn</a>
            <a href="/Yuxuan_Du_Academic_CV.pdf" target="_blank" rel="noreferrer" aria-label="View Yuxuan Du’s CV"><ContactIcon type="cv" />CV</a>
          </div>
        </aside>
        <header className="site-topbar">
          <nav className="section-nav" aria-label="Main navigation">
            {navigation.map((item) => <a key={item.id} href={`#${item.id}`} aria-current={activeSection === item.id ? "location" : undefined}>{item.label}</a>)}
          </nav>
        </header>

        <main className="content" id="main-content" ref={content} tabIndex={-1}>
          <section className="page-section about-page" id="about" aria-labelledby="about-heading">
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

          <section className="page-section research-page" id="research" aria-labelledby="research-heading">
            <header className="page-heading"><h2 id="research-heading">Research</h2></header>
            <div className="research-group published-group"><h3 className="group-heading">Published &amp; Accepted</h3><ResearchList items={published} onEnlarge={setEnlargedFigure} /><p className="author-note">* Equal contribution.</p></div>
            <div className="research-group under-review-group"><h3 className="group-heading">Under Review &amp; Preprints</h3><ResearchList items={underReview} onEnlarge={setEnlargedFigure} /></div>
            <div className="research-group ongoing-group"><h3 className="group-heading">Ongoing Research</h3><ResearchList items={ongoing} onEnlarge={setEnlargedFigure} /></div>
            <div className="research-group earlier-group"><h3 className="group-heading">Earlier Research</h3><ResearchList items={earlier} onEnlarge={setEnlargedFigure} /></div>
          </section>

          <section className="page-section beyond-page" id="beyond" aria-labelledby="beyond-heading">
            <header className="page-heading"><h2 id="beyond-heading">Beyond Research</h2></header>
            <p className="beyond-copy">Outside research, strength training and bodybuilding are a big part of my life. I’m also an NSCA-Certified Personal Trainer (NSCA-CPT). I recently started bouldering and am still very much a beginner. I also enjoy dancing, hiking, drawing, and trying new things.</p>
            <div className="photo-journal">
              <figure className="journal-bouldering"><img src="/photos/bouldering-900.webp" srcSet="/photos/bouldering-450.webp 450w, /photos/bouldering-900.webp 900w" sizes="(max-width: 600px) 90vw, (max-width: 900px) 30vw, 300px" width="853" height="1138" alt="Yuxuan climbing an indoor bouldering wall" loading="lazy" decoding="async" /></figure>
              <figure className="journal-dance"><img src="/photos/dance-900.webp" srcSet="/photos/dance-450.webp 450w, /photos/dance-900.webp 900w" sizes="(max-width: 700px) 44vw, 245px" width="900" height="1200" alt="Yuxuan practising dance in a studio" loading="lazy" decoding="async" /></figure>
              <figure className="journal-matcha"><img src="/photos/matcha-900.webp" srcSet="/photos/matcha-450.webp 450w, /photos/matcha-900.webp 900w" sizes="(max-width: 700px) 44vw, 245px" width="900" height="1200" alt="Yuxuan whisking matcha in a ceramic bowl" loading="lazy" decoding="async" /></figure>
              <figure className="journal-hiking"><img src="/photos/hiking-900.webp" srcSet="/photos/hiking-450.webp 450w, /photos/hiking-900.webp 900w" sizes="(max-width: 700px) 44vw, 245px" width="900" height="1200" alt="Yuxuan hiking among snow-covered trees, holding trekking poles" loading="lazy" decoding="async" /></figure>
              <figure className="journal-drawing"><img src="/photos/drawing-900.webp" srcSet="/photos/drawing-450.webp 450w, /photos/drawing-900.webp 900w" sizes="(max-width: 700px) 44vw, 245px" width="900" height="1200" alt="An open sketchbook filled with hand-drawn plants beside a pen" loading="lazy" decoding="async" /></figure>
              <figure className="journal-outdoor"><img src="/photos/outdoor-climbing-900.webp" srcSet="/photos/outdoor-climbing-450.webp 450w, /photos/outdoor-climbing-900.webp 900w" sizes="(max-width: 600px) 90vw, (max-width: 900px) 30vw, 300px" width="900" height="1200" alt="Yuxuan climbing an outdoor rock face under a cloudy sky" loading="lazy" decoding="async" /></figure>
            </div>
          </section>
          <footer className="site-footer"><span>© {new Date().getFullYear()} Yuxuan Du</span></footer>
        </main>
        <FigurePreview item={enlargedFigure} onClose={() => setEnlargedFigure(null)} />
      </div>
  );
}
