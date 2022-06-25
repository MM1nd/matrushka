<script>
	import { t } from '$lib/translations';
	/**
	 * @type {string}
	 */
	export let route_name;
</script>

<a class="underline visited:text-slate-600" href="/{route_name}">
	{$t(`common.headings.${route_name}`)}
</a>
