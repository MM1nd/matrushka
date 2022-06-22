<script>
	import Challenge from '$lib/component/Challenge.svelte';
	import DualCheckers from '$lib/component/DualCheckers.svelte';
	import { t } from '$lib/translations';

	const interactive_params = {
		start_state: ['w', 'b', 'w', 'b', 'w', 'b', 'x', 'x', 'x', 'x'],
		rows: 4,
		win_state: ['x', 'x', 'x', 'x', 'b', 'b', 'b', 'w', 'w', 'w']
	};
</script>

<Challenge
	interactive={DualCheckers}
	{interactive_params}
	heading={$t('common.headings.three')}
	description={$t('three.description')}
/>
