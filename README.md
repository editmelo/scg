# Stringfellow Construction Group LLC — Website

Static HTML/CSS/JS. No build step, no framework, no dependencies to install.
Upload the contents of this repository to any host and it works.

---

## Files

```
index.html               Home
services.html            All four tiers, priced
insurance-recovery.html  Tier 3, standalone (highest-intent page)
about.html               Jesye Franklin  ← has open placeholders, see below
contact.html             Call, email, service area
brand.html               Logo concepts + brand sheet (noindex; footer-linked, not in nav)
favicon.svg
assets/css/site.css      The whole design system, one file
assets/js/site.js        Mobile menu, header state, scroll reveals
assets/logo/             Six SCG logo concepts as SVG
assets/img/              Empty — for Jesye's photo when it arrives
```

Only external request is Google Fonts (Archivo + JetBrains Mono).

---

## Before this goes live

**1. Confirm the phone number.**
The old site says `317-677-5243`. The number supplied for this build was
`317-667-5243`, and that is what's used everywhere — in visible text and in every
`tel:` link. If the old one is correct, search and replace both `(317) 667-5243`
and `+13176675243` across all six HTML files.

**2. Fill in the About page.**
`about.html` has placeholders styled in amber with dashed underlines so they're
impossible to miss. Search the file for `[[` to find all of them:

| Placeholder | What's needed |
|---|---|
| `[[YEARS]]` | Years in construction (appears twice) |
| `[[TRADES]]` | Trades he came up through |
| `[[BIO]]` | Two or three paragraphs — specific, with places and numbers |
| `[[WHY]]` | Why he moved from building to consulting, in his words |
| `[[LICENSE #]]` | License number |
| `[[CERTS]]` | Certifications |
| `[[ORGS]]` | Affiliations |
| `[[PHOTO]]` | One portrait, 4:5, no hard hat, no crossed arms |

For the photo: drop the file in `assets/img/` and replace the whole
`<div class="photo-slot">…</div>` block with
`<img src="assets/img/jesye.jpg" alt="Jesye Franklin" style="aspect-ratio:4/5;object-fit:cover;width:100%">`.

**3. Decide on the Membership section.**
`services.html` shows the $49 / $99 / $199 tiers marked "In development." If Jesye
would rather not advertise something that isn't open yet, delete that `<section>`.

**4. Confirm publishing real prices.**
Every price from the tier documents is on the site. That was a deliberate
positioning choice — it's the main thing that separates this from competitors — but
it is Jesye's call.

---

## Deploying

**Vercel — this is the live setup.** The repo is connected to a Vercel project serving
`scg.revieweditmelo.com`. Pushing to `main` deploys. No build command, no output
directory.

`vercel.json` turns on `cleanUrls`, so pages are served without the `.html` —
`/services`, not `/services.html` — and any old `.html` URL 308-redirects to the clean
one. Internal links are written root-relative to match (`href="/services"`).

**Moving to another host:** the clean URLs are the one thing that won't follow you.
Netlify and Cloudflare Pages strip `.html` by default, so those work as-is. GitHub
Pages and traditional Apache hosts do not — on those you'd either restore the `.html`
in every internal link, or restructure each page into its own folder
(`services/index.html`) and link to `/services/` with the trailing slash.

**Custom domain:** point `stringfellowconstructiongroupllc.com` at the new host.
The old site should come down at the same time; its "quality work at a price you
can afford" positioning directly contradicts the new one.

---

## Editing

Everything is hand-editable HTML. A few things worth knowing:

**Previewing locally** needs a server that understands clean URLs — `npx vercel dev`
is the closest match to production. A plain `python3 -m http.server` will serve the
pages but every nav link 404s, because it won't map `/services` to `services.html`.
Opening the files directly from Finder has the same problem.

**Prices** appear in more than one place. Tier 1's `$227` is in `index.html`
(hero button, journey, tier row, CTA), `services.html`, and `contact.html`. Search
across all files when changing a number.

**The footer title block** is duplicated on every page. Change contact details in
all six files. It's the block starting `<div class="tblock">`.

**Colours and type** are all CSS custom properties at the top of `assets/css/site.css`
under `:root`. Change `--amber` there and it changes everywhere.

**Sheet numbers** — each page has a strip above the header reading "Sheet 01 / 05"
and a matching cell in the footer title block. If pages get added or removed, those
numbers need updating so the conceit holds.

---

## Design notes

The direction is called **Spec Sheet**. The premise: Jesye's product is
documentation — written findings, scopes, budgets, schedules, risk assessments — so
the site is built like a set of construction documents rather than a contractor
brochure.

- Pages alternate between **ink** (near-black, "the field") and **bone** (warm
  off-white, "the document"). Deliverables and written-output sections sit on paper.
- Section dividers are **true dimension lines** — extension ticks, arrowheads, a
  monospace callout. The callouts carry real labels, not decoration.
- The footer is a **drawing title block**. Contact details live inside it.
- Prices and metadata are **tabular monospace**, so they read like a schedule.
- Display type is Archivo pushed to its **expanded** width. Deliberately not
  condensed — condensed grotesks are the construction-industry default.
- **No border-radius anywhere.** No drop shadows, no gradients, no stock photography.
  If a photo of a hard hat or a handshake ever gets added, the whole thing collapses
  into every other contractor site.

Accessibility: responsive to 360px, visible keyboard focus throughout, semantic
landmarks, `prefers-reduced-motion` respected, all contact points are real `tel:`
and `mailto:` links. The site also prints cleanly — it's a spec sheet, so it should.

---

## Logo

Six SCG concepts are presented on `brand.html`, with the full colour system,
type specimens, lockups, clear-space rules, minimum sizes, and usage don'ts.

All six share the same geometric letterforms — S, C, and G built from straight
segments with 45° cut corners at a uniform stroke weight. They're drawn as paths,
not set in a typeface, so the mark never depends on a font being available.

Recommended pairing is **01 Plate** as the icon and **05 Chamfer** as the horizontal
wordmark. The header and favicon currently use 01 Plate. Once Jesye picks a
direction it gets refined and delivered as a full asset pack (SVG, PNG at multiple
sizes, one-colour and reversed variants, favicon set, social crops).

The crown and line elements from the previous mark are dropped entirely, as briefed.

---

## Source of truth

Copy, pricing, and audience positioning come from:

- `Stringfellow_Construction_Group_Tier_Service_Package_v1.pdf`
- `Stringfellow_Four_Tier_Target_Demographics_Full.pdf`

The full design rationale is in `2026-08-05-stringfellow-website-design.md`.

Those three files are **deliberately not in this repository** — it's public, and they
are internal strategy documents. They live in the working folder alongside it.

One boundary matters legally and appears on three pages: Stringfellow provides
documentation, estimating, planning, and owner representation — **not public
adjusting**. Don't soften that language.
