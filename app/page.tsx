"use client";

import { useEffect, useRef, useState } from "react";
import ResearchFigureViewer, { type ResearchFigureSource } from "./research-figure-viewer";

type Section = "about" | "research" | "beyond";
type ResearchItem = { title: string; status: string; summary: string; authors?: string[]; link?: string; linkLabel?: string; image?: string; fullImage?: string; enlargeable?: boolean; imageWidth?: number; imageHeight?: number; imageAlt?: string };

const journalImageSizes = "(max-width: 700px) calc((100vw - 91px) / 2), (max-width: 1050px) calc((100vw - 372px) / 3), (max-width: 1370px) calc((100vw - 456px) / 3), 290px";

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
    fullImage: "/research/citation-detail.webp",
    imageWidth: 1000,
    imageHeight: 520,
    imageAlt: "Paper teaser showing citation-supported AI answers and the provenance of their underlying evidence",
    summary: "Multiple citations in an AI answer may trace back to the same underlying evidence. We audit these dependencies and study how making them visible affects users’ judgments.",
  },
  {
    title: "Fact-check Your Information (FYI): A Design Probe to Understand How People Actually Fact-check Data-Driven Articles",
    status: "IEEE TVCG, in press · IEEE VIS 2026",
    authors: ["Nguyen-Truong Thinh*", "Yuxuan Du*", "Phongsakon Mark Konrad", "Arpit Narechania"],
    image: "/research/fyi.webp",
    imageWidth: 1000,
    imageHeight: 598,
    imageAlt: "FYI design probe with claim detection, AI chat, automated checks, table inspection, and visualization",
    summary: "FYI is an interactive design probe for studying how readers combine different tools to verify claims in data-driven articles.",
    link: "https://fyi.datavisards-hkust.workers.dev/",
    linkLabel: "Project",
  },
  {
    title: "Evidence Use in LLM Verification",
    status: "Under review",
    authors: ["Yuxuan Du", "Phongsakon Konrad", "Serkan Ayvaz"],
    image: "/research/grounded-verification.webp",
    imageWidth: 1600,
    imageHeight: 754,
    imageAlt: "SPACE overview showing evidence visibility, evidence-use constraints, post-generation control, and the matched-contrast study design",
    summary: "Using matched contrasts, SPACE examines how evidence visibility, evidence-use rules, and citation control separately affect LLM verification outcomes.",
  },
  {
    title: "Who Chooses How Preferences Are Aggregated? Auditing Aggregation-Rule Authority in LLM-Based Group Recommendation",
    status: "Under review · arXiv:2608.23966",
    authors: ["Yuxuan Du"],
    image: "/research/group-authority.webp",
    enlargeable: false,
    imageWidth: 900,
    imageHeight: 600,
    imageAlt: "Conceptual illustration of different users' preferences and three possible sources of aggregation-rule authority: users, model, or unspecified",
    summary: "We examine how LLMs handle group preference aggregation when authority to choose the rule is unspecified, retained by users, or delegated to the model.",
    link: "https://arxiv.org/abs/2608.23966",
    linkLabel: "Preprint",
  },
  {
    title: "What Personalized Agents Make Visible: A Diagnostic Framework for AI-Mediated Judgment",
    status: "UbiComp/ISWC 2026 Reality Mediation Workshop · UbiComp Companion",
    authors: ["Yuxuan Du", "Shuai Ma", "Zhuoran Lu"],
    image: "/research/personalized-evidence.webp",
    enlargeable: false,
    imageWidth: 900,
    imageHeight: 600,
    imageAlt: "Conceptual illustration of two users viewing partly shared and partly distinct evidence through overlapping personalized panes",
    summary: "Even with the same decision brief, personalized agents may highlight different evidence. This work develops a framework for examining what becomes visible and how recommendations diverge.",
  },
];

const ongoing: ResearchItem[] = [
  {
    title: "Scope Fidelity in LLM-Assisted Refinement",
    status: "Work in progress",
    summary: "When refining user text, do LLMs stay within the requested scope, or make substantive changes the user did not authorize?",
  },
  {
    title: "HelpfulWidgets: AI-Enhanced Interface Widgets",
    status: "Early-stage project",
    summary: "HelpfulWidgets explores how AI can adapt existing interface widgets to users’ needs while preserving their original functionality and context.",
  },
];

