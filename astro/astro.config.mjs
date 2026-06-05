// @ts-check
import AstroPWA from '@vite-pwa/astro';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
    trailingSlash: 'always',
    build: {
        format: 'directory',
    },
    integrations: [
        AstroPWA({
            registerType: 'autoUpdate',
            includeAssets: [],
            manifest: {
                name: 'alt wlg 2026',
                short_name: 'alt wlg 26',
                description: 'Timetable alternative et accessible du festival WeLoveGreen 2026',
                theme_color: '#424242',
                background_color: '#424242',
                display: 'standalone',
                orientation: 'portrait',
                start_url: '/',
                scope: '/',
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
                skipWaiting: true,
                clientsClaim: true,
                cleanupOutdatedCaches: true,
                globPatterns: ['**/*.{js,css,html,svg,png,ico,txt}'],
                navigateFallback: '/index.html',
                directoryIndex: 'index.html',
                // runtimeCaching: [
                //     {
                //         urlPattern: /\/data\.json/,
                //         handler: 'NetworkFirst',
                //         options: {
                //             cacheName: 'data-cache',
                //             expiration: {
                //                 maxEntries: 1,
                //                 maxAgeSeconds: 60 * 60 * 24,
                //             },
                //         },
                //     }
                // ]
            }
        }),
    ],
});
