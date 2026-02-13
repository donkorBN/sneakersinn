// =============================================
// WhatsApp Integration
// =============================================
import { CONFIG, PRODUCTS } from './config.js';

export function generateWhatsAppLink(product, selectedSize) {
    const message = selectedSize
        ? `Hi, I want to order the *${product.name}* (Size ${selectedSize}).\nPrice: *${CONFIG.CURRENCY}${product.price.toLocaleString()}*\n\nPayment method: [Pay on Delivery / Pay Before Delivery]\n\nPlease confirm and process my order 🙏`
        : `Hi, I want to order the *${product.name}*.\nPrice: *${CONFIG.CURRENCY}${product.price.toLocaleString()}*\n\nPayment method: [Pay on Delivery / Pay Before Delivery]\n\nPlease confirm and process my order 🙏`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodedMessage}`;
}

export function orderOnWhatsApp(productId, selectedSize) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    const url = generateWhatsAppLink(product, selectedSize);
    window.location.href = url;
}
