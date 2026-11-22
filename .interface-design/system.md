# Ctrl X Interface System

## Intent

Design for people tracking pain and coordinating care with a physiotherapist. The
primary job is to understand and record their own care history. The interface
should feel calm, grounded, clear, and reassuring rather than clinical or
technical.

## Product language

- Pain intensity and body regions
- Diary entries and care history
- Timeline and calendar
- Patient-professional relationships
- Prescriptions and clinical records

## Visual direction

The existing palette draws from shaded leaves, soft sage, clean paper, and a
clear blue focus indicator. Keep the canvas quiet and use green for primary care
actions; reserve red for errors and blue for keyboard focus.

Reject generic blue hospital dashboards in favor of the existing green-and-paper
palette, repetitive metric-card grids in favor of task-led patient views, and
decorative gradients or extra accents in favor of quiet surfaces with semantic
color.

| Purpose | Existing token | Value |
| --- | --- | --- |
| Page canvas | `--color-background` | `#f3f7f5` |
| Raised surface | `--color-surface` | `#fff` |
| Primary text | `--color-text` | `#193c34` |
| Supporting text | `--color-muted` | `#4c675e` |
| Tertiary text | `--color-tertiary` | `#61756e` |
| Primary action | `--color-primary` | `#17634e` |
| Primary hover | `--color-primary-hover` | `#104b3b` |
| Soft care accent | `--color-primary-soft` | `#e5f1eb` |
| Focus | `--color-focus` | `#2563a6` |
| Error | `--color-error` | `#a13030` |

Use the existing variables from `src/styles/tokens.css`; do not introduce
one-off colors.

## Hierarchy and signature

- Keep one clear task or message focal in each view.
- The existing short green marker (2rem by .25rem) leads cards and state panels;
  reuse it as a quiet care-context signature rather than decoration.
- Use the eyebrow, heading, supporting copy, then action order established by
  the authentication card.
- Keep actions and status meanings explicit; do not imply clinical verification
  that the backend has not provided.

## Surfaces, spacing, and type

- Use the light canvas, white cards, and subtle surface shadow already defined
  by `--shadow-surface`. Use borders for controls and quiet separation.
- Use the 8px spacing base from `--space-1`; the existing scale is 8, 16, 24,
  and 32px.
- Use `--font-body` (Segoe UI, Helvetica Neue, Arial) with a 16px body and
  1.6 line height. Keep headings compact and balanced.
- Reuse `--radius-control` for controls and `--radius-card` for cards.
- Keep content within `--content-width` and preserve the existing 640px mobile
  navigation breakpoint.

## Interaction and accessibility

- Use semantic native controls and the shared `Button`.
- Preserve the visible 3px focus outline, keyboard skip link, and reduced-motion
  handling.
- Keep interactive targets at least 44px high where existing controls already
  establish that pattern.
- Maintain loading, error, empty, and success states with their current semantic
  colors and accessible roles.
