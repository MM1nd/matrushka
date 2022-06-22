<script>
	import Challenge from '$lib/component/Challenge.svelte';
	import DualCheckers from '$lib/component/DualCheckers.svelte';
	import { t } from '$lib/translations';

	const interactive_params = {
		start_state: ['b', 'b', 'b', 'b', 'w', 'w', 'w', 'w', 'x', 'x'],
		rows: 5,
		win_state: ['x', 'x', 'w', 'b', 'w', 'b', 'w', 'b', 'w', 'b']
	};
</script>

<Challenge
	interactive={DualCheckers}
	{interactive_params}
	heading={$t('common.headings.threeb')}
	description={$t('threeb.description')}
/>
