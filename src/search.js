import { PRODUCTS, CONFIG } from './config.js';
import { generateWhatsAppLink } from './whatsapp.js';

// Global functions for inline onclick handlers
window.openSearch = function () {
    const overlay = document.getElementById('search-overlay');
    const input = document.getElementById('search-input');
    if (overlay && input) {
        overlay.classList.add('active');
        setTimeout(() => input.focus(), 100);
        document.body.style.overflow = 'hidden';
    }
};

window.closeSearch = function () {
    const overlay = document.getElementById('search-overlay');
    if (overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results');

    if (input && resultsContainer) {
        input.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();

            if (query.length === 0) {
                resultsContainer.innerHTML = '';
                return;
            }

            const results = PRODUCTS.filter(product => {
                return (
                    product.name.toLowerCase().includes(query) ||
                    product.category.toLowerCase().includes(query) ||
                    (product.description && product.description.toLowerCase().includes(query))
                );
            });

            renderResults(results, query);
        });

        // Close on ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') window.closeSearch();
        });
    }

    function renderResults(results, query) {
        if (results.length === 0) {
            const encodedQuery = encodeURIComponent(query);
            const whatsappUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=Hi, I'm looking for "${query}" on SneakersInn but couldn't find it. Can you help me source it?`;

            resultsContainer.innerHTML = `
                <div class="search-empty">
                    <p>We couldn't find "${query}" in our stock.</p>
                    <a href="${whatsappUrl}" target="_blank" class="btn btn-primary btn-sm">
                        Request Custom Order via WhatsApp
                    </a>
                </div>
            `;
            return;
        }

        resultsContainer.innerHTML = results.map(product => {
            const priceDisplay = product.comingSoon
                ? '<span class="price-coming-soon">Dropping Soon</span>'
                : `${CONFIG.CURRENCY}${product.price}`;

            const link = product.comingSoon
                ? '#'
                : generateWhatsAppLink(product);

            return `
                <div class="search-result-item" onclick="window.location.href='product.html?id=${product.id}'">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="result-info">
                        <h4>${product.name}</h4>
                        <p class="result-price">${priceDisplay}</p>
                    </div>
                </div>
             `;
        }).join('');
    }
});
