// Entry point — Product detail page
import './styles/main.css';
import { initApp } from './app.js';
import { renderProductDetail } from './products.js';

document.addEventListener('DOMContentLoaded', () => {
    initApp();
    renderProductDetail();
});

import './search.js';
