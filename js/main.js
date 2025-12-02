import { HeroAnimation } from './modules/hero-animation.js';
import { initUI } from './modules/ui.js';

document.addEventListener('DOMContentLoaded', () => {
    console.log('MM Digital App Initialized (ES Modules)');

    // Initialize UI (Menu, Scroll, Animations, Form)
    initUI();

    // Initialize Hero Animation
    new HeroAnimation();
});
