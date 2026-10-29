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
  // The address he now leads with on his CV — a dedicated professional one,
  // which also settles the earlier question of whether to publish the institute
  // address instead.
  email: "harsh.aryan.finance@gmail.com",
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

// Reading order. The Record sits at II so the story runs: who he is, the
// credentials that back it, then the work — case competitions, then projects.
export const chapters = [
  { id: "about", numeral: "I", label: "Who I Am" },
  { id: "cv", numeral: "II", label: "The Record" },
  { id: "competitions", numeral: "III", label: "Case Work" },
  { id: "projects", numeral: "IV", label: "Projects" },
  { id: "mentoring", numeral: "V", label: "Mentoring" },
  { id: "contact", numeral: "VI", label: "Contact" },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];

/**
 * Numeral and label for a chapter, looked up rather than hard-coded in each
 * section — reordering the array above is now the only edit a reorder needs.
 */
export function chapterMeta(id: ChapterId): { numeral: string; label: string } {
  const c = chapters.find((x) => x.id === id);
  if (!c) throw new Error(`unknown chapter: ${id}`);
  return { numeral: c.numeral, label: c.label };
}

export const about = {
  title: ["Numbers, and", "what they hide"],
  paragraphs: [
    "I don’t know if I’ve ever been interested in having all the answers. I’ve always been more interested in finding better questions.",
    "Questions about why things work the way they do. Why some people see something before everyone else does. Why certain ideas survive while others disappear. What sits beneath the surface of things that seem simple from a distance.",
    "Maybe that’s why I keep finding myself drawn to unfamiliar territory. I like the feeling of not knowing something yet. Of taking it apart. Following a thread. Building something from nothing and discovering, somewhere along the way, that my first understanding of it was wrong.",
    "I’m still becoming. And perhaps that’s the part I find most interesting.",
  ],
  facts: [
    { label: "Programme", value: "IPM — BA (Foundations of Management), IIM Indore · May 2027" },
    { label: "Charter progress", value: "CFA Level II candidate · Level I passed 2026" },
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
    "A collection of cases I worked on across national case competitions, covering different companies, industries and problems.",
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
      cover: "/img/thumbs/udgam-iitg.jpg",
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
      cover: "/img/thumbs/case-chronicles.jpg",
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
      cover: "/img/thumbs/casecon.jpg",
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
      cover: "/img/thumbs/case-o-nova.jpg",
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
      cover: "/img/thumbs/samadhan.jpg",
      pages: 7,
    },
  ],
  photos: [
    { src: "/img/photos/event-1.jpg", caption: "IIT Indore" },
    { src: "/img/photos/event-2.jpg", caption: "Presenting to the panel" },
    { src: "/img/photos/event-3.jpg", caption: "Open to questions" },
  ],
} as const;

