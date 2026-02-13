// Entry point — Home page
import './styles/main.css';
import { initApp } from './app.js';
import { renderFeaturedProducts, renderComingSoonProducts } from './products.js';

document.addEventListener('DOMContentLoaded', () => {
    initApp();
    renderFeaturedProducts();
    renderComingSoonProducts();
});

import './search.js';
