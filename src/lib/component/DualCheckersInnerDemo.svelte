<script>
	import { onMount } from 'svelte';
	import { _render, createGeometry, breadthFirstSearch } from '$lib/canvas/dual_checkers';

	/**
	 * @type {string[][]}
	 */
	export let solution;

	/**
	 * @type {HTMLCanvasElement}
	 */
	let canvas;

	let h = 'h-16';

	onMount(() => {
		_render(canvas, 1, solution, createGeometry(solution.length, solution[0].length));
		switch (solution.length) {
			case 1:
			case 2:
				h = 'h-16';
				break;
			case 3:
			case 4:
				h = 'h-32';
				break;
			case 5:
				h = 'h-40';
				break;
			case 6:
				h = 'h-48';
				break;
			default:
				h = 'h-16';
		}
	});
</script>

<div class="{h} m-2">
	<canvas class="bg-white h-full" bind:this={canvas} />
</div>
