<script>
	import { onMount } from 'svelte';
	import { t } from '$lib/translations';
	import {
		_render,
		posToBaseUnits,
		isDraggingState,
		baseUnitsToPosition,
		createGeometry
	} from '$lib/canvas/dual_checkers';

	/**
	 * @type {HTMLCanvasElement | null}
	 */
	let canvas;

	/**
	 * @type {number}
	 */
	export let rows;

	/**
	 * @type {string[]}
	 */
	export let start_state;

	/**
	 * @type {string[]}
	 */
	export let win_state;

	let state = [start_state];

	let drag = [0, 0];
	let isDragging = false;

	const geometry = createGeometry(rows, state[0].length, 6, 30);

	let game_over = false;
	let won = true;

	onMount(() => {
		render();
	});

	function checkWin() {
		game_over = state.length === rows;
		if (game_over) {
			for (let k = 0; k < win_state.length; k++) {
				if (state[state.length - 1][k] !== win_state[k]) {
					won = false;
					break;
				}
			}
		}
	}

	function reset() {
		game_over = false;
		won = true;
		isDragging = false;
		state = [start_state];
		render();
	}

	/**
	 * @param {string} state
	 */
	function isRegularState(state) {
		return state === 'b' || state === 'w';
	}

	/**
	 * @param {string} draggingState
	 */
	function toRegularState(draggingState) {
		switch (draggingState) {
			case 'a':
				return 'b';
			case 'v':
				return 'w';
			default:
				return draggingState;
		}
	}

	function getCssToBaseScale() {
		if (!canvas || !window) {
			return 1;
		}
		const css_width = parseInt(window.getComputedStyle(canvas).width);
		return css_width / geometry.width;
	}

	/**
	 * @param {number} px
	 */
	function cssToBaseUnits(px) {
		return px / getCssToBaseScale();
	}

	function render(offsetX = 0, offsetY = 0) {
		if (!canvas || !window) {
			return;
		}

		const scale = getCssToBaseScale() * window.devicePixelRatio;

		_render(
			canvas,
			scale,
			state,
			geometry,
			drag[0] + cssToBaseUnits(offsetX),
			drag[1] + cssToBaseUnits(offsetY)
		);
	}

	/**
	 * @param {PointerEvent} event
	 */
	function pointerDown(event) {
		if (state.length === rows) {
			return;
		}
		let j = baseUnitsToPosition(cssToBaseUnits(event.offsetY), geometry);
		if (j != state.length - 1) {
			return;
		}

		let i = baseUnitsToPosition(cssToBaseUnits(event.offsetX), geometry);
		if (!isRegularState(state[j][i])) {
			return;
		}

		// if there is no right neighbour ...
		if (i === state[0].length - 1 || !isRegularState(state[j][i + 1])) {
			// ... is there a left neighbour instead?
			if (i === 0 || !isRegularState(state[j][i - 1])) {
				return;
			}
			i = i - 1;
		}

		for (let dragIdx = 0; dragIdx < 2; dragIdx++) {
			switch (state[j][i + dragIdx]) {
				case 'b':
					state[j][i + dragIdx] = 'a';
					break;
				case 'w':
					state[j][i + dragIdx] = 'v';
					break;
			}
		}

		drag[0] = posToBaseUnits(i, geometry) - cssToBaseUnits(event.offsetX);
		drag[1] = posToBaseUnits(j, geometry) - cssToBaseUnits(event.offsetY);

		// @ts-ignore
		canvas.setPointerCapture(event.pointerId);
		isDragging = true;
	}

	/**
	 * @param {PointerEvent} event
	 */
	function pointerMove(event) {
		if (isDragging) {
			render(event.offsetX, event.offsetY);
		}
	}

	/**
	 * @param {PointerEvent} event
	 */
	function pointerUp(event) {
		if (isDragging) {
			const j = baseUnitsToPosition(drag[1] + cssToBaseUnits(event.offsetY), geometry);
			if (j != state.length - 1) {
				return;
			}

			const i = baseUnitsToPosition(drag[0] + cssToBaseUnits(event.offsetX), geometry);
			if (i < 0 || i > state[0].length - 2) {
				return;
			}

			if (state[j][i] != 'x' || state[j][i + 1] != 'x') {
				return;
			}

			for (let k = 0; k < state[0].length; k++) {
				const oldRow = state[state.length - 1];
				if (isDraggingState(oldRow[k])) {
					const newRow = [...oldRow];
					for (let dragIdx = 0; dragIdx < 2; dragIdx++) {
						newRow[i + dragIdx] = toRegularState(newRow[k + dragIdx]);
						newRow[k + dragIdx] = 'x';
					}
					state = [...state, newRow];
					checkWin();
					break;
				}
			}
		}
	}

	function resetDraggingState() {
		isDragging = false;
		state.forEach((row, j) => {
			row.forEach((s, i) => {
				if (isDraggingState(s)) {
					state[j][i] = toRegularState(s);
				}
			});
		});
		render();
	}
</script>

<div class="flex flex-col lg:flex-row bg-rose-700">
	<div class="basis-4/5 bg-white m-2">
		<canvas
			class="w-full"
			class:cursor-move={isDragging}
			bind:this={canvas}
			on:pointerdown={pointerDown}
			on:pointermove={pointerMove}
			on:pointerup={pointerUp}
			on:lostpointercapture={resetDraggingState}
		/>
	</div>
	<div class="basis-1/5 bg-white m-2">
		<div class="bg-rose-50 m-2">
			<button type="button" class="w-full p-1" on:click={reset}>{$t('common.game.reset')}</button>
		</div>
		<div class="m-2">
			<p>
				{$t(
					game_over ? (won ? 'common.game.solved' : 'common.game.over') : 'common.game.player_turn'
				)}
			</p>
		</div>
	</div>
</div>
