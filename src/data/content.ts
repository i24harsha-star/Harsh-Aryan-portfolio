/**
 * All site copy and content in one place.
 *
 * Everything here is drawn from Harsh’s CV, LinkedIn and the source documents —
 * no invented credentials, results or numbers. Anything still awaiting his input
 * is marked NEEDS INPUT rather than filled with plausible-sounding filler.
 */

export const site = {
  name: "Harsh Aryan",
  pronouns: "He/Him",
  roles: ["Equity Research", "Financial Modelling", "Capital Markets", "IIM Indore"],
  location: "Indore, Madhya Pradesh, India",
  // NEEDS INPUT — confirm which address should be public. This is the one already
  // printed on the CV; a personal address may be preferable to the institute one.
  email: "i24harsha@iimidr.ac.in",
  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/harsh-aryan-970b2b25a/" },
    { label: "Substack", href: "https://harsharyan1.substack.com" },
    { label: "Unsplash", href: "https://unsplash.com/@harsh_aryan" },
  ],
} as const;

export const hero = {
  question: ["What", "actually", "matters", "today?"],
  scrollCue: ["Scroll down", "to begin"],
} as const;

export const chapters = [
  { id: "about", numeral: "I", label: "Who I Am" },
  { id: "competitions", numeral: "II", label: "Case Work" },
  { id: "projects", numeral: "III", label: "Projects" },
  { id: "cv", numeral: "IV", label: "The Record" },
  { id: "mentoring", numeral: "V", label: "Mentoring" },
  { id: "contact", numeral: "VI", label: "Contact" },
] as const;

export const about = {
  title: ["Numbers, and", "what they hide"],
  paragraphs: [
    "I am in my third year of the Integrated Programme in Management at IIM Indore, and I have cleared CFA Level I. What holds my attention is not finance as a subject but finance as a question: how businesses create value, how markets price it, and how capital gets deployed against an uncertain future.",
    "I don’t think that question can be answered from a textbook. So most of what I have learned came from building things — an equity research process, a Monte Carlo model, an earnings-quality screen, and eventually an entire financial intelligence platform — and then finding out where my reasoning broke.",
    "Eight weeks inside Access Livelihoods taught me the part no course covers: how an organisation actually runs. Governance, restructuring, statutory documentation, and the people — company secretaries, chartered accountants, auditors, bankers — who keep it standing.",
  ],
  facts: [
    { label: "Programme", value: "Integrated Programme in Management, IIM Indore · Year III" },
    { label: "Charter progress", value: "CFA Level I cleared · Level II candidate" },
    { label: "Focus", value: "Investment banking · Equity research · PE/VC · Wealth management" },
    { label: "Based in", value: "Indore, Madhya Pradesh, India" },
  ],
  marks: [
    "IIM Indore",
    "CFA Institute",
    "Bloomberg",
    "Access Livelihoods",
    "IIT Guwahati",
    "IIM Bangalore",
    "IIT Indore",
    "ABV-IIITM Gwalior",
  ],
} as const;

export const competitions = {
  title: ["Where thinking", "gets tested"],
  standfirst:
    "Five national stages across IIM and IIT campuses, most of them as Team WhiteRock with Mayuri Jalin. Each one is a real company, a real constraint, and a clock.",
  items: [
    {
      slug: "udgam-iitg",
      event: "Equity Research Challenge",
      host: "UDGAM’26 · IIT Guwahati",
      date: "January 2026",
      result: "National Finalist · Rank 1",
      resultNote: "Score 9.5 — shortlisted from 1,295+ registrations",
      summary:
        "Designed a GARP-based small and mid-cap hybrid equity fund using a top-down framework: macro and sectoral outlook, then growth, valuation, profitability and cash-flow-quality filters. Dynacons Systems & Solutions was taken through full fundamental analysis.",
      doc: "/docs/udgam-iitg-equity-research.pdf",
      cover: "/img/covers/udgam-iitg.jpg",
      pages: 20,
    },
    {
      slug: "case-chronicles",
      event: "Case Chronicles",
      host: "E-Summit’25 · IIT Indore",
      date: "September 2025",
      result: "National Runner-up",
      resultNote: "Rank 2 nationally",
      summary:
        "A quick-commerce strategy case: defending a 60-minute fashion delivery platform against quick-commerce expansion while capturing the impulse-fashion opportunity.",
      doc: "/docs/case-chronicles-iiti.pdf",
      cover: "/img/covers/case-chronicles.jpg",
      pages: 8,
    },
    {
      slug: "casecon",
      event: "CaseCon",
      host: "Infotsav’25 · ABV-IIITM Gwalior",
      date: "September 2025",
      result: "National Finalist",
      resultNote: "Shortlisted from 200+ teams",
      summary:
        "Market opportunity analysis, go-to-market strategy and an implementation roadmap, structured as a research-backed solution under strict slide and time limits.",
      doc: "/docs/casecon-abv-iiitm.pdf",
      cover: "/img/covers/casecon.jpg",
      pages: 10,
    },
    {
      slug: "case-o-nova",
      event: "Case-O-Nova 7.0",
      host: "SMASH’25 · IIM Bangalore",
      date: "2025",
      result: "National Finalist",
      resultNote: "Two-round onsite final",
      summary:
        "A two-round strategy case worked through competitive analysis and financial modelling, including a VRIO assessment and comparative benchmarking against category incumbents.",
      doc: "/docs/case-o-nova-iimb.pdf",
      cover: "/img/covers/case-o-nova.jpg",
      pages: 11,
    },
    {
      slug: "samadhan",
      event: "Samadhan 2025",
      host: "National Social Innovation Challenge · UPAY",
      date: "2025",
      result: "National Finalist",
      resultNote: "Integrated solution round",
      summary:
        "A social innovation brief answered end to end — problem diagnosis through to an integrated, costed implementation plan.",
      doc: "/docs/samadhan-upay.pdf",
      extraDoc: {
        label: "Full integrated solution",
        href: "/docs/samadhan-upay-full-solution.pdf",
      },
      cover: "/img/covers/samadhan.jpg",
      pages: 7,
    },
  ],
  photos: [
    { src: "/img/photos/event-1.jpg", caption: "IIT Indore" },
    { src: "/img/photos/event-2.jpg", caption: "Presenting to the panel" },
    { src: "/img/photos/event-3.jpg", caption: "On stage" },
    { src: "/img/photos/event-4.jpg", caption: "Case materials" },
  ],
} as const;

