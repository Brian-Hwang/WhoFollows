# WhoFollows Design System

## Color Palette (STRICT — 4 base colors only)

| Name | Hex | Role |
|------|-----|------|
| **Near-Black** | `#28262C` | Dark theme background, light theme text |
| **Near-White** | `#F9F5FF` | Light theme background, dark theme text |
| **Deep Blue** | `#14248A` | Primary accent — active states, links, couple edges, non-follow edges |
| **Gold** | `#9B8816` | Secondary accent — one-way follow, ex-couple edges, highlights |

### Derived Colors

| Name | Hex | Derivation | Usage |
|------|-----|-----------|-------|
| Surface (dark) | `#35333A` | Near-Black +10% lightness | Cards, panels in dark mode |
| Surface-hover (dark) | `#43414A` | Near-Black +15% lightness | Hover states in dark mode |
| Border (dark) | `#4A484F` | Near-Black +20% lightness | Borders in dark mode |
| Muted (dark) | `#8A8890` | Near-Black +40% lightness | Muted text, mutual follow lines |
| Surface (light) | `#EFEBF7` | Near-White -5% lightness | Cards, panels in light mode |
| Surface-hover (light) | `#E5E0EF` | Near-White -8% lightness | Hover states in light mode |
| Border (light) | `#C8C3D4` | Near-White -15% lightness | Borders in light mode |
| Muted (light) | `#6B6878` | Near-Black +30% lightness | Muted text in light mode |
| Canvas BG (light) | `#F0ECF8` | Near-White -3% lightness | Graph canvas background |
| Blue-light | `#2A3CA0` | Blue +10% lightness | Blue hover/active variant |
| Gold-light | `#C4AD2A` | Gold +15% lightness | Gold hover/active variant |

### Node Border Colors (alternating blue/gold shades)

For cast member node borders, alternate between blue and gold variations:
```
Blue shades: #14248A, #1E3399, #2842A8, #3251B7, #3C60C6, #4670D5, #5080E4
Gold shades: #9B8816, #8A7A14, #B09E1C, #C4AD2A, #7A6B10, #D4C42C, #E0D434
```

## Edge Colors (Graph)

| Edge Type | Color | Width | Style |
|-----------|-------|-------|-------|
| One-way follow | `#9B8816` (gold) | 2.5 | Solid + glow + flowing dashes |
| Mutual follow | `#8A8890` (muted) | 0.5-0.8 | Solid, very subtle |
| Non-follow | `#14248A` (blue) | 2 | Dashed + ✗ marker + arrow |
| Ex-couple | `#9B8816` (gold) | 1.5 | Dashed |
| Confirmed couple | `#14248A` (blue) | 3 | Solid |
| Final couple | `#14248A` (blue) | 3 | Solid |
| Not together | `#6B6878` (muted) | 1.5 | Dashed |

## Component Library

**shadcn/ui** — All UI components use shadcn primitives:
- `Button` — variant="default" (primary blue), "ghost", "outline", "secondary" (gold)
- `Card` — panels, legend, insights
- `Sheet` — profile panel (slide-in from right)
- `DropdownMenu` — show selector
- `Toggle` — filter toggles
- `ScrollArea` — scrollable panels
- `Badge` — relationship type tags
- `Collapsible` — legend expand/collapse
- `Tooltip` — hover info

## Typography

- **Font**: Noto Sans KR (supports Korean, English, Chinese)
- **Sizes**: text-xs (10px), text-sm (12px), text-base (14px), text-lg (16px)
- **Canvas labels**: 9px (node names), 7px (edge labels)

## Spacing

- **Panel padding**: p-3 to p-4
- **Gap between items**: gap-1 to gap-2
- **Fixed positions**: top-16 (below header), left-4, right-4, bottom-4

## Dark/Light Theme

Both themes use the SAME accent colors (blue + gold). Only background, surface, border, and text colors change.

- Dark: `data-theme="dark"` on `<html>`
- Light: `data-theme="light"` on `<html>`
- Theme state managed in `I18nProvider` with localStorage persistence

## Canvas Rendering (ForceGraph)

The graph canvas is NOT a shadcn component. It uses direct canvas 2D rendering:
- Background: reads `data-theme` attribute → `#28262C` (dark) or `#F0ECF8` (light)
- Labels: `#F9F5FF` (dark) or `#28262C` (light)
- Node radius: 24px
- Profile images clipped to circles with colored borders

## i18n

Three locales: `ko` (Korean), `en` (English), `zh` (Chinese Simplified)
- All user-visible text uses `t()` from `useI18n()`
- Names: `nameKo`, `nameEn`, `nameZh` on all cast members
- Default locale: `ko`

## Rules

1. **NEVER** introduce colors outside the 4-base palette (+ derived)
2. **ALWAYS** use shadcn components for new UI elements
3. **ALWAYS** use CSS variables for colors in components (not hardcoded hex)
4. **Canvas rendering** is the ONLY place where hardcoded hex is acceptable
5. **All text** must be translatable via i18n (no hardcoded strings)
6. **Both themes** must look good — test in both dark and light
