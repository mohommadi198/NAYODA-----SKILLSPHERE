---
name: Lumina Nexus
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#444653'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#757684'
  outline-variant: '#c4c5d5'
  surface-tint: '#3755c3'
  primary: '#00288e'
  on-primary: '#ffffff'
  primary-container: '#1e40af'
  on-primary-container: '#a8b8ff'
  inverse-primary: '#b8c4ff'
  secondary: '#4648d4'
  on-secondary: '#ffffff'
  secondary-container: '#6063ee'
  on-secondary-container: '#fffbff'
  tertiary: '#003853'
  on-tertiary: '#ffffff'
  tertiary-container: '#005074'
  on-tertiary-container: '#68c4ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary-fixed: '#001453'
  on-primary-fixed-variant: '#173bab'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#c9e6ff'
  tertiary-fixed-dim: '#89ceff'
  on-tertiary-fixed: '#001e2f'
  on-tertiary-fixed-variant: '#004c6e'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The design system is engineered for a high-performance hyperlocal freelance ecosystem. It balances the reliability of a professional marketplace with the cutting-edge feel of a modern SaaS platform. The aesthetic is rooted in **Modern SaaS Glassmorphism**, utilizing translucent layers, strategic backdrop blurs, and precise borders to create a sense of depth and technical sophistication.

The interface should feel airy, expansive, and high-tech. By leveraging soft shadows and atmospheric blurs, the UI guides the user's focus toward actionable data while maintaining a lightweight visual footprint. It targets professional freelancers and enterprise clients who demand efficiency, clarity, and a premium digital experience.

## Colors

The palette is anchored by **Deep Blue (#1E40AF)** for authority and **Indigo (#6366F1)** for modern dynamism. 

### Color Application
- **Primary & Secondary:** Use the Deep Blue for core brand elements and primary buttons. Use Indigo for interactive highlights, active states, and focus indicators.
- **Surface Strategy:** In light mode, use ultra-clean whites and subtle Slate Gray (#F8FAFC) for background sections. 
- **Dark Mode:** Transition to a deep navy foundation (#0F172A). Surfaces should utilize a slightly lighter slate (#1E293B) to maintain contrast.
- **Glassmorphism:** Use semi-transparent white (80% opacity) or dark slate (70% opacity) with a `20px` backdrop blur for headers and floating panels.

## Typography

This design system utilizes **Inter** for its neutral, highly legible, and systematic qualities. 

### Rules
- **Tracking:** Headings use slight negative letter-spacing for a tighter, more "designed" look, while body text and labels use generous positive tracking to ensure readability in data-heavy views.
- **Hierarchy:** Maintain a clear distinction between informational body text and functional labels. Labels should often appear in medium or semi-bold weights to stand out against UI chrome.
- **Scale:** Use the `display-lg` sparingly for hero sections and dashboard overviews. For content-heavy pages, rely on `headline-md` and `body-md`.

## Layout & Spacing

The system is built on a strict **8px square grid**. All padding, margins, and heights must be multiples of 8 to ensure mathematical harmony across the layout.

### Grid & Responsiveness
- **Desktop:** 12-column fluid grid with 24px gutters and 40px side margins.
- **Tablet:** 8-column grid with 24px gutters and 24px side margins.
- **Mobile:** 4-column grid with 16px gutters and 16px side margins.
- **Alignment:** Use generous whitespace (`lg` or `xl` spacing) between major sections to emphasize the "clean SaaS" aesthetic. Elements within cards should use `sm` or `md` spacing.

## Elevation & Depth

Depth is achieved through a combination of **Glassmorphism** and **Ambient Shadows**.

- **Level 1 (Base):** Flat background.
- **Level 2 (Cards):** Low-opacity borders (1px, #E2E8F0 at 50%) with a very soft, diffused shadow (0px 4px 20px rgba(0, 0, 0, 0.05)).
- **Level 3 (Modals/Dropdowns):** Pronounced backdrop blur (20px) with a semi-transparent surface. Use a multi-layered shadow to simulate "floating" (0px 20px 40px rgba(0, 0, 0, 0.12)).
- **Dark Mode Depth:** Instead of pure shadows, use "inner glow" borders (1px top border at 10% white) to define edges against dark backgrounds.

## Shapes

The design system uses a high-radius shape language to feel approachable yet professional.
- **Standard Radius:** 0.5rem (8px) for small components like inputs and checkboxes.
- **Large Radius (rounded-lg):** 1rem (16px) for cards and profile sections.
- **Extra Large Radius (rounded-xl):** 1.5rem (24px) for main container cards and modal windows.
- **Buttons:** Use `rounded-lg` for a modern, sophisticated look that isn't fully pill-shaped.

## Components

### Buttons & Inputs
- **Primary Button:** Deep Blue background, white text, subtle indigo gradient (top to bottom).
- **Secondary/Ghost:** 1px border using the primary color with a 5% background tint on hover.
- **Inputs:** Clean white backgrounds in light mode, dark slate in dark mode. Use a 2px Indigo border on `:focus` with a subtle outer glow.

### Glassmorphic Headers
- Sticky navigation bars should use a 70-80% opacity background color paired with a `backdrop-filter: blur(12px)`. Include a fine 1px bottom border to separate from content.

### Modern Tables & Charts
- **Tables:** No vertical borders. Use soft horizontal dividers and alternating row colors (1% primary tint).
- **Charts:** Use the Indigo and Tertiary Blue for data series. Area charts should use semi-transparent gradients that fade into the background.

### Professional Cards
- Cards feature a `rounded-xl` corner radius. In light mode, use a white background with a 1px border in Slate-200. In dark mode, use Slate-800 with a subtle top-light highlight to define the edge.

### Status Indicators
- Use small, high-contrast chips for status (e.g., "Active", "Pending"). Ensure text is bold and the background is a highly desaturated version of the status color for readability.