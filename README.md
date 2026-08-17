# YASIN ARAFAT SHAKIL — PORTFOLIO OS v5.0

Premium fixed-window portfolio web app with cyber-orange glass UI, advanced motion, TypeIt-style terminal title animation, responsive mobile navigation, project/service modals, WhatsApp inquiry flow and PWA support.

## Run

Open `index.html` with VS Code Live Server or any static web server.

## Main features

- Fixed desktop app viewport — no page scrolling
- Responsive mobile app layout with bottom navigation
- Advanced boot/loading animation with progress
- Sequential view entrance animations
- Typewriter / terminal role rotation
- Hover spotlight, depth tilt and ripple interactions
- Animated hero orbit and status indicators
- Animated skill bars
- Project filters and project detail modal
- Certificate PDF viewer
- Gallery lightbox
- Command palette (`Ctrl + K`)
- Service inquiry modal
- Contact form validation + honeypot + cooldown
- WhatsApp inquiry formatting for +601162051292
- Dark/light theme
- Animation ON/OFF setting
- Reduced-motion support
- PWA service worker

## WhatsApp

Browser WhatsApp flow opens a pre-filled message. The visitor must press Send in WhatsApp. Silent automated sending requires a secure WhatsApp Business API backend.


## v5.0 Advanced Upgrade

- Live system telemetry: clock, session timer, network state and interface mode
- Advanced Command Center dashboard card
- Live Portfolio Status side panel
- Keyboard command navigation with Arrow Up/Down + Enter
- Global shortcuts: Ctrl+K and Alt+H/A/S/P/E/C/R
- Enhanced desktop cursor interaction
- Theme persistence with localStorage
- Online/offline state detection
- UI performance telemetry
- Responsive telemetry layout for smaller screens
- Advanced glow/selection states for command navigation
- Preserves the fixed-window / mobile navigation architecture


## v5.0 Ultimate Upgrade

### Interactive Systems
- Interactive local terminal emulator
- Command routing from terminal to portfolio sections
- Portfolio analytics dashboard
- Session-only interaction telemetry
- Device/viewport detection
- Online/offline system state
- Network topology visualization
- Keyboard shortcuts matrix
- Advanced modal/overlay system
- Clipboard diagnostics export
- Additional keyboard shortcuts: Alt+T, Alt+N, Alt+?
- Mobile-optimized overlay architecture

### Privacy
All v5.0 telemetry is session-local (`sessionStorage`) and is not sent to a server by these features.


## v5.0 Responsive Rebuild

- Rebuilt dashboard with explicit CSS grid areas to prevent collisions.
- Desktop/tablet row sizing prevents Command Center from being squeezed.
- Mobile dashboard switches to a stable single-column flow.
- Mobile view uses internal vertical scrolling instead of fixed-height clipping.
- Hero switches to stacked photo/content layout on phones.
- Stats, info strip, Command Center, skills, projects, timeline and services remain accessible on mobile.
- Prevented horizontal overflow with minmax(0,1fr), max-width and overflow-safe content rules.
- Added phone, very-small-phone and landscape-phone breakpoints.


## v5.1 Responsive / Zoom Architecture Fix

- Explicit desktop grid placement prevents implicit-grid collisions.
- Command Center now has a dedicated dashboard row.
- Tablet/zoom-safe layout activates from 601–1100px CSS viewport width.
- Mobile dashboard uses a single-column natural document flow.
- No forced full-dashboard height on phones.
- Hero, stats, telemetry, projects, timeline and services stack without overlap.
- Internal panel content can grow without clipping.
- Browser zoom-in is handled through fluid breakpoints rather than fixed desktop rows.


## v5.2 No-Clip Layout Fix
- Removed fixed desktop dashboard row heights that clipped content.
- Command Center now grows naturally with telemetry + command buttons.
- Dashboard is vertically scrollable on desktop/zoomed layouts.
- Fixed bottom feature rail no longer covers timeline/services content.
- Hero/stat/skills/projects/timeline/services use natural flow with minimum heights.
