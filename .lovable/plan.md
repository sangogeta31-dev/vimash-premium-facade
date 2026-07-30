## Vimash Manufacturing — premium industrial website (frontend only)

Six routes, one shared shell, no backend. Deep blue / white / charcoal with orange accents, bold display typography, glass surfaces, scroll-reveal motion.

### Design system (src/styles.css)
- Tokens in oklch: `--background` white, `--foreground` charcoal, `--primary` deep blue, `--accent` orange, plus `--surface-glass`, `--gradient-hero`, `--gradient-steel`, `--shadow-elevated`, `--shadow-glow`.
- Fonts loaded via `<link>` in `__root.tsx`: Space Grotesk (display/headings) + DM Sans (body). Tight tracking on large headings.
- Utilities: `.glass-card`, `.reveal` (fade+rise on intersect), `.hover-lift`, `.grain` overlay.
- Dark values defined for completeness; site ships light.

### Shared chrome (`src/routes/__root.tsx`)
- Sticky nav: transparent over hero, turns to blurred glass with border on scroll. Logo mark, 6 links with animated underline, orange "Get a Quote" CTA. Mobile: full-screen slide-in sheet.
- Footer: 4 columns (brand blurb, quick links, product range, contact details).
- Floating action stack, bottom right on every page: WhatsApp (green) and Call (orange) pill buttons with tooltip on hover, stacked on mobile.

### Pages
1. **Home** (`index.tsx`) — full-bleed hero with generated machine image, gradient wash, headline + dual CTA, stat strip (years, machines delivered, states served, HP range); category split section (Atta vs Masala) as two large hover-tilt cards; "Why Vimash" 4-item feature grid; process teaser; testimonial band; CTA banner.
2. **About** (`about.tsx`) — story split layout, timeline of milestones, values grid, leadership/mission block.
3. **Products** (`products.tsx`) — segmented toggle (All / Atta / Masala), then two labeled sections each with 6 cards: 5, 7.5, 10, 15, 20, 30 HP. Each card: image, HP badge, capacity/output spec rows, feature chips, "Enquire" CTA, orange glow on hover. Data lives in a local `src/data/products.ts` array.
4. **Manufacturing** (`manufacturing.tsx`) — numbered vertical process steps (design → fabrication → machining → assembly → QC → dispatch) with sticky sidebar, infrastructure cards, QC checklist.
5. **Gallery** (`gallery.tsx`) — filterable masonry grid of generated facility/machine images with lightbox-style hover zoom overlay.
6. **Contact** (`contact.tsx`) — split layout: styled (non-functional) enquiry form on glass card, plus contact info cards, hours, and a static map-styled panel.

### Interaction
- Scroll reveals via a small `useReveal` IntersectionObserver hook (no new deps).
- Hover: card lift + border-glow + image scale; buttons with sliding orange fill.
- Counter animation on the stat strip.

### Technical notes
- TanStack Router file routes; each page defines its own `head()` with unique title/description/og tags.
- Reusable components under `src/components/`: `SiteNav`, `SiteFooter`, `FloatingActions`, `SectionHeading`, `ProductCard`, `StatStrip`, `Reveal`.
- Images generated into `src/assets/` (hero machine, atta pulverizer, masala pulverizer, factory floor, gallery set) and imported as ES modules.
- Fully responsive: grid → single column, nav → sheet, floating buttons repositioned.
- Placeholder phone/WhatsApp numbers and address, easy to swap.
