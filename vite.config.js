import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    root: '.',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                shop: resolve(__dirname, 'shop.html'),
                product: resolve(__dirname, 'product.html'),
                about: resolve(__dirname, 'about.html'),
                contact: resolve(__dirname, 'contact.html'),
            },
        },
    },
})
