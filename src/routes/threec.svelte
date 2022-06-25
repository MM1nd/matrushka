<script>
	import RouteLink from '$lib/component/RouteLink.svelte';
	import WipWarning from '$lib/component/WipWarning.svelte';
	import { t } from '$lib/translations';
</script>

<h2 class="text-3xl font-semibold m-2">{$t('common.headings.threec')}</h2>
<WipWarning />
<h3 class="text-2xl font-semibold m-2">Context</h3>
<p class="m-2 font-serif text-justify">
	This challenge assumes that you have already solved <RouteLink route_name="three" />
	and <RouteLink route_name="threeb" />. It is much harder and much more open ended than either of
	those challenges.
</p>
