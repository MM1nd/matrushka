<script>
	import { onMount } from 'svelte';
	/**
	 * @type {HTMLCanvasElement | null}
	 */
	let canvas;

	/**
	 * @type {string[][]}
	 */
	export let state;
	/**
	 * @type {number}
	 */
	export let rows;

	/**
	 * @type {string[]}
	 */
	export let win_state;

	let drag = [0, 0];
	let isDragging = false;

	const base_radius = 30;
	const base_padding = 6;
	const base_half_grid = base_radius + base_padding;
	const base_grid = base_half_grid * 2;

	const base_width = state[0].length * base_grid;
	const base_height = rows * base_grid;

	let game_over = false;

	onMount(() => {
		render();
	});

	function checkWin() {
		game_over = state.length === rows;
		if (game_over) {
			let won = true;
			for (let k = 0; k < win_state.length; k++) {
				if (state[state.length - 1][k] !== win_state[k]) {
					won = false;
					break;
				}
			}
			console.log(won);
		}
	}

	/**
	 * @param {string} state
	 */
	function isRegularState(state) {
		return state === 'b' || state === 'w';
	}

	/**
	 * @param {string} state
	 */
	function isDraggingState(state) {
		return state === 'a' || state === 'v';
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

	/**
	 * @param {number} pos
	 */
	function posToBaseUnits(pos) {
		return (pos * 2 + 1) * base_half_grid;
	}

	function getCssToBaseScale() {
		if (!canvas || !window) {
			return 1;
		}
		const css_width = parseInt(window.getComputedStyle(canvas).width);
		return css_width / base_width;
	}

	/**
	 * @param {number} px
	 */
	function cssToBaseUnits(px) {
		return px / getCssToBaseScale();
	}

	/**
	 * @param {number} base
	 */
	function toPosition(base) {
		return Math.trunc(base / base_grid);
	}

	function render(offsetX = 0, offsetY = 0) {
		if (!canvas || !window) {
			return;
		}

		const scale = getCssToBaseScale() * window.devicePixelRatio;

		canvas.width = base_width * scale;
		canvas.height = base_height * scale;

		const ctx = canvas.getContext('2d');
		if (!ctx) {
			console.error('Could not getContext of canvas.');
			return;
		}
		ctx.setTransform(scale, 0, 0, scale, 0, 0);
		ctx.clearRect(0, 0, base_width, base_height);
		for (let k = 1; k < rows; k++) {
			ctx.beginPath();
			ctx.moveTo(base_padding, k * base_grid);
			ctx.lineTo(base_width - base_padding, k * base_grid);
			ctx.stroke();
		}

		let dragIdx = 0;
		state.forEach((row, j) => {
			row.forEach((s, i) => {
				let x = posToBaseUnits(i);
				let y = posToBaseUnits(j);
				let tone = 0;
				let alpha = 1;
				let r = base_radius;

				if (s === 'w' || s === 'v' || s === 'x') {
					tone = 255;
				}

				if (isDraggingState(s)) {
					alpha = 0.5;
					x = cssToBaseUnits(offsetX) + drag[0] + dragIdx * base_grid;
					y = cssToBaseUnits(offsetY) + drag[1];
					dragIdx = dragIdx + 1;
				}

				if (s === 'x') {
					r = r / 5;
				}

				ctx.fillStyle = `rgba(${tone}, ${tone}, ${tone}, ${alpha}`;
				ctx.beginPath();
				ctx.ellipse(x, y, r, r, 0, 0, 2 * Math.PI);
				ctx.fill();
				ctx.stroke();
			});
		});
	}

	/**
	 * @param {PointerEvent} event
	 */
	function pointerDown(event) {
		if (state.length === rows) {
			return;
		}
		let j = toPosition(cssToBaseUnits(event.offsetY));
		if (j != state.length - 1) {
			return;
		}

		let i = toPosition(cssToBaseUnits(event.offsetX));
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

		drag[0] = posToBaseUnits(i) - cssToBaseUnits(event.offsetX);
		drag[1] = posToBaseUnits(j) - cssToBaseUnits(event.offsetY);

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
			const j = toPosition(drag[1] + cssToBaseUnits(event.offsetY));
			if (j != state.length - 1) {
				return;
			}

			const i = toPosition(drag[0] + cssToBaseUnits(event.offsetX));
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

<canvas
	class="border-2 w-full lg:w-4/5 xl:w-2/3"
	class:cursor-move={isDragging}
	bind:this={canvas}
	on:pointerdown={pointerDown}
	on:pointermove={pointerMove}
	on:pointerup={pointerUp}
	on:lostpointercapture={resetDraggingState}
/>
