import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import shopify from 'vite-plugin-shopify'

export default defineConfig({
    plugins: [
        react(),
        shopify({
            sourceCodeDir: 'src',
            entrypointsDir: 'src/entrypoints',
        }),
    ],
    build: {
        emptyOutDir: false,
        manifest: 'vite-manifest.json',
    },
})