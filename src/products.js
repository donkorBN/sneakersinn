// =============================================
// Product Rendering & Filtering
// =============================================
import { CONFIG, PRODUCTS } from './config.js';
import { generateWhatsAppLink, orderOnWhatsApp } from './whatsapp.js';
import { initScrollReveal } from './app.js';

// Make orderOnWhatsApp available globally for onclick handlers
window.orderOnWhatsApp = orderOnWhatsApp;

function formatPrice(price) {
    return `${CONFIG.CURRENCY}${price.toLocaleString()}`;
}

function getOrderDeadline() {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 20);
    return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ---- Render Product Card ----
function createProductCard(product) {
    const badge = product.badge
        ? `<span class="product-badge">${product.badge}</span>`
        : '';

    const whatsappUrl = (product.soldOut || product.comingSoon) ? '#' : generateWhatsAppLink(product);

    let cardWrapperClass = 'product-card reveal';
    if (product.soldOut) cardWrapperClass += ' sold-out';
    if (product.comingSoon) cardWrapperClass += ' coming-soon';

    let buttonClass = 'btn btn-whatsapp btn-sm';
    if (product.soldOut || product.comingSoon) buttonClass += ' disabled';

    let buttonText = `
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Order
          `;

    if (product.soldOut) buttonText = 'Sold Out';
    if (product.comingSoon) buttonText = 'Preview';

    let overlay = '';
    if (product.soldOut) overlay = '<div class="sold-out-overlay">SOLD OUT</div>';
    if (product.comingSoon) overlay = '<div class="coming-soon-overlay">DROPPING SOON</div>';

    return `
    <div class="${cardWrapperClass}" data-category="${product.category}">
      ${badge}
      ${overlay}
      <a href="product.html?id=${product.id}" class="product-image-link">
        <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy" style="${(product.soldOut || product.comingSoon) ? 'filter: grayscale(100%); opacity: 0.8;' : ''}">
      </a>
      <div class="product-info">
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">${formatPrice(product.price)}</p>
        <div class="product-actions">
          <a href="product.html?id=${product.id}" class="btn btn-outline btn-sm">View Details</a>
          <a href="${whatsappUrl}" class="${buttonClass}">
            ${buttonText}
          </a>
        </div>
      </div>
    </div>
  `;
}

// ---- Render Featured Products ----
export function renderFeaturedProducts() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    const featured = PRODUCTS.filter((p) => p.featured);
    container.innerHTML = featured.map(createProductCard).join('');
    initScrollReveal();
}

// ---- Render Shop Grid ----
export function renderShopGrid(category = 'all') {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    const filtered =
        category === 'all'
            ? PRODUCTS
            : PRODUCTS.filter((p) => p.category === category);

    grid.innerHTML = filtered.map(createProductCard).join('');
    initScrollReveal();
}

// ---- Category Filter ----
export function initCategoryFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (!filterBtns.length) return;

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.dataset.category;
            renderShopGrid(category);
        });
    });
}

// ---- Render Coming Soon Products ----
export function renderComingSoonProducts() {
    const container = document.getElementById('coming-soon-products');
    if (!container) return;

    const comingSoon = PRODUCTS.filter((p) => p.comingSoon);
    if (comingSoon.length === 0) {
        container.closest('.section').style.display = 'none';
        return;
    }

    container.innerHTML = comingSoon.map(createProductCard).join('');
    initScrollReveal();
}

// ---- Product Detail Page ----
let currentSelectedSize = null;

function selectSize(btn, size) {
    document.querySelectorAll('.size-btn').forEach((b) => b.classList.remove('selected'));
    btn.classList.add('selected');
    currentSelectedSize = size;
    const error = document.getElementById('size-error');
    if (error) error.style.display = 'none';
}

// Make selectSize global for onclick in templates
window.selectSize = selectSize;

