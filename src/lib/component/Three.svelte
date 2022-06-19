<script>
	import { onMount } from 'svelte';
	/**
	 * @type {HTMLCanvasElement | null}
	 */
	let canvas;

	let state = [['w', 'b', 'w', 'b', 'w', 'b', 'x', 'x', 'x', 'x']];
	let drag = [0, 0];
	let isDragging = false;

	let radius = 30;

	const padding = 6;
	const offset = radius + padding;
	const rows = 4;

	const width = state[0].length * offset * 2;
	const height = rows * offset * 2;

	onMount(() => {
		document.addEventListener('pointerlockchange', pointerLockChange);
		document.addEventListener('pointerlockerror', resetDraggingState);
		render();
	});

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
	 * @param {number} pos
	 */
	function toPixels(pos) {
		return (pos * 2 + 1) * offset;
	}

	/**
	 * @param {number} px
	 */
	function toPosition(px) {
		return Math.trunc(px / (2 * offset));
	}

	function render() {
		if (!canvas) {
			return;
		}
		const ctx = canvas.getContext('2d');
		if (!ctx) {
			console.error('Could not getContext of canvas.');
			return;
		}
		ctx.clearRect(0, 0, width, height);
		for (let k = 1; k < rows; k++) {
			ctx.beginPath();
			ctx.moveTo(9, k * offset * 2);
			ctx.lineTo(width - padding, k * offset * 2);
			ctx.stroke();
		}

		let dragIdx = 0;
		state.forEach((row, j) => {
			row.forEach((s, i) => {
				let x = toPixels(i);
				let y = toPixels(j);
				let tone = 0;
				let alpha = 1;
				let r = radius;

				if (s === 'w' || s === 'v' || s === 'x') {
					tone = 255;
				}

				if (isDraggingState(s)) {
					alpha = 0.5;
					x = drag[0] + dragIdx * offset * 2;
					y = drag[1];
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
	 * @param {MouseEvent} event
	 */
	function mouseDown(event) {
		if (state.length === rows) {
			return;
		}
		let j = toPosition(event.offsetY);
		if (j != state.length - 1) {
			return;
		}

		let i = toPosition(event.offsetX);
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

		drag[0] = toPixels(i);
		drag[1] = toPixels(j);

		// @ts-ignore
		canvas.requestPointerLock();
	}

	/**
	 * @param {MouseEvent} event
	 */
	function mouseMove(event) {
		if (isDragging) {
			drag[0] += event.movementX;
			drag[1] += event.movementY;
			render();
		}
	}

	/**
	 * @param {MouseEvent} event
	 */
	function mouseUp(event) {
		if (isDragging) {
			let j = toPosition(drag[1]);
			if (j != state.length - 1) {
				document.exitPointerLock();
				return;
			}

			let i = toPosition(drag[0]);
			if (i > state[0].length - 2) {
				document.exitPointerLock();
				return;
			}

			if (state[j][i] != 'x' || state[j][i + 1] != 'x') {
				document.exitPointerLock();
				return;
			}

			for (let k = 0; k < state[0].length; k++) {
				let oldRow = state[state.length - 1];
				if (isDraggingState(oldRow[k])) {
					let newRow = [...oldRow];
					for (let dragIdx = 0; dragIdx < 2; dragIdx++) {
						newRow[i + dragIdx] = newRow[k + dragIdx];
						newRow[k + dragIdx] = 'x';
					}
					state.push(newRow);
					break;
				}
			}

			document.exitPointerLock();
		}
	}

	function resetDraggingState() {
		isDragging = false;
		state.forEach((row, j) => {
			row.forEach((s, i) => {
				switch (s) {
					case 'a':
						state[j][i] = 'b';
						break;
					case 'v':
						state[j][i] = 'w';
						break;
				}
			});
		});
	}

	function pointerLockChange() {
		if (canvas && document.pointerLockElement === canvas) {
			isDragging = true;
		} else if (isDragging) {
			resetDraggingState();
			render();
		}
	}
</script>

<canvas
	class="border-2"
	{width}
	{height}
	bind:this={canvas}
	on:mousedown={mouseDown}
	on:mousemove={mouseMove}
	on:mouseup={mouseUp}
/>
