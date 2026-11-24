# Oja: project brief for Claude Code

Put this file at the root of the repo (`Desktop\oja\CLAUDE.md`). Claude Code reads it at the start of every session.

The approved homepage design is `oja-home.html` (open it in a browser). It is the visual source of truth. If this file and the HTML disagree on a design detail, the HTML wins. Copy it into the repo as `design/oja-home.html` so you can read it.

---

## 1. How we work (read this first)

Mitchell types the code. Claude guides, explains and reviews. This is Mitchell's portfolio project, and he wants to learn and own every line.

- **Don't write or scaffold the app for him.** No generating whole files or running build commands unless he asks for that specific piece.
- Give **small numbered steps**: the command or a short snippet, then one or two lines on *why*.
- End each step with a **check** ("run `npm run dev` and tell me what you see"), then wait.
- When he pastes code, **review it**: what's right, what's wrong, and why. Point him to the fix rather than rewriting it, unless he asks.
- Before anything non-trivial, list your assumptions and a short plan, and let him correct them.
- Keep it simple. Prefer the boring, obvious solution. Push back when an idea has a real problem, and say what the problem is.
- He is on **Windows**, using VS Code and PowerShell. Give commands that work there.
- Plain **JavaScript**, not TypeScript. He decided this.

---

## 2. What Oja is

A Jumia-style **multi-vendor marketplace** for Nigeria: clothes, food and groceries, phones, home goods, and anything else. "Oja" is Yoruba for "market". Many sellers list products, a customer can buy from several sellers in one checkout, and the platform takes a commission.

### Stack

| Layer | Choice |
|---|---|
| Client | React (Vite), React Router, Tailwind CSS v4 |
| Server state | TanStack Query (planned) |
| Charts | Recharts (seller and admin dashboards) |
| Icons | Phosphor (`@phosphor-icons/react`, MIT). The design uses the regular weight for UI and the duotone weight for product and category art |
| Server | Node.js + Express |
| Database | MongoDB Atlas (account exists) + Mongoose |
| Images | Cloudinary (account exists), signed direct uploads from the browser |
| Auth | JWT access + refresh tokens in httpOnly cookies, bcrypt |
| Validation | Zod (planned) |
| Email | Nodemailer or Resend |
| Payments | Paystack first, then Flutterwave, test mode only. NGN currency |
| Hosting (free) | Client on Vercel or Netlify, server on Render, database on Atlas M0 |

Repo layout: one repo with `client/` and `server/`.

### Roles

One `role` field on the User model: `customer`, `seller`, `admin`.

- **Customer:** browse, search and filter; cart and wishlist; checkout; order tracking and history; cancel before shipping; request a return; review products they received; manage profile and addresses; apply to become a seller.
- **Seller:** everything a customer can do, plus a store profile (name, logo, banner, payout details), product CRUD with images, variants and stock, see only their part of each order, update fulfilment (processing, shipped with tracking, delivered), reply to reviews, a dashboard with charts (sales over time, orders by status, top products, low stock), payout history.
- **Admin (Mitchell):** approve, reject or suspend sellers; ban customers; manage categories; moderate products and reviews; view all orders and handle disputes and refunds; set the commission rate; platform charts. Admins are created by a **seed script**, never by a signup page.

### Business rules already decided

- **Orders split by seller.** One Order holds several SubOrders, one per seller.
- **Shipping:** each store sets one flat fee and an optional free-shipping threshold. A cart with 3 sellers pays 3 fees. Sellers type the carrier and tracking number as free text.
- **Guest checkout is allowed.** The order is still stored (`customer: null`, `guestEmail`). Guests get a PDF receipt by email and as a download on the success page (with a visible "Download receipt" button too), and an order lookup page (order number + email).
- **Returns:** 10 days from delivery. The seller pays return shipping. A seller's money for a SubOrder is held until the 10-day window closes.
- **Payouts are simulated.** The admin marks them as paid.
- **Commission: open question.** The planning chat chose 10% flat, but the homepage copy says 8%. Ask Mitchell which one before building anything that uses it. Store it in a settings document, never hardcoded.

---

## 3. Colours: the "Sunshine" palette

| Name | Hex | Use |
|---|---|---|
| Navy | `#181D50` | All text, announcement bar, Fashion tile, hero stage, seller block, footer logo |
| Royal blue | `#1746A2` | Links, the highlighted headline word, icons, focus rings |
| Sky blue | `#5F9DF7` | Tiles and shapes only, never text |
| Orange | `#FF731D` | Main buttons, sale tags, Groceries tile, badges, logo dot |
| Cream | `#FFF7E9` | Page background. Cards are white |

