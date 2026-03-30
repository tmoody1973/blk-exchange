# BLK Exchange Share Card Templates

## For: Gemini 3.1 Flash Image Preview (Nano Banana 2)
## Model ID: `gemini-3.1-flash-image-preview`

Generate 4 share card background templates. These are the visual frameworks that dynamic player data renders on top of. No text in the images except the BLKX brand mark. All text (player name, concept, stats) is overlaid by the app at runtime.

---

## Global Rules

- **Size**: 1080x1080 (square, works on Instagram, X, and stories when cropped)
- **Style**: Neobrutalist. Hard edges, no rounded corners, no gradients, no soft shadows.
- **Background**: Black (#0A0A0A)
- **Borders**: White (#FFFFFF), 4px thick
- **All text areas left BLANK** — the app fills them in. The template provides the visual frame only.
- **BLKX logo mark** in the bottom-right corner of every card (white "BLK" + purple "X")
- **"blkexchange.com"** in small white monospace text, bottom center
- **No photography, no people, no realistic elements.** Abstract geometric shapes and lines only.

---

## Card 1: Concept Unlock

**Purpose:** Shared when a player unlocks a new investing concept in the Knowledge Vault.

**Prompt:**
```
Social share card background, 1080x1080px, solid black background #0A0A0A.
Neobrutalist design with 4px white border around the entire card.
Top section: a horizontal bar with a subtle purple (#7F77DD) accent stripe.
Center: a large empty rectangular area (approximately 600x300px) for white text overlay. This is where the concept name and definition will go.
Below center: a smaller empty area for player name and progress stats.
Left edge: vertical accent bar in purple (#7F77DD), 8px wide, running from top to about 60% down.
Bottom-right corner: small "BLKX" text mark (white "BLK", purple "X") in Courier New monospace.
Bottom center: small space for "blkexchange.com" text.
Decorative elements: 2-3 small geometric shapes (squares, lines, dots) in white at 10% opacity scattered in the margins. Minimal. Not busy.
Overall feel: clean, bold, confident. Like a certificate of achievement designed by a streetwear brand.
No text except the BLKX mark. Everything else is blank space for dynamic overlay.
Style: flat, minimal, neobrutalist. No gradients, no glow, no 3D.
```

**Dynamic text overlaid by app:**
- Concept name (large, white, bold)
- One-line definition (smaller, white/gray)
- Player name + "X of 23 concepts unlocked"
- Tier badge (Foundation/Intermediate/Advanced/Economics)

---

## Card 2: Portfolio Share

**Purpose:** Shared when a player wants to show off their portfolio performance.

**Prompt:**
```
Social share card background, 1080x1080px, solid black background #0A0A0A.
Neobrutalist design with 4px white border around the entire card.
Top section: a horizontal strip suggesting a stock ticker tape or market data bar. Abstract, not literal. White and green (#22c55e) geometric fragments suggesting upward movement.
Center: large empty area for portfolio value text overlay (the big number).
Below center: three empty rectangular boxes in a row (approximately 200x100px each) with thin white borders and dark (#1A1A1A) fill. These are stat boxes where Holdings, Sectors, and Concepts numbers will go.
Bottom section: separated by a thin white horizontal line. Space for player name and tagline.
Bottom-right: BLKX mark (white BLK, purple X).
Bottom center: space for "blkexchange.com".
Accent color: green (#22c55e) for upward/positive energy. Used sparingly in the ticker tape area and maybe one thin line element.
Decorative: very subtle grid lines at 5% opacity suggesting a stock chart in the background. Not a real chart. Just the vibe of a chart.
No text except BLKX mark. All blank for dynamic overlay.
Style: flat, minimal, neobrutalist. Finance meets streetwear.
```

**Dynamic text overlaid by app:**
- Portfolio value (huge, white, bold)
- Daily change % (green or red)
- Holdings count, Sectors count, Concepts unlocked (in the three boxes)
- Player name

---

## Card 3: Session Debrief

**Purpose:** Shared when a player finishes a session and gets their AI-generated debrief narrative.

**Prompt:**
```
Social share card background, 1080x1080px, solid black background #0A0A0A.
Neobrutalist design with 4px white border around the entire card.
Top section: a horizontal bar with purple (#7F77DD) accent. Space for "SESSION DEBRIEF" label and player name.
Center: a large empty area styled like a quote or letter. Left edge has a thick purple (#7F77DD) vertical bar (8px) running alongside the text area, suggesting a blockquote. The empty space should feel like it's waiting for 3-4 lines of narrative text.
Below the quote area: a thin horizontal white line separator.
Bottom section: three small stat areas in a row for session stats (trades made, concepts unlocked, portfolio change).
Bottom-right: BLKX mark.
Bottom center: "blkexchange.com".
Decorative: a very subtle "AI" badge or small circuit-like geometric pattern near the top-right corner suggesting the debrief is AI-generated. Abstract, not literal.
Overall feel: personal, reflective, like receiving a handwritten letter about your trading session. But in neobrutalist packaging.
No text except BLKX mark.
Style: flat, minimal, neobrutalist.
```

**Dynamic text overlaid by app:**
- "SESSION DEBRIEF" header
- Player name
- 2-3 sentence excerpt from the AI debrief (the best/most interesting lines)
- Session stats: trades, concepts, portfolio change

---

## Card 4: Graduation / Real Exchange

**Purpose:** Shared when a player unlocks The Real Exchange or buys NACP.

**Prompt:**
```
Social share card background, 1080x1080px, solid black background #0A0A0A.
Neobrutalist design with 4px white border. This card should feel special and different from the other three. More gold, more weight.
Top section: a gold (#FDE047) horizontal accent bar instead of purple. This is the premium card.
Center: large empty area for the graduation message. The space should feel ceremonial, like a diploma or achievement.
A gold (#FDE047) star element (geometric, not decorative) in the upper-left area of the center section. Abstract five-pointed star, flat, bold.
Below center: empty area for the player's real exchange stats (real tickers traded, NACP held, diversification score).
Bottom section: separated by gold line instead of white. Space for player name.
Bottom-right: BLKX mark (this time with gold "X" instead of purple to match the premium feel).
Bottom center: "blkexchange.com".
Decorative: subtle geometric pattern suggesting stock exchange floor or financial architecture. Abstract lines at 5% opacity. Premium but not flashy.
Overall feel: achievement, graduation, "you made it." The gold star and gold accents set this apart from the everyday purple cards.
No text except BLKX mark.
Style: flat, minimal, neobrutalist. Gold and black. Confidence.
```

**Dynamic text overlaid by app:**
- "WELCOME TO THE REAL EXCHANGE" or graduation message
- Player name
- Real tickers unlocked
- NACP status
- Diversification score

---

## How These Get Used in the App

1. **Nanobanana generates 4 PNGs** (1080x1080 each)
2. Save to `public/cards/concept-bg.png`, `public/cards/portfolio-bg.png`, `public/cards/debrief-bg.png`, `public/cards/graduation-bg.png`
3. A hidden React component renders the card: background image + dynamic text positioned on top using absolute positioning
4. `html2canvas` captures the component as a PNG blob
5. `navigator.share({ files: [blob] })` on mobile opens native share sheet with the image
6. On desktop: card preview modal with "Copy Image" / "Download PNG" / "Post to X" buttons

The player sees a beautiful branded card with their personal data, taps one button, and it goes straight to their social feed as an image, not a link, not plain text.

---

## Generation Order

1. **Concept Unlock** (most frequently shared, 23 opportunities per player)
2. **Portfolio Share** (shared anytime from portfolio page)
3. **Session Debrief** (shared after each session)
4. **Graduation** (shared once, the biggest moment)

---

## Install html2canvas

```bash
pnpm add html2canvas
```

Then build a `ShareCardRenderer` component that:
- Takes card type + dynamic props
- Renders a hidden 1080x1080 div with background image + text overlay
- Captures with html2canvas
- Returns the blob for sharing
