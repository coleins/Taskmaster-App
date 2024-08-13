// animations.js
import { gsap } from 'gsap';

export const animateCards = () => {
  gsap.fromTo(
    ".stats-card, .recents-card",
    { opacity: 0, y: 100 }, // Initial state: hidden and moved down
    { opacity: 1, y: 0, duration: 1, ease: "power2.out", stagger: 0.3 } // End state: fully visible and in place
  );
};