export const projects = {
  title: ["Built to", "understand"],
  standfirst:
    "Every one of these started as a question I couldn’t answer by reading. The fastest way to find out where your reasoning is wrong is to build the thing and watch it fail.",
  aegis: {
    name: "AEGIS.os",
    tagline: "AI Financial Intelligence Platform",
    period: "May – August 2026",
    href: "https://aegis-os-silk.vercel.app",
    summary:
      "A Bloomberg Terminal costs about $24,000 a year, and it is a large part of why analysts inside big firms see what matters before everyone else. I wanted to read markets that way without the terminal, so I built my own.",
    modules: [
      "Prioritised intelligence feed",
      "Macro hub — yield curves, real rates, sovereign yields",
      "Live markets dashboard",
      "Deal & M&A extraction",
      "AI theme matrix",
      "Interview vault",
    ],
    principles: [
      {
        head: "Priority means intelligence value, not news size",
        body: "A regulatory change that quietly reprices a sector outranks a loud headline that changes nothing. The scoring rubric is written around what an IB, ER, PE or macro seat should actually care about.",
      },
      {
        head: "Never fabricate a number",
        body: "Missing data is shown as unavailable, or hidden entirely. In a financial tool a plausible-looking wrong number is far more dangerous than a blank one.",
      },
      {
        head: "AI analyses, code calculates",
        body: "Every spread, change and average is deterministic code. The model only interprets. Models don’t do arithmetic here.",
      },
      {
        head: "Every output is traceable",
        body: "Prompts are versioned with a regression suite, so changing one can’t silently degrade quality.",
      },
    ],
    stack: ["Next.js", "TypeScript", "Supabase", "OpenAI"],
    stats: [
      { value: "~2,000", label: "Articles classified" },
      { value: "30", label: "Macro series" },
      { value: "5 yrs", label: "History held" },
      { value: "~$2/mo", label: "Running cost" },
    ],
    // NEEDS INPUT — interface screenshots and the launch video.
    hasMedia: false,
  },
  analyses: [
    {
      slug: "income-quality",
      name: "Earnings Quality",
      subtitle: "Large-cap Chemicals & Petrochemicals",
      period: "January 2026",
      summary:
        "An earnings-quality screen built on the relationship between net profit and cash flow from operations, applying CFA Level I cash-flow-statement analysis across twelve years of data.",
      finding:
        "Where a company’s average NP/CFO sits close to its median, earnings are steadier. Where the two diverge, the average is being dragged by years that don’t repeat.",
      doc: "/docs/income-quality-chemicals.xlsx",
      docLabel: "Workbook (XLSX)",
    },
    {
      slug: "monte-carlo",
      name: "Monte Carlo Simulation",
      subtitle: "NIFTY 50 return distribution",
      period: "January 2026",
      summary:
        "A 10,000-iteration simulation of NIFTY 50 returns built from historical daily mean and standard deviation, reporting the full distribution of outcomes rather than a single point estimate.",
      finding:
        "The distribution is near-symmetric — skewness 0.027, excess kurtosis −0.029 — so on these inputs the tails behave close to normal.",
      doc: "/docs/monte-carlo-nifty50.xlsx",
      docLabel: "Model (XLSX)",
    },
  ],
  writing: [
    {
      name: "How to read an Annual Report",
      subtitle: "Using Pareto analysis · 2025",
      summary:
        "A 12-page walkthrough of getting to the 20% of an annual report that carries 80% of the signal.",
      doc: "/docs/how-to-read-an-annual-report.pdf",
      cover: "/img/covers/annual-report.jpg",
    },
    {
      name: "3 Lessons Before Your First Internship",
      subtitle: "Written after eight weeks at Access Livelihoods",
      summary:
        "How real corporate meetings work, the legal documents worth recognising on day one, and who actually does what — company secretary, chartered accountant, auditor, banker.",
      doc: "/docs/three-lessons-before-your-first-internship.pdf",
      cover: "/img/covers/three-lessons.jpg",
    },
    {
      name: "Is South Korea a Bubble?",
      subtitle: "Or the first true AI wealth effect · Substack",
      summary: "First published essay — on whether Korea’s move is a bubble or something structural.",
      href: "https://harsharyan1.substack.com",
    },
  ],
} as const;