Supporting tokens from the design:

```
surface      #FFFFFF   cards
surface-2    #FCEEDA   warm secondary surface
muted        #4B5079   secondary text
line         #EADFCB   borders
action-hover #FF8B45   orange button hover
navy-2       #222866
on-navy-muted #C3C6E0  secondary text on navy
tile-a #E3EEFE  tile-b #C9DCFC  tile-d #FFE6D3   pale tile backgrounds
```

### Contrast rules (WCAG AA = 4.5:1 for normal text)

- **Orange never carries text.** Orange on cream is 2.6:1 and white on orange is 2.7:1, so orange buttons use **navy text** (5.8:1).
- Royal blue on cream is 8.1:1. Navy on cream is 14.8:1. Navy on sky blue is 5.8:1.
- Light theme only. No dark mode for now.

### Tailwind v4 setup

Tailwind v4 defines the theme in CSS, so this goes in `client/src/index.css`:

```css
@import "tailwindcss";

@theme {
  --color-navy: #181D50;
  --color-navy-2: #222866;
  --color-royal: #1746A2;
  --color-sky: #5F9DF7;
  --color-orange: #FF731D;
  --color-orange-hover: #FF8B45;
  --color-cream: #FFF7E9;
  --color-surface-2: #FCEEDA;
  --color-muted: #4B5079;
  --color-line: #EADFCB;
  --color-on-navy-muted: #C3C6E0;
  --color-tile-a: #E3EEFE;
  --color-tile-b: #C9DCFC;
  --color-tile-d: #FFE6D3;

  --font-display: "Bricolage Grotesque", "Segoe UI", system-ui, sans-serif;
  --font-body: "Figtree", "Segoe UI", system-ui, sans-serif;

  --ease-out-expo: cubic-bezier(.16, 1, .3, 1);
  --radius-card: 16px;
  --radius-block: 28px;
}
```

This gives classes like `bg-cream`, `text-navy`, `bg-orange`, `font-display`, `rounded-card`, `ease-out-expo`.

---

## 4. Type

- **Headings:** Bricolage Grotesque, weight 700, line-height 1.05, letter-spacing -0.025em, `text-wrap: balance`.
- **Body:** Figtree 400 to 700, 16px, line-height 1.6.
- **Logo:** Bricolage Grotesque **800**.
- Prices use `font-variant-numeric: tabular-nums` (Tailwind `tabular-nums`).

Google Fonts link (put it in `client/index.html`). Note the 800 weight for the logo, which the prototype's link is missing:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Figtree:wght@400;500;600;700&display=swap">
```

Heading sizes on the homepage: hero h1 `clamp(42px, 5.4vw, 72px)`, section h2 `clamp(32px, 3.8vw, 48px)`, category tile h3 26px (Fashion tile `clamp(32px, 3.4vw, 44px)`).

---

## 5. The logo

The wordmark is **"Oja"** followed by an **orange dot**.

- "Oja" with a capital O, Bricolage Grotesque 800, letter-spacing -0.04em, line-height 1, navy (cream on navy backgrounds).
- The dot is a **drawn circle, not a full stop**, so its size and colour stay exact: `0.2em` wide and tall, `border-radius: 50%`, orange `#FF731D`, `margin-left: 0.05em`, sitting on the baseline (`display: inline-flex; align-items: baseline` on the wrapper).
- Header size: 32px. Loader size: `clamp(72px, 12vw, 120px)`.
- **Header hover:** the dot hops once.

```html
<a class="logo" href="/" aria-label="Oja home">Oja<i class="dot"></i></a>
```

```css
.logo { display:inline-flex; align-items:baseline; font-family:var(--font-display); font-weight:800; font-size:32px; letter-spacing:-.04em; line-height:1; color:#181D50; }
.logo .dot { display:inline-block; width:.2em; height:.2em; border-radius:50%; background:#FF731D; margin-left:.05em; }
.logo:hover .dot { animation: hop .6s cubic-bezier(.16,1,.3,1); }
@keyframes hop { 0%,100% { transform:none } 40% { transform:translateY(-.35em) } }
```

In React this is a small `<Logo />` component used in the header, footer and loader.

---

## 6. Animations

All motion must respect `prefers-reduced-motion`. The prototype turns every animation and transition off when it is set. The shared easing is `cubic-bezier(.16, 1, .3, 1)`.

### Loading screen (the dot-drop)

