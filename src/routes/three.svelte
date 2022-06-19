<script>
	import Challenge from '$lib/component/Challenge.svelte';
	import Three from '$lib/component/Three.svelte';
	import { t } from '$lib/translations';
</script>

<Challenge
	interactive={Three}
	heading={$t('three.heading')}
	description={$t('three.description')}
/>