export const cv = {
  title: ["The", "record"],
  file: "/docs/harsh-aryan-cv.pdf",
  cover: "/img/covers/cv.jpg",
  education: [
    {
      place: "Indian Institute of Management, Indore",
      detail: "Integrated Programme in Management · Year III",
      period: "2024 – 2029",
    },
    { place: "CFA Institute", detail: "Level I cleared · Level II candidate", period: "June 2026" },
    { place: "SKP Vidya Vihar, Deoghar", detail: "Class XII · CBSE", period: "2024" },
    { place: "DAV Public School, Deoghar", detail: "Class X · CBSE", period: "2021" },
  ],
  experience: [
    {
      place: "Access Livelihoods",
      role: "Development Finance Intern",
      period: "April – June 2026",
      points: [
        "Worked directly with the COO on governance, corporate restructuring and capital formation across multiple entities.",
        "Analysed India’s Social Stock Exchange framework as an alternative capital-raising mechanism — securing a follow-on paid live project on SSE registration.",
        "Built a gratuity liability valuation model to project long-term employee benefit obligations.",
        "Executed documentation for renewal of a ₹17.67 lakh performance bank guarantee.",
      ],
    },
    {
      place: "Cup-Ji",
      role: "Growth Strategy · Live Project",
      period: "September 2025 – February 2026",
      points: [
        "Formulated a data-driven market entry strategy for a vending machine vertical.",
        "Ran competitive analysis across 10+ industry leaders on 25+ strategic variables.",
      ],
    },
    {
      place: "Endurance-I, IIM Indore",
      role: "Founder",
      period: "December 2024",
      points: [
        "Built and led a 500+ member fitness community; organised two flagship competitions.",
        "Designed 350+ customised training plans and mentored three junior associates.",
      ],
    },
    {
      place: "Unsplash",
      role: "Photographer",
      period: "2021 – present",
      points: ["Photography with 1.7 million+ user engagement."],
    },
  ],
  certifications: [
    "CFA Program Level I — CFA Institute, 2026",
    "Bloomberg Finance Fundamentals — Bloomberg, 2026",
    "Data Visualization — IIM Indore, 2025",
    "Equity Markets Analyst — Finlatics, 2025",
    "Data Science, ML, DL & NLP Bootcamp — Udemy, 2025",
  ],
  skills: [
    { group: "Finance", items: "Financial modelling · DCF valuation · Financial statement analysis · Equity research · Portfolio analysis" },
    { group: "Databases", items: "Bloomberg Terminal · S&P Capital IQ · Capitaline · CMIE ProwessDX · ACE Equity Nxt · CEIC · Euromonitor" },
    { group: "Analytics", items: "Python (Pandas, NumPy) · R · Advanced Excel" },
    { group: "Languages", items: "English · Hindi · French (A1)" },
  ],
} as const;

export const mentoring = {
  // Deliberately not "one hour" — the session length is still undecided, and the
  // heading shouldn’t promise a duration Harsh hasn’t chosen.
  title: ["One session,", "one seat closer"],
  price: 499,
  currency: "INR",
  // NEEDS INPUT — duration, topics, policies and availability all need Harsh’s
  // decisions before this section can go live. Placeholders are written as
  // honest drafts, not as claims.
  duration: "NEEDS INPUT",
  standfirst:
    "A one-to-one session for students trying to get into investment banking, equity research, private equity or wealth management — from someone a few steps ahead, not a decade removed.",
  covers: [
    "CV and resume review for finance roles",
    "How to build one model properly instead of ten half-finished ones",
    "Preparing a stock pitch you can defend",
    "CFA Level I — what actually moved the needle",
    "Case competition strategy and structuring",
  ],
  notFor: [
    "Guaranteed placements or referrals",
    "Investment or trading advice",
    "Anything I haven’t done myself",
  ],
  disclaimer:
    "This is career and study mentoring only. It is not investment advice, and nothing in a session is a recommendation to buy or sell any security.",
} as const;

export const contact = {
  title: ["Let’s", "talk"],
  stats: [
    { value: 5, label: "National finals reached", suffix: "" },
    { value: 1.7, label: "Photograph views", suffix: "M+", decimals: 1 },
    { value: 3700, label: "Following the work", suffix: "+" },
    { value: 2000, label: "Articles classified by AEGIS", suffix: "+" },
  ],
} as const;