- Full-screen cream overlay with the big logo centred.
- The dot **drops in from above** with a small overshoot: 0.9s, starting at 0.25s, easing `cubic-bezier(.3, 1.4, .5, 1)`.
- Then it **bounces with a squash** on a 0.9s loop from 1.3s, while the page loads.
- Stays at least **1.8s** (0s with reduced motion), then **fades out over 0.5s**.

```css
.loader { position:fixed; inset:0; z-index:100; background:#FFF7E9; display:grid; place-items:center; transition:opacity .5s cubic-bezier(.16,1,.3,1), visibility .5s; }
.loader.done { opacity:0; visibility:hidden; }
.loader .logo { font-size:clamp(72px,12vw,120px); }
.loader .dot { animation: drop .9s cubic-bezier(.3,1.4,.5,1) .25s both, bounce .9s ease-in-out 1.3s infinite; }
@keyframes drop { 0% { transform:translateY(-3em); opacity:0 } 60% { transform:translateY(.08em); opacity:1 } 80% { transform:translateY(-.04em) } 100% { transform:none } }
@keyframes bounce { 0%,100% { transform:none } 10% { transform:scale(1.15,.85) } 45% { transform:translateY(-.45em) scale(.95,1.05) } 80% { transform:none } }
```

In React: a `<Loader />` that renders on first load, waits for `window` `load` plus the 1.8s minimum, then adds `done`.

### Everything else

| Where | What happens | Timing |
|---|---|---|
| Hero copy | Eyebrow, h1, lede and buttons rise in a stagger (fade + 28px up) | 0.9s each, delays .05 / .15 / .28 / .4s |
| Hero stage | Navy panel with a slow drifting colour mesh (royal, sky, orange radial gradients) and a faint dot grid | Drift 16s, alternate, infinite |
| Hero featured card | Floats up and down 12px | 6s loop |
| Hero featured card | Tilts toward the pointer, up to ±7deg (desktop with hover only) | 0.5s transition, via requestAnimationFrame |
| Hero featured card | Swaps to the next product (clothes, food, phones) with a fade + 8px slide | Every 3.8s, 0.35s swap |
| Hero chips | Three glass chips ("Arrives in 2 to 4 days", "Sellers rated 4.8", "Paid securely") rise in | Delays .5 / .7 / .9s |
| Header | Gets a border and shadow once you scroll. Uses an IntersectionObserver on a 1px sentinel, no scroll listener | 0.3s |
| Logo | Dot hops on hover | 0.6s |
| Buttons | Press scales to 0.97; arrow icon nudges 3px right on hover; orange button gets a soft orange glow | 0.2s |
| Category tiles | Lift 4px; art rotates -8deg and scales 1.08 | 0.4s / 0.7s |
| Product cards | Image gets a shadow; art scales 1.08 and tilts -4deg; "Add to bag" slides up from the bottom (always visible on phones) | 0.4s / 0.6s / 0.35s |
| Wishlist heart | Pops (scale 1 → 1.5 → 0.9 → 1) and fills orange; header count bumps | 0.45s |
| Add to bag | An orange bag bubble arcs from the button into the header bag (140px above the higher point), the count bumps, a navy toast slides up bottom-right for 2.6s | 0.76s arc, `cubic-bezier(.5,0,.3,1)` |
| Filter pills | Remaining cards glide to their new slots (FLIP); newly shown cards fade up, 50ms apart | 0.45s glide, 0.55s fade |
| Sections | Fade up when scrolled into view (threshold 0.12); children stagger 70ms apart | 0.8s / 0.7s |
| Seller stats | Numbers count up (8%, 36) with an ease-out cubic | 1.2s |
| Deals timer | Counts down to midnight Lagos time (UTC+1), every second | 1s |

**three.js comes later.** The hero featured card is the spot for a 3D product model. Don't add it until Mitchell asks.

---

## 7. Shapes and components

- **Pills for every button and control** (`border-radius: 999px`). Cards and tiles 16px corners. Big feature blocks (hero stage, seller block) 28px.
- **Primary button:** 52px tall, padding 0 26px, orange background, navy text, weight 600, 15.5px.
- **Outline button:** 1.5px `line` border, navy text; the border turns navy on hover.
- **Focus ring:** 2px royal blue outline, offset 3px.
- **Inputs:** 52px pills, white, 1.5px `line` border, royal border on focus. Search bar is 44px.
- **Count badges** (bag, wishlist): orange with navy text, hidden at 0.
- **Shadows:** `0 18px 40px rgba(24,29,80,.10)`, large `0 30px 70px rgba(24,29,80,.22)`.
- **Content width:** max 1240px, 16px side padding.
- Prices in naira: `"₦" + value.toLocaleString("en-NG")`, e.g. ₦14,500.
- Product images are icon placeholders for now. Real photos will come from Cloudinary.

