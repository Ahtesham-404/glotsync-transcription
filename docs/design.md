# Design System

## Visual Language

GlotSync AI uses a premium dark-first design inspired by modern developer tools and SaaS platforms.

### Core Principles
- **Dark by default**: Surface-950 (#06070f) background
- **Glassmorphism**: `backdrop-blur` + semi-transparent surfaces
- **Brand gradients**: Indigo → Purple → Pink
- **Subtle depth**: Multi-layer shadows, border contrast
- **Smooth animation**: Framer Motion, 200-450ms durations

---

## Color Palette

### Brand Colors (Indigo)
| Token | Hex | Usage |
|---|---|---|
| brand-400 | #8098fb | Text highlights, icons |
| brand-500 | #6172f3 | Primary brand |
| brand-600 | #4a52e8 | Dark brand, gradients |
| brand-950 | #1c2050 | Very dark tints |

### Surface Colors (Near-black)
| Token | Hex | Usage |
|---|---|---|
| surface-950 | #06070f | Page background |
| surface-900 | #0d0f1a | Sidebar, top nav |
| surface-800 | #141626 | Cards, inputs |
| surface-700 | #1c1f33 | Hover states |
| surface-600 | #252840 | Borders |
| surface-500 | #2f334d | Active borders |
| surface-400 | #3d4163 | Dividers |

### Status Colors
| Color | Usage |
|---|---|
| Emerald | Success, Completed |
| Amber | Warning, Processing |
| Red | Error, Failed, Danger |
| Sky | Info, Uploading |

---

## Typography

**Primary font**: Inter (variable)  
**Monospace**: JetBrains Mono / Fira Code

| Scale | Size | Weight | Usage |
|---|---|---|---|
| Display | 72px / 80px | 800 | Hero headings |
| H1 | 48px / 56px | 700 | Page titles |
| H2 | 32px / 40px | 700 | Section headings |
| H3 | 24px / 32px | 600 | Card headings |
| H4 | 20px / 28px | 600 | Sub-headings |
| Body | 16px | 400 | Main content |
| Small | 14px | 400 | Secondary text |
| Caption | 12px | 400 | Labels, captions |

---

## Spacing Scale

Uses Tailwind's default 4px base unit. Key values:
- `p-4` (16px) — small component padding
- `p-5` (20px) — medium
- `p-6` (24px) — card padding
- `p-8` (32px) — large sections
- `gap-3` to `gap-6` — component spacing

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| rounded-lg | 8px | Buttons, badges |
| rounded-xl | 12px | Inputs, small cards |
| rounded-2xl | 16px | Cards |
| rounded-3xl | 24px | Feature cards, large containers |
| rounded-full | 9999px | Avatars, pills |

---

## Component Patterns

### Glass Card
```css
background: rgba(20, 22, 38, 0.7);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.06);
border-radius: 16px;
```

### Gradient Text
```css
background: linear-gradient(135deg, #6172f3, #a78bfa, #ec4899);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

### Primary Button
```css
background: linear-gradient(to right, #4a52e8, #6172f3);
box-shadow: 0 8px 24px rgba(97, 114, 243, 0.3);
border-radius: 12px;
```

---

## Animation Guidelines

- **Page transitions**: 400ms `easeOut` fade + slide up 24px
- **Modal**: 200ms scale + fade (0.95 → 1)
- **Button press**: 97% scale, 100ms
- **Hover lift**: translateY(-2px), 150ms
- **Loading spinners**: CSS `animate-spin`
- **Stagger**: 50-100ms delay between list items

---

## Accessibility

- Focus rings: 2px `#6172f3` with 2px offset
- Text contrast: ≥4.5:1 for body text (WCAG AA)
- Interactive elements: min 44×44px touch targets
- Skip-to-content link on all pages
- ARIA labels on all icon-only buttons
- `role="alert"` on error messages
- `role="progressbar"` on progress indicators
