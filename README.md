# Scroll-Driven Hero Section Animation

## Assignment

**Objective:** Recreate a scroll-driven hero section animation inspired by a reference, focusing on motion quality, smoothness, and interaction logic.

**Reference:** [https://paraschaturvedi.github.io/car-scroll-animation](https://paraschaturvedi.github.io/car-scroll-animation)

---

## Live Demo & Repository

- **Live Site:** `https://jayeshrajbhar.github.io/scroll-animation`
- **GitHub Repository:** `https://github.com/JayeshRajbhar/scroll-animation`

---

## Functional Requirements & Solutions

### 1. Hero Section Layout

**Requirement:** Hero section occupies the first screen (above the fold). Display a letter-spaced headline (`W E L C O M E  I T Z F I Z Z`) and impact metrics/statistics below it.

**Solution:** The `.track` div is `position: sticky; height: 100vh`, ensuring the entire hero is always above the fold. The headline is rendered letter-by-letter with `letter-spacing: 0.25em`. Four stat cards (58%, 23%, 27%, 40%) are displayed in a responsive flex row below the headline.

---

### 2. Initial Load Animation

**Requirement:** On page load — headline fades in with staggered reveal, statistics animate in one by one. Must feel smooth and premium.

**Solution:** A GSAP `timeline` fires on mount:

- Headline letters stagger up from `y: 30, opacity: 0` with `stagger: 0.025` and `power3.out` easing.
- A "Scroll to explore" hint fades in last.
- Stat cards start hidden (`opacity: 0`) and are revealed by the scroll animation, not on load — keeping the initial view clean and intentional.

---

### 3. Scroll-Based Animation (Core Feature)

**Requirement:** Hero responds to scroll. The main visual moves based on scroll position (not time-based). Use easing/interpolation for natural motion.

**Solution:** GSAP `ScrollTrigger` with `scrub: true` binds the car's X position directly 1:1 to scroll progress — no lag, no time-based playback. As the car moves:

- A green trail grows behind it via `gsap.set(trail, { width: carX })`.
- Road letters in `WELCOME ITZFIZZ` reveal one by one as the car passes each letter's position.
- Stat cards fade in using `gsap.quickTo(card, "opacity", { duration: 0.5, ease: "power2.out" })` — a scroll-position-mapped opacity ramp that eases smoothly toward its target each frame.

---

### 4. Motion & Performance Guidelines

**Requirement:** Smooth and performant. Prefer `transform` properties. Avoid layout reflows on scroll.

**Solution:**

- The car moves via GSAP `x` (CSS `transform: translateX`) — no `left`/`top` changes, zero layout reflow.
- `will-change: transform` on `.car` and `will-change: opacity` on `.stat-card` promote elements to their own compositor layers.
- Trail width is set via `gsap.set` (sync, no tween overhead).
- `gsap.quickTo` for card opacity avoids spawning new tweens every frame.
- All scroll calculations are simple arithmetic — no DOM reads inside the `onUpdate` loop except pre-computed values cached before the animation starts.

---

## Tech Stack

| Technology               | Usage                                                             |
| ------------------------ | ----------------------------------------------------------------- |
| **Next.js 16**           | React framework, static export                                    |
| **TypeScript**           | Type safety                                                       |
| **Tailwind CSS 4**       | Utility styling                                                   |
| **GSAP + ScrollTrigger** | All animations — load timeline, scroll-driven car, opacity tweens |

---

## Project Structure

```
src/
  app/
    globals.css       # All component styles
    layout.tsx        # Root layout & metadata
    page.tsx          # Entry point
  components/
    Hero.tsx          # Full hero section — layout + all GSAP logic
public/
  McLaren 720S 2022 top view.png   # Car image asset
```

---

## Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---
