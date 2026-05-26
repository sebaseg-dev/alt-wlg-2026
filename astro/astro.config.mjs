// @ts-check
import AstroPWA from '@vite-pwa/astro';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    integrations: [
        AstroPWA({
            registerType: 'autoUpdate',
            includeAssets: ['data.json'],
            manifest: {
                name: 'alt wlg 2026',
                short_name: 'alt wlg 26',
                description: 'Timetable alternative et accessible du festival WeLoveGreen 2026',
                theme_color: '#111111',
                background_color: '#111111',
                display: 'standalone',
                orientation: 'portrait',
                icons: [
                    {
                        src: '/icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: '/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,svg,png,ico,txt,json}'],
                navigateFallback: '/',
                runtimeCaching: [
                    {
                        urlPattern: /\/data\.json/,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'data-cache',
                            expiration: {
                                maxEntries: 1,
                                maxAgeSeconds: 60 * 60 * 24,
                            },
                        },
                    }
                ]
            }
        }),
    ],
});
