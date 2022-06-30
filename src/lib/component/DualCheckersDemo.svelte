<script>
	import { breadthFirstSearch } from '$lib/canvas/dual_checkers';
	import DualCheckersInnerDemo from './DualCheckersInnerDemo.svelte';

	/**
	 * @type {string[]}
	 */
	export let initial_state;

	let solutions = breadthFirstSearch(initial_state);
</script>

<div class="flex flex-wrap">
	{#each solutions as solution}
		<DualCheckersInnerDemo {solution} />
	{/each}
</div>