function handleOrder(productId) {
    if (!currentSelectedSize) {
        const error = document.getElementById('size-error');
        if (error) {
            error.style.display = 'block';
            error.classList.add('shake');
            setTimeout(() => error.classList.remove('shake'), 500);
        }
        return;
    }
    orderOnWhatsApp(productId, currentSelectedSize);
}

// Make handleOrder global for onclick in templates
window.handleOrder = handleOrder;

export function renderProductDetail() {
    const container = document.getElementById('product-detail');
    if (!container) return;

    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));
    const product = PRODUCTS.find((p) => p.id === productId);

    if (!product) {
        container.innerHTML = `
      <div class="not-found">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <a href="shop.html" class="btn btn-primary">Back to Shop</a>
      </div>
    `;
        return;
    }

    document.title = `${product.name} — ${CONFIG.STORE_NAME}`;

    const badge = product.badge
        ? `<span class="detail-badge">${product.badge}</span>`
        : '';

    container.innerHTML = `
    <div class="product-detail-grid">
      <div class="product-detail-image reveal">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="product-detail-info reveal">
        ${badge}
        <h1 class="detail-name">${product.name}</h1>
        <p class="detail-price">${formatPrice(product.price)}</p>
        <p class="detail-description">${product.description}</p>
        
        <!-- Urgency Markers -->
        <div class="urgency-container">
            <div class="urgency-item" style="color: #E85D04; font-weight: 600; font-size: 0.9rem; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                <span class="pulse-dot"></span>
                <span>${Math.floor(Math.random() * 7) + 2} people are watching this right now</span>
            </div>
            <div class="urgency-item" style="font-size: 0.9rem; margin-bottom: 8px;">
                🔥 <strong>3 items left</strong> in stock
            </div>
            <div class="urgency-item" style="font-size: 0.9rem; color: #1B263B; background: #f8f9fa; padding: 10px; border-radius: 8px; border: 1px solid #e9ecef;">
                ⏰ Order before <strong>${getOrderDeadline()}</strong> to grab this pair!
            </div>
        </div>

        <style>
            .pulse-dot { width: 8px; height: 8px; background: #E85D04; border-radius: 50%; display: inline-block; animation: pulse 1.5s infinite; }
            @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(232, 93, 4, 0.4); } 70% { box-shadow: 0 0 0 6px rgba(232, 93, 4, 0); } 100% { box-shadow: 0 0 0 0 rgba(232, 93, 4, 0); } }
        </style>
        <div class="detail-sizes">
          <h3>Select Size</h3>
          <div class="size-options" id="size-options">
            ${product.sizes
            .map(
                (size) =>
                    `<button class="size-btn" data-size="${size}" onclick="selectSize(this, ${size})">${size}</button>`
            )
            .join('')}
          </div>
          <p class="size-error" id="size-error" style="display:none;">Please select a size</p>
        </div>

        ${product.soldOut
            ? `<button class="btn btn-whatsapp btn-lg disabled" style="background: #ccc; cursor: not-allowed; box-shadow: none; opacity: 0.7;">Sold Out</button>`
            : `<button class="btn btn-whatsapp btn-lg" id="order-btn" onclick="handleOrder(${product.id})">
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Order on WhatsApp
            </button>`
        }

        <div class="product-meta">
          <div class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            <span>Free delivery on orders over ${formatPrice(500)}</span>
          </div>
          <div class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/><path d="M9 12l2 2 4-4"/></svg>
            <span>100% Authentic Guarantee</span>
          </div>
          <div class="meta-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <span>Secure payment via WhatsApp</span>
          </div>
        </div>
      </div>
    </div>

    <div class="related-products reveal">
      <h2 class="section-title">You Might Also Like</h2>
      <div class="products-grid" id="related-products"></div>
    </div>
  `;

    // Render related products
    const related = PRODUCTS.filter(
        (p) => p.category === product.category && p.id !== product.id
    ).slice(0, 4);

    const relatedGrid = document.getElementById('related-products');
    if (relatedGrid && related.length) {
        relatedGrid.innerHTML = related.map(createProductCard).join('');
    }

    initScrollReveal();
}
