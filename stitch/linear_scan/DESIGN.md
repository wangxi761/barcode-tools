# Design System Document: Precision & Atmosphere

## 1. Overview & Creative North Star: "The Digital Precisionist"
This design system is built on the philosophy of **"The Digital Precisionist."** In an app dedicated to barcode tools, the UI must mirror the utility it provides: it should be sharp, scan-able, and utterly devoid of friction. 

We are moving beyond standard "Minimalism" into **"Editorial Utility."** This means breaking the rigid, boxy templates of standard utility apps in favor of intentional asymmetry, generous whitespace (the "breathing room"), and high-contrast typography scales. The goal is to make the act of scanning and managing data feel like interacting with a high-end physical scanner—tactile, premium, and authoritative.

---

## 2. Colors: Tonal Architecture
We utilize a monochrome-heavy palette to ensure the data (the barcodes) remains the hero. Contrast is our primary tool for hierarchy.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. Traditional dividers create visual "noise" that distracts from the barcode data. Boundaries must be defined solely through background color shifts or tonal transitions.

### Surface Hierarchy & Nesting
Instead of a flat grid, treat the UI as a series of physical layers—stacked sheets of fine paper.
*   **Base Layer:** `surface` (`#faf9fc`)
*   **Sub-Sectioning:** Use `surface-container-low` (`#f4f3f8`) to define broad functional areas.
*   **Primary Action Containers:** Use `surface-container-lowest` (`#ffffff`) for cards containing active data or scanner viewports to make them "pop" forward against the off-white background.

### The "Glass & Gradient" Rule
To elevate the experience, use **Glassmorphism** for floating action bars or tool-selection overlays. Use semi-transparent `surface` colors with a `backdrop-blur` of 16px–24px. 

**Signature Texture:** For main CTAs or the "Scan" button background, use a subtle vertical gradient from `primary` (`#5e5e5e`) to `primary-dim` (`#525252`). This adds a microscopic sense of "pressed" depth that flat hex codes cannot achieve.

---

## 3. Typography: Editorial Authority
The type system pairs **Manrope** (Display/Headline) with **Inter** (Body/Labels) to create a sophisticated, tech-forward aesthetic.

*   **Display & Headlines (Manrope):** These are the "Wayfinders." Use `display-lg` (`3.5rem`) for empty states or dashboard greetings. The geometric nature of Manrope provides an architectural feel.
*   **Body & Labels (Inter):** These are the "Information Carriers." Inter’s high x-height ensures that long strings of barcode data (EAN-13, QR codes, etc.) are legible even at `label-sm` (`0.6875rem`).
*   **The Contrast Play:** Always pair a `headline-sm` title with a `body-sm` description in `on-surface-variant` (`#5c5f68`) to create a clear informational hierarchy that feels like a modern technical manual.

---

## 4. Elevation & Depth: Tonal Layering
We do not use structural lines; we use light and shadow to define "what is touchable."

*   **The Layering Principle:** Depth is achieved by stacking. Place a `surface-container-lowest` card on top of a `surface-container-high` background. The subtle shift in lightness creates a "soft lift" that feels organic.
*   **Ambient Shadows:** For floating elements (like a scan-result modal), use extra-diffused shadows. 
    *   *Spec:* `0px 12px 32px rgba(47, 50, 58, 0.06)`. Note the use of `on-surface` (`#2f323a`) as the shadow tint rather than pure black.
*   **The "Ghost Border" Fallback:** If a container requires a border for accessibility (e.g., in high-glare environments), use a "Ghost Border."
    *   *Spec:* `outline-variant` (`#afb1bc`) at **15% opacity**. This provides a hint of structure without breaking the minimalist flow.

---

## 5. Components: Refined Utility

### Buttons (The Action Drivers)
*   **Primary:** Solid `primary` (`#5e5e5e`) with `on-primary` text. Use `rounded-md` (`0.375rem`) for a sharp, professional look.
*   **Secondary:** `surface-container-highest` background with `on-surface` text. No border.
*   **Tertiary:** Ghost style. `primary` text with no background. Use only for low-priority actions like "Clear All."

### Cards & Lists (The Data Containers)
*   **Rule:** Forbid the use of divider lines between list items. 
*   **Implementation:** Separate barcode entries using vertical whitespace (24px padding). If a clear separation is needed, alternate the background color of the list item between `surface` and `surface-container-low`.

### Input Fields
*   **State:** Use `surface-container-highest` (`#e0e2ec`) as the fill. 
*   **Focus:** Transition the background to `surface-container-lowest` and apply a 1px "Ghost Border" using the `primary` token at 40% opacity.

### Tool Selection Chips
*   Use `rounded-full` for chips. 
*   **Unselected:** `surface-container-high` background. 
*   **Selected:** `primary` background with `on-primary` text. This high-contrast jump clearly indicates the active tool.

### Scanner Viewport (App Specific)
The scanner should feel like a high-precision instrument. Use a `surface-dim` backdrop with a 40% opacity mask over the non-scanning areas. The "scanning line" should be a 1px `inverse-primary` (`#ffffff`) line with a soft `primary_container` outer glow.

---

## 6. Do’s and Don'ts

### Do:
*   **Use Asymmetry:** Place page titles at `headline-lg` and offset them to the left, leaving significant whitespace to the right to create an "Editorial" look.
*   **Prioritize Monochrome:** Rely on the `primary` and `secondary` grey scales. Only use `error` (`#9f403d`) for destructive actions like "Delete Scan."
*   **Embrace the Grid:** Use a strict 8pt grid system, but allow elements to span across multiple columns to avoid a cramped "mobile list" feel.

### Don’t:
*   **Don't use pure black:** Avoid `#000000`. Use `on-surface` (`#2f323a`) for text to maintain a premium, ink-on-paper feel.
*   **Don't use 100% opaque borders:** They clutter the UI. Always use background shifts or Ghost Borders.
*   **Don't use default "Card" shadows:** Avoid the "Material Design 2" heavy-bottom shadow. Opt for the multi-layered, diffused Ambient Shadows described in Section 4.