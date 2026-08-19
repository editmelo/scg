# Stringfellow Construction Group LLC — Website

Static HTML/CSS/JS. No build step, no framework, no dependencies to install.
Upload the contents of this repository to any host and it works.

---

## Files

The site runs two tracks under one brand: **Construction** and **Business**. Same
identity, same four-tier structure, different vocabulary depending on who arrives.

```
index.html               Home — two doors, both ladders          /
services.html            CONSTRUCTION · four tiers, priced       /services
insurance-recovery.html  CONSTRUCTION · tier 03 in full          /insurance-recovery
business/index.html      BUSINESS · landing page                 /business
business/services.html   BUSINESS · four tiers                   /business/services
about.html               Jesye Franklin  ← open placeholders     /about
contact.html             Call, email, service area               /contact
assessment.html          Client Fit & Engagement Assessment      /assessment
brand.html               Logo concepts (noindex, footer-linked)  /brand
favicon.svg
vercel.json              cleanUrls — see Deploying
assets/css/site.css      The whole design system, one file
assets/js/site.js        Mobile menu, services dropdown, header state, scroll reveals
assets/logo/             Six SCG logo concepts as SVG
assets/img/              Urban League logo; Jesye's photo goes here
```

Sheets are numbered 01-07 across the set and the strip above the header names the
track. If pages are added or removed, update both the strip and the matching footer
title-block cell on **every** page so the numbering stays honest.

**Asset paths are root-relative** (`/assets/...`). They have to be — `/business/services`
sits one level deep, and relative paths would resolve against `/business/`.

---

## The assessment

`assessment.html` is Jesye's Client Fit & Engagement Assessment: eight sections, about
six minutes, branching between the construction and business paths, scoring to a tier
or to a "not a fit" outcome with hard disqualifiers.

**It is deliberately self-contained.** Its CSS and JS are inline and it does *not* load
`site.css`. That's not an oversight — it uses the same brand tokens, but its class names
(`.nav`, `.btn`, `.sheet`, `.wrap`, `.foot`) collide head-on with the site's. Loading
both would break one or the other. Edit its styles inside the file.

What was changed from the file Jesye supplied: the placeholder SCG logo swapped for the
real chamfered mark, a site nav row added under the masthead, the off-site absolute
links pointed back on-domain, a favicon added, and the print rule fixed so the mark
doesn't black out.

**Delivery.** Results can be printed, copied, or emailed. Two constants near the top of
its script control this:

```
const SUBMIT_ENDPOINT = "";                    // Formspree/Basin/etc. POST url
const CONTACT_EMAIL   = "frjesye1@gmail.com";  // used by the email button
```

Leave `SUBMIT_ENDPOINT` empty and completed assessments only reach Jesye if the visitor
clicks the email button, which opens their mail client. **Paste a form endpoint in and
they arrive automatically** — worth doing before this gets real traffic, because the
mailto route loses anyone without a configured desktop mail client.

### The popup

`site.js` injects a prompt three seconds after load. It is:

- **remembered** — dismissing or clicking through writes `scg.assessment.prompt.v1` to
  localStorage, so a visitor is asked once, not on every page
- **suppressed** on `/assessment` and `/brand`
- keyboard-operable: Escape closes, focus is trapped while open and returned on close
- silent under `prefers-reduced-motion` and absent entirely without JavaScript

Tuning lives in three constants at the top of that block — `AP_DELAY`, `AP_SKIP`,
`AP_KEY`. Bumping `AP_KEY` to `v2` re-prompts everyone who already dismissed it.

To see it again while working: `localStorage.removeItem('scg.assessment.prompt.v1')`.

Only external request is Google Fonts (Archivo + JetBrains Mono).

---

## Before this goes live

**1. Confirm the phone number.**
The old site says `317-677-5243`. The number supplied for this build was
`317-667-5243`, and that is what's used everywhere — in visible text and in every
`tel:` link. If the old one is correct, search and replace both `(317) 667-5243`
and `+13176675243` across all eight HTML files.

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
`<img src="/assets/img/jesye.jpg" alt="Jesye Franklin" style="aspect-ratio:4/5;object-fit:cover;width:100%">`.

**3. Business pricing for tiers 02-04.**
Only tier 01 is priced ($227 / $100 per hour). The other three read "Scoped after the
consultation" because Jesye hasn't set rates for this line. That's a defensible
position and can stay indefinitely — but if he wants numbers published the way the
construction side does, they go in `business/services.html`.

**4. Confirm the broadened tier 03 scope.**
Construction tier 03 was insurance recovery only. It now also covers troubled projects,
contractor disputes, defective work, and cost overruns. Confirm that matches what he'll
actually take on. The URL stayed `/insurance-recovery` on purpose — it's the
high-intent search term and it's already indexed.

**5. Decide on the Membership section.**
`services.html` shows the $49 / $99 / $199 tiers marked "In development." If Jesye
would rather not advertise something that isn't open yet, delete that `<section>`.

**6. Wire up assessment delivery.**
Set `SUBMIT_ENDPOINT` in `assessment.html` so completed assessments land in an inbox
instead of depending on the visitor's mail client. See "The assessment" above.

**7. Reconcile the tier names and prices between the assessment and the site.**
They don't currently match, and a visitor can see both in one session:

| | Assessment | Site |
|---|---|---|
| Tier 02 | PLAN — "From $997" | Construction "From $997"; **Business "Scoped after the consultation"** |
| Tier 03 | IMPLEMENT / RECOVER — "Quoted per engagement" | Construction **"From $497"** |
| Tier 04 | PARTNER / SCALE — "From $10,000" | Construction "Build"; Business "Scale" |

The assessment uses one unified ladder across both tracks; the site uses track-specific
names. Both are defensible on their own, but the price lines contradict each other.
Jesye's call which is right — then make the other match.

**8. Confirm publishing real prices.**
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

**Prices** appear in more than one place. `$227` is now the entry point for *both*
tracks and appears in `index.html`, `services.html`, `business/index.html`,
`business/services.html`, and `contact.html`. Search across all files when changing a
number.

**The header and footer are duplicated on every page.** There's no templating. The nav
dropdown, the footer title block, and contact details each appear in all eight files.
Change one, change them all — `grep` for the string first.

**Colours and type** are all CSS custom properties at the top of `assets/css/site.css`
under `:root`. Change `--amber` there and it changes everywhere.

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
