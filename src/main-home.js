// Entry point — Home page
import './styles/main.css';
import { initApp } from './app.js';
import { renderFeaturedProducts } from './products.js';

document.addEventListener('DOMContentLoaded', () => {
    initApp();
    renderFeaturedProducts();
});