---

## 8. The homepage, top to bottom

1. **Announcement bar** (navy, 13px): "Free delivery in Lagos on orders over ₦50,000", "10-day returns on every order", "Pay with Paystack or Flutterwave". Phones show only the first.
2. **Sticky header** (72px, translucent cream with blur): menu button (phones only), logo, nav (Deals, Categories, Sell on Oja; hidden under 1024px), search pill ("Search rice, sneakers, phones...", hidden on phones), account, wishlist and bag icons with counts.
3. **Hero**, split two columns (stacks under 1024px):
   - Left: eyebrow pill "1,240 verified Nigerian sellers", h1 "Clothes, food and everything else, **delivered.**" (the last word royal blue with an orange underline), lede, buttons "Shop today's deals" (orange) and "Start selling" (outline).
   - Right: navy stage with the drifting mesh, three glass chips, and the floating white featured-product card (seller, name, price, orange add button).
4. **Trust row** (thin lines above and below, no cards): Verified sellers, Secure payment, Nationwide delivery, 10-day returns. Four columns, two on tablets, one on phones.
5. **Shop by category**, a bento grid (4 columns, two 220px rows): Fashion (big navy tile spanning 2 rows), Groceries and food (orange gradient, spans 2 columns), Phones, Home and kitchen, Beauty, Everything else. Each has duotone art in the corner.
6. **Today's deals**: h2 with a navy countdown pill, filter pills (All, Fashion, Food, Home, Phones), then a product grid (4 columns, 3 on tablets, 2 on phones). Each card: 4:5 tinted image area, sale % or tag badge, heart button, slide-up "Add to bag", verified seller name, product name, price with the old price struck through, star rating and count.
7. **Seller block** (navy, 28px corners, royal glow top-right): "Open your store in an afternoon.", paragraph, orange "Start selling" button, and stat tiles (commission, 36 states, "Your own storefront page").
8. **Newsletter**: "Get the deals first.", email field and Subscribe button.
9. **Footer**: logo and tagline, Shop / Sell / Help link columns, legal line with Paystack and Flutterwave pills.

Breakpoints: 1024px (tablet) and 767px (phone).

### Sample products used in the design

| Product | Seller | Category | Price | Was |
|---|---|---|---|---|
| Men's Ankara print shirt | Kezi Fashion | fashion | ₦14,500 | ₦18,000 |
| Long grain parboiled rice, 25kg | Agege Foodstore | food | ₦52,000 | (Bestseller) |
| Women's block heels | Lola Shoes | fashion | ₦22,000 | |
| Red palm oil, 5 litres | Enugu Farm Fresh | food | ₦13,500 | ₦15,500 |
| Android phone, 128GB | TechHub NG | tech | ₦189,000 | ₦215,000 |
| Slim fit jeans, dark wash | Yaba Denim | fashion | ₦16,800 | |
| Smoked catfish, 1kg | Epe Fish Market | food | ₦9,800 | (New) |
| Non-stick pot set, 5 pieces | Ile Kitchen | home | ₦34,500 | ₦42,000 |

---

## 9. Not designed yet

Product listing, product detail, cart and checkout, seller dashboard, admin dashboard, auth pages, mobile nav drawer. Build them from the same tokens and components. Ask Mitchell before inventing a new look.

---

## 10. Where the build stands (24 Nov 2026)

**Step 1, in progress:** Mitchell is setting up the two apps in `Desktop\oja`:

- `client/`: `npm create vite@latest client -- --template react`, then `npm install tailwindcss @tailwindcss/vite`, the Tailwind plugin added to `vite.config.js`, and `@import "tailwindcss";` in `src/index.css`.
- `server/`: `npm init -y`, then `npm install express mongoose cors dotenv` and `npm install -D nodemon`.

Check that both are done before moving on.

**Planned next steps:**

2. Theme: the `@theme` tokens above, the fonts, and the `<Logo />` component.
3. The dot-drop `<Loader />`.
4. Homepage components (Header, Hero, TrustRow, CategoryBento, DealsGrid with ProductCard, SellerBlock, Newsletter, Footer) using mock data.
5. Server: `server.js` with a health route, MongoDB Atlas connection via `.env`, a Product model and `GET /api/products`, then point the homepage at it.

After that: auth and roles, then the seller and admin areas.

Never commit `.env`. Add it to `.gitignore` in step 5.
