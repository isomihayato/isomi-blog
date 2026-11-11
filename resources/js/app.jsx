import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { GlobalStyles, ThemeProvider } from '@mui/material';
import theme, { cssVariables } from './theme';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // 色・フォントなどはテーマ(theme.ts)で管理し、CSS からも使えるよう CSS 変数として出力する
        root.render(
            <ThemeProvider theme={theme}>
                <GlobalStyles styles={{ ':root': cssVariables }} />
                <App {...props} />
            </ThemeProvider>,
        );
    },
    progress: {
        // テーマの青(MUI の primary)。濃いグレーだと目立たなかった
        color: '#1976d2',
    },
});