export const projects = {
  title: ["Built to", "understand"],
  standfirst:
    "Every one of these started as a question I couldn’t answer by reading. The fastest way to find out where your reasoning is wrong is to build the thing and watch it fail.",
  /**
   * Adani Power — the newest project, and the one that sits first because it is
   * the most complete piece of modelling work on the site.
   *
   * `chain` is the model's own architecture, stage by stage. ValuationChain
   * draws it; the grid underneath lists what each stage actually contains. Both
   * read from this one array, so the diagram can never drift from the copy.
   *
   * Deliberately no numbers: no price target, no valuation range, no multiples.
   * None of the model's outputs have been supplied, and a plausible-looking
   * figure on a finance portfolio is worse than none at all.
   */
  adani: {
    name: "Adani Power",
    tagline: "Financial Modelling & DCF Valuation",
    kind: "Personal project",
    period: "August – September 2026",
    summary:
      "An end-to-end model of an Indian thermal power producer, built to carry one business the whole way — plant load factor and tariff assumptions at one end, an equity value at the other.",
    note:
      "What I wanted from it was never a price target. It was to watch a single operating assumption travel through three statements, into cash flow, and out the other side as what the equity is worth — because that journey is where reasoning either holds or breaks.",
    chain: [
      {
        numeral: "01",
        label: ["Operating", "drivers"],
        items: [
          "Capacity additions and commissioning",
          "Plant availability and PLF",
          "PPA versus merchant generation",
          "Tariff assumptions",
        ],
      },
      {
        numeral: "02",
        label: ["Three", "statements"],
        items: [
          "Ten years of historical income statement, balance sheet and cash flow",
          "Revenue, EBITDA, EBIT and net income forecast",
          "CAPEX and working capital",
          "Debt schedules",
        ],
      },
      {
        numeral: "03",
        label: ["Free", "cash flow"],
        items: [
          "FCFF build",
          "WACC, with a regression-based beta from historical market data",
          "Reinvestment rate and intrinsic growth",
          "Ratio and common-size analysis",
        ],
      },
      {
        numeral: "04",
        label: ["Three", "approaches"],
        items: [
          "FCFF-based DCF, with terminal value and sensitivity analysis",
          "Comparable companies on EV/Revenue, EV/EBITDA and P/E",
          "Market-based valuation",
        ],
      },
      {
        numeral: "05",
        label: ["Football", "field"],
        items: [
          "The three approaches set side by side as one valuation range",
          "Base, best and worst cases across operating and macro assumptions",
          "Historical and Monte Carlo Value-at-Risk for the downside",
        ],
      },
    ],
    /**
     * Valuation outputs, read directly out of the workbook (Cover sheet dates it
     * 25 September 2026). Every figure here is the model's own — nothing is
     * rounded into a nicer story and nothing is inferred.
     *
     * `field` is the Football Field sheet's own data table; `figures` and
     * `findings` are read off DCF, WACC, Beta, Comp Valuation, Intrinsic Growth
     * and VaR. See handoff.md §9 for where each one comes from.
     */
    valuation: {
      asOf: "25 September 2026",
      marketPrice: 202.71,
      standfirst:
        "The model lands on ₹465.50 a share against a market price of ₹202.71 — a 56% discount. The more useful part is why, and what has to be true for it to hold.",
      figures: [
        { value: "₹465.50", label: "DCF base case, per share" },
        { value: "₹202.71", label: "Market price, 25 Sep 2026" },
        { value: "9.15%", label: "WACC, bottom-up beta" },
        { value: "96%", label: "Of value beyond the forecast" },
      ],
      // Football Field sheet, verbatim. axisMax is rounded up from the highest
      // bar so the chart has a little air at the right.
      axisMax: 1300,
      ticks: [0, 250, 500, 750, 1000, 1250],
      field: [
        { label: "52-week range", low: 128.1, high: 254.2, kind: "market" },
        { label: "Comparable companies", low: 54.8005, high: 182.3104, kind: "comps" },
        { label: "DCF — worst case", low: 181.3642, high: 245.1877, kind: "dcf" },
        { label: "DCF — base case", low: 382.0634, high: 594.6745, kind: "base" },
        { label: "DCF — best case", low: 611.7204, high: 1243.5, kind: "dcf" },
      ],
      findings: [
        {
          head: "Ninety-six per cent of the value sits past the forecast",
          body:
            "The present value of the terminal value is ₹908,771 crore of an enterprise value of ₹945,443 crore. Six explicit forecast years contribute the other 3.9% — and three of them are negative, because capex runs ahead of operating cash flow until 2030. This is not a cash-generating business valued on its cash flow. It is a build-out valued on what it becomes once the build-out ends.",
        },
        {
          head: "The largest lever is a methodology choice, not a view on power",
          body:
            "A five-year weekly regression against the NIFTY gives a beta of 1.26 — on an R² of 0.11, so the index explains about a ninth of how this stock moves. Taking the peer median unlevered beta instead and re-levering it to target gearing gives 0.69, and moves the cost of equity from 14.5% to 11.1%. No tariff or plant-load assumption in the model shifts the answer as far as that one decision does.",
        },
        {
          head: "The DCF and the comparables disagree, and that is the finding",
          body:
            "On EV/EBITDA the peers imply ₹102 a share and on P/E ₹182 — both under the ₹202.71 market price, while the DCF says ₹465.50. Adani Power trades at 18.7× EV/EBITDA against a peer median of 10.4×. The market is already paying for growth the peer set does not have; the DCF is pricing capacity that does not exist yet. Both readings can be correct, and a valuation that reported only one of them would be hiding the argument.",
        },
        {
          head: "The whole thesis is one crossover",
          body:
            "Return on invested capital sits at or below the 9.15% cost of capital from 2026 through 2029 — 9.1%, 8.8%, 8.6%, 8.3% — and then crosses to 10.2%, 13.9% and 16.6%. Capacity roughly doubles from 21.1 GW to 41.9 GW across the same window. Everything the valuation claims rests on that build completing and that crossing happening on schedule.",
        },
        {
          head: "Risk the discount rate cannot see",
          body:
            "Weekly return volatility of 6.9% annualises near 50%, and a 10,000-path simulation puts the 95% one-week VaR at −10.1% against −7.2% on the historical series. A beta of 0.69 prices this as a below-market-risk asset. The VaR sheet ends up documenting the limitation of the model's own discount rate.",
        },
      ],
    },
    methods: [
      "FCFF DCF",
      "Terminal value",
      "Sensitivity analysis",
      "Regression beta",
      "WACC",
      "Comparable companies",
      "Football field",
      "Scenario analysis",
      "Monte Carlo VaR",
      "Common-size analysis",
    ],
    doc: "/docs/adani-power-dcf-model.xlsx",
    docLabel: "Full model (XLSX)",
    disclaimer:
      "An educational practice model, not a recommendation to buy, hold or sell any security. The figures are the model's own outputs as at 25 September 2026 and have not been updated since.",
  },
  aegis: {
    name: "AEGIS.os",
    tagline: "AI Financial Intelligence Platform",
    period: "June – August 2026",
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
      detail: "IPM — Bachelor of Arts (Foundations of Management)",
      period: "May 2027",
      note: "Coursework: Foundations of Company Accounts · Bayesian Statistics · Monetary Policy · Time Series Analysis",
    },
    {
      place: "CFA Institute",
      detail: "Level II candidate · Level I passed, May 2026",
      period: "May 2027",
    },
  ],

  achievements: [
    { result: "National Finalist", event: "Udgam’26: Equity Research Challenge 2025-26", host: "IIT Guwahati", year: "2026" },
    { result: "National Runner-up", event: "E-Summit’25: Case Chronicle Case Competition", host: "IIT Indore", year: "2025" },
    { result: "National Finalist", event: "SMASH’25: Case-O-Nova 7.0 Case Competition", host: "IIM Bangalore", year: "2025" },
    { result: "National Finalist", event: "CaseCon: Techno-Cultural Fest Case Competition", host: "ABV-IIITM Gwalior", year: "2025" },
    { result: "National Finalist", event: "Samadhan 2025 — National Social Innovation Challenge", host: "UPAY", year: "2025" },
  ],

  // Grouped exactly as the resume groups them: paid work, project work, and
  // what he runs. Flattening these into one "experience" list, as the previous
  // version did, made a live VC project read the same as founding a society.
  experience: [
    {
      group: "Professional experience",
      items: [
        {
          place: "Access Livelihoods",
          role: "Development Finance — Intern",
          where: "Hyderabad, India",
          period: "April – June 2026",
          points: [
            "Executed capital restructuring, shareholding realignment, governance and Social Stock Exchange initiatives with the COO; evaluated institutional shareholder eligibility and strategic fit across multiple Access Livelihoods entities.",
            "Analysed audited financial statements; developed a gratuity liability valuation model; coordinated DEMAT conversion and statutory compliance; executed renewal of a ₹17.67 lakh Performance Bank Guarantee with banking stakeholders.",
          ],
        },
      ],
    },
    {
      group: "Projects",
      items: [
        {
          place: "434 VC",
          role: "Investment Analyst — Live Project",
          where: "New York, United States",
          period: "August 2026 – September 2026",
          points: [
            "Conducted market research and competitive analysis across venture capital, AI, technology and funding markets.",
            "Supported startup screening, due diligence, investment notes and deal-pipeline research across emerging opportunities.",
          ],
        },
        {
          place: "AEGIS.os",
          role: "AI-assisted Newstracker — Personal Project",
          where: "",
          period: "June – August 2026",
          points: [
            "Built an AI-assisted financial intelligence platform synthesising market data, news and institutional research to track investment themes, IPOs, M&A and PE/VC activity across ~2,000 classified articles and 30 macro series.",
          ],
        },
        {
          place: "Cup-Ji",
          role: "Growth Strategy Project — Live Project",
          where: "Mumbai, India",
          period: "September 2025 – February 2026",
          points: [
            "Formulated a data-driven market entry strategy through competitive analysis of 10+ industry leaders across 25+ metrics.",
            "Synthesised benchmarking, segment and location insights with a 10+ member team into a structured launch plan.",
          ],
        },
      ],
    },
    {
      group: "Leadership",
      items: [
        {
          place: "Endurance-I, IIM Indore",
          role: "Founder",
          where: "Madhya Pradesh, India",
          period: "December 2024 – Present",
          points: [
            "Founded and scaled a 500+ member fitness community; organised two flagship competitions, developed 350+ customised workout plans, mentored three associates and collaborated with the institute administration on facility improvements.",
          ],
        },
      ],
    },
  ],

  certifications: [
    "Bloomberg BMC",
    "Spreadsheet Analysis",
    "ESG & Finance Fundamentals",
    "Equity Markets Analyst — Finlatics",
  ],

  skills: [
    {
      group: "Finance",
      items: "Financial modelling · DCF valuation · Accretion/dilution analysis · LBO analysis · Equity research · Pitch books · Fundamental analysis",
    },
    { group: "Tools", items: "Bloomberg Terminal · S&P Capital IQ · Microsoft Office (VBA, Solver) · Claude Code" },
    { group: "Languages", items: "English · Hindi · French (A1)" },
    { group: "Interests", items: "Fitness · Powerlifting · Photography · Modelling" },
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
} as const;