const earlier: ResearchItem[] = [
  {
    title: "Impact of Cognitive Biases on Environmental Compliance Risk Perceptions in International Construction Projects",
    status: "Frontiers in Psychology, 2024",
    authors: ["Tengyuan Chang", "Yuxuan Du", "Xiaopeng Deng", "Xianru Wang"],
    summary: "This study examines how cognitive biases shape perceptions of environmental compliance risk in international construction projects.",
    link: "https://doi.org/10.3389/fpsyg.2024.1397306",
    linkLabel: "DOI",
  },
];

function ResearchList({ items, onEnlarge, variant = "selected" }: { items: ResearchItem[]; onEnlarge: (figure: ResearchFigureSource) => void; variant?: "selected" | "ongoing" | "earlier" }) {
  return (
    <div className="research-list">
      {items.map((item) => {
        const image = item.image;
        const figureImage = image && <span className="research-image-surface"><img src={image} width={item.imageWidth} height={item.imageHeight} alt={item.imageAlt} loading="lazy" decoding="async" /></span>;
        const statusTone = variant === "ongoing" ? "ongoing" : item.status.startsWith("Under review") ? "review" : "published";
        return (
        <article className={`research-item${item.image ? " research-item-illustrated" : ""}`} key={item.title}>
          {image && <figure className="research-thumbnail">
            {item.enlargeable === false ? figureImage : <button type="button" className="research-figure-trigger" aria-label={`Enlarge figure: ${item.title}`} aria-haspopup="dialog"
              onClick={() => onEnlarge({ title: item.title, src: item.fullImage ?? image, fallbackSrc: image, alt: item.imageAlt ?? item.title })}>
              {figureImage}
              <span className="research-figure-hint" aria-hidden="true">View figure <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5" /></svg></span>
            </button>}
          </figure>}
          <div className="research-details">
            <h4 className="research-title">{item.title}</h4>
            {item.authors && <p className="research-authors">{item.authors.map((author, index) => <span key={author}>{index > 0 && ", "}{author.startsWith("Yuxuan Du") ? <strong>{author}</strong> : author}</span>)}</p>}
            <p className={`research-status research-status-${statusTone}`}>{item.status}{item.link && <> · <a className="text-link" href={item.link} target="_blank" rel="noreferrer">{item.linkLabel}</a></>}</p>
            <p className="research-summary">{item.summary}</p>
          </div>
        </article>
      ); })}
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

function getHashSection(): Section | null {
  const hash = window.location.hash.slice(1);
  if (hash === "research" || hash === "publications" || hash === "experience") return "research";
  if (hash === "about" || hash === "cv") return "about";
  if (hash === "beyond") return "beyond";
  return null;
}

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>("about");
  const [enlargedFigure, setEnlargedFigure] = useState<ResearchFigureSource | null>(null);
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
              <p className="about-lead">I’m Yuxuan Du, an early-career researcher working in human–computer interaction (HCI) and artificial intelligence (AI).</p>
              <p>I currently work with <a className="advisor-link" href="https://zhuoranlu.github.io/" target="_blank" rel="noreferrer">Dr. Zhuoran Lu</a> on Human–AI Interaction research and collaborate with <a className="advisor-link" href="https://narechania.com/" target="_blank" rel="noreferrer">Prof. Arpit Narechania</a> at <a className="advisor-link" href="https://datavisards.com" target="_blank" rel="noreferrer">HKUST's DataVisards Lab</a> on AI-assisted sensemaking and interactive systems.</p>
              <div className="opportunity"><p><strong>I am currently preparing for PhD applications for 2027 and am open to new PhD opportunities and research collaborations.</strong> If you think our research interests overlap, feel free to <a href="mailto:yuxuan.du.sherry@gmail.com">email me</a>.</p></div>
              <h3 className="about-subheading">Research Interests</h3>
              <p>My research focuses on <strong>AI-mediated judgment and decision-making</strong>, particularly in two areas:</p>
              <ul className="research-sides"><li>AI-provided evidence and human judgment: How AI systems use evidence and how people interpret it when deciding whether to rely on AI.</li><li>AI agency in decision-making: How AI systems take on more active roles in decision-making, particularly when they make choices on users’ behalf.</li></ul>
              <h3 className="about-subheading">Education</h3>
              <p>I began doctoral study at the Hong Kong University of Science and Technology (HKUST) in 2025 as a recipient of the Hong Kong Postgraduate Scholarship. I left the program in January 2026 following a change in funding.</p>
              <p>I received my Master’s degree in Management from Southeast University in 2025, with a GPA of 3.9/4.0. I completed my Bachelor’s degree in Engineering at Central South University in 2022, graduating in the top 2% of my cohort. During my undergraduate studies, I also received the National Scholarship awarded by the Ministry of Education of China.</p>
            </div>
          </section>

          <section className="page-section research-page" id="research" aria-labelledby="research-heading">
            <header className="page-heading"><h2 id="research-heading">Research</h2></header>
            <div className="research-group selected-group"><h3 className="group-heading">Selected Research</h3><ResearchList items={selected} onEnlarge={setEnlargedFigure} /><p className="author-note">* Equal contribution.</p></div>
            <div className="research-group ongoing-group"><h3 className="group-heading">Ongoing Research</h3><ResearchList items={ongoing} onEnlarge={setEnlargedFigure} variant="ongoing" /></div>
            <div className="research-group earlier-group"><h3 className="group-heading">Earlier Research</h3><ResearchList items={earlier} onEnlarge={setEnlargedFigure} variant="earlier" /></div>
          </section>

          <section className="page-section beyond-page" id="beyond" aria-labelledby="beyond-heading">
            <header className="page-heading"><h2 id="beyond-heading">Beyond Research</h2></header>
            <p className="beyond-copy">Outside research, strength training and bodybuilding are a big part of my life. I’m also an NSCA-Certified Personal Trainer (NSCA-CPT). I recently started bouldering and am still very much a beginner. I also enjoy dancing, hiking, drawing, and trying new things.</p>
            <div className="photo-journal">
              <figure className="journal-bouldering"><img src="/photos/bouldering-900.webp" srcSet="/photos/bouldering-450.webp 450w, /photos/bouldering-900.webp 900w" sizes={journalImageSizes} width="853" height="1138" alt="Yuxuan climbing an indoor bouldering wall" loading="lazy" decoding="async" /></figure>
              <figure className="journal-dance"><img src="/photos/dance-900.webp" srcSet="/photos/dance-450.webp 450w, /photos/dance-900.webp 900w" sizes={journalImageSizes} width="900" height="1200" alt="Yuxuan practising dance in a studio" loading="lazy" decoding="async" /></figure>
              <figure className="journal-matcha"><img src="/photos/matcha-900.webp" srcSet="/photos/matcha-450.webp 450w, /photos/matcha-900.webp 900w" sizes={journalImageSizes} width="900" height="1200" alt="Yuxuan whisking matcha in a ceramic bowl" loading="lazy" decoding="async" /></figure>
              <figure className="journal-hiking"><img src="/photos/hiking-900.webp" srcSet="/photos/hiking-450.webp 450w, /photos/hiking-900.webp 900w" sizes={journalImageSizes} width="900" height="1200" alt="Yuxuan hiking among snow-covered trees, holding trekking poles" loading="lazy" decoding="async" /></figure>
              <figure className="journal-drawing"><img src="/photos/drawing-900.webp" srcSet="/photos/drawing-450.webp 450w, /photos/drawing-900.webp 900w" sizes={journalImageSizes} width="900" height="1200" alt="An open sketchbook filled with hand-drawn plants beside a pen" loading="lazy" decoding="async" /></figure>
              <figure className="journal-outdoor"><img src="/photos/outdoor-climbing-900.webp" srcSet="/photos/outdoor-climbing-450.webp 450w, /photos/outdoor-climbing-900.webp 900w" sizes={journalImageSizes} width="900" height="1200" alt="Yuxuan climbing an outdoor rock face under a cloudy sky" loading="lazy" decoding="async" /></figure>
            </div>
          </section>
          <footer className="site-footer"><span>© {new Date().getFullYear()} Yuxuan Du</span></footer>
        </main>
        {enlargedFigure && <ResearchFigureViewer figure={enlargedFigure} onClose={() => setEnlargedFigure(null)} />}
      </div>
  );
}
