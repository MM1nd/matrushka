<script>
	import RouteLink from '$lib/component/RouteLink.svelte';
	import { t } from '$lib/translations';
	const route_names = ['three', 'threeb', 'threec'];
</script>

<h2 class="text-3xl font-semibold m-2">{$t('common.menu.toc')}</h2>
<ol class="list-decimal list-inside m-2">
	{#each route_names as route_name}
		<li class="font-serif">
			<RouteLink {route_name} />
		</li>
	{/each}
</ol>
