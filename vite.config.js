import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    root: '.',
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                shop: resolve(__dirname, 'shop/index.html'),
                product: resolve(__dirname, 'product/index.html'),
                about: resolve(__dirname, 'about/index.html'),
                contact: resolve(__dirname, 'contact/index.html'),
            },
        },
    },
})
