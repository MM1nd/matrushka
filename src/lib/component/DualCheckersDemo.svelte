<script>
	import { onMount } from 'svelte';
	import { _render, createGeometry, breadthFirstSearch } from '$lib/canvas/dual_checkers';

	/**
	 * @type {string[]}
	 */
	export let initial_state;

	/**
	 * @type {HTMLCanvasElement}
	 */
	let canvas;

	let h = 'h-16';

	onMount(() => {
		let solution = breadthFirstSearch(initial_state);
		if (solution) {
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
		} else {
			console.log('Invalid initial state');
			console.log(initial_state);
		}
	});
</script>

<div class="{h} my-2"><canvas class="bg-white h-full" bind:this={canvas} /></div>
<slot />
