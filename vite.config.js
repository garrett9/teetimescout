import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        checker({
            typescript: true,
        }),
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
    ],
});
