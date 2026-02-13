// Entry point — Contact page
import './styles/main.css';
import { initApp } from './app.js';
import { CONFIG } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    initApp();

    // Contact form → WhatsApp
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            const whatsappMessage = `Hello ${CONFIG.STORE_NAME}, my name is ${name} (${email}). ${message}`;
            const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
            window.location.href = url;
        });
    }
});
