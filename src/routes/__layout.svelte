<script context="module">
	import { t, locale, locales, loadTranslations } from '$lib/translations';
	import { browser } from '$app/env';

	/**
	 * @type {import('@sveltejs/kit').Load}
	 */
	export async function load({ url }) {
		const { pathname } = url;

		const defaultLocale = browser ? localStorage.getItem('lang') || 'en' : 'en';

		if (browser) {
			locale.subscribe((lang) => localStorage.setItem('lang', lang));
		}
		const initLocale = locale.get() || defaultLocale;

		await loadTranslations(initLocale, pathname);

		return {};
	}
</script>

<script>
	import '../app.css';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Cog, Home } from '@steeze-ui/heroicons';
</script>

<div class="container mx-auto">
	<nav class="bg-rose-700 flex justify-end m-2">
		<div class="basis-1/6 relative bg-rose-50 hover:bg-rose-100 m-2">
			<a href="/" class="inline-block text-center w-full p-1">
				<Icon src={Home} class="inline-block h-6 w-6" />
				<span class="align-middle hidden md:inline"> {$t('common.menu.toc')} </span>
			</a>
		</div>
		<div class="basis-1/6 relative group bg-rose-50 hover:bg-rose-100 m-2">
			<button type="button" class="w-full p-1">
				<Icon src={Cog} class="inline-block h-6 w-6" />
				<span class="align-middle hidden md:inline"> {$t('common.menu.settings')} </span>
			</button>
			<div class="absolute bg-rose-100 p-1 hidden group-hover:block">
				<label for="select-lang">{$t('common.menu.lang')}</label>
				<select id="select-lang" bind:value={$locale}>
					{#each $locales as value}
						<option {value}>{value}</option>
					{/each}
				</select>
			</div>
		</div>
	</nav>
	<slot />
</div>
