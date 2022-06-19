import i18n from 'sveltekit-i18n';

/** @type {import('sveltekit-i18n').Config} */
const config = ({
    loaders: [
        {
            locale: 'en',
            key: 'common',
            loader: async () => (
                await import('./en/common.json')
            ).default,
        },
        {
            locale: 'de',
            key: 'common',
            loader: async () => (
                await import('./de/common.json')
            ).default,
        },
        {
            locale: 'en',
            key: 'three',
            routes: ['/three'],
            loader: async () => (
                await import('./en/three.json')
            ).default,
        },
        {
            locale: 'de',
            key: 'three',
            routes: ['/three'],
            loader: async () => (
                await import('./de/three.json')
            ).default,
        },
    ],
});

export const { t, locale, locales, loading, loadTranslations } = new i18n(config);