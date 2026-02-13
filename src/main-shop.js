// Entry point — Shop page
import './styles/main.css';
import { initApp } from './app.js';
import { renderShopGrid, initCategoryFilter } from './products.js';

document.addEventListener('DOMContentLoaded', () => {
    initApp();
    initCategoryFilter();
});

import './search.js';
