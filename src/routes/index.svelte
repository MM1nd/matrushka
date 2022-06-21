<script>
	import { t } from '$lib/translations';

	const route_names = ['three', 'threeb'];
</script>

<h2 class="text-3xl font-semibold m-2">{$t('common.menu.toc')}</h2>
<ol class="list-decimal list-inside m-2">
	{#each route_names as route_name}
		<li class="font-serif">
			<a class="underline visited:text-slate-600" href="/{route_name}">
				{$t(`common.headings.${route_name}`)}
			</a>
		</li>
	{/each}
</ol>
