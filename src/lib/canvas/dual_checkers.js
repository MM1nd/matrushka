export { _render, posToBaseUnits, baseUnitsToPosition, isDraggingState, createGeometry, breadthFirstSearch };

/**
     * @param {number} rows
     * @param {number} cols
     * @param {number} padding
     * @param {number} radius
     */
function createGeometry(rows, cols, padding = 6, radius = 60) {
    const half_grid = padding + radius;
    return {
        width: cols * 2 * half_grid,
        height: rows * 2 * half_grid,
        padding,
        grid: 2 * half_grid,
        half_grid,
        radius,
        rows
    };
}

/**
     * @param {number} pos
     * @param {{ width: number; height: number; padding: number; grid: number; half_grid: number; radius: number; rows:number; }} geometry
     */
function posToBaseUnits(pos, geometry) {
    return (pos * 2 + 1) * geometry.half_grid;
}

/**
     * @param {number} base
     * @param {{ width: number; height: number; padding: number; grid: number; half_grid: number; radius: number; rows:number;}} geometry
     */
function baseUnitsToPosition(base, geometry) {
    return Math.trunc(base / geometry.grid);
}

/**
     * @param {string} state
     */
function isDraggingState(state) {
    return state === 'a' || state === 'v';
}

/**
 * @param {HTMLCanvasElement} canvas
 * @param {number} scale
 * @param {string[][]} state
 * @param {{ width: number; height: number; padding: number; grid: number; half_grid: number; radius: number; rows:number;}} geometry
 */
function _render(canvas, scale, state, geometry, offsetX = 0, offsetY = 0) {
    if (!canvas || !window) {
        return;
    }

    canvas.width = geometry.width * scale;
    canvas.height = geometry.height * scale;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Could not getContext of canvas.');
        return;
    }
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
    ctx.clearRect(0, 0, geometry.width, geometry.height);
    for (let k = 1; k < geometry.rows; k++) {
        ctx.beginPath();
        ctx.moveTo(geometry.padding, k * geometry.grid);
        ctx.lineTo(geometry.width - geometry.padding, k * geometry.grid);
        ctx.stroke();
    }

    let dragIdx = 0;
    state.forEach((row, j) => {
        row.forEach((s, i) => {
            let x = posToBaseUnits(i, geometry);
            let y = posToBaseUnits(j, geometry);
            let tone = 0;
            let alpha = 1;
            let r = geometry.radius;

            if (s === 'w' || s === 'v' || s === 'x') {
                tone = 255;
            }

            if (isDraggingState(s)) {
                alpha = 0.5;
                x = offsetX + dragIdx * geometry.grid;
                y = offsetY;
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
 * @param {string[]} s
 * @param {number} i
 * @param {string} c
 * @param {number} count
 * @param {string} o
 * @param {number} other_count
 */
function reachedVariantGoal(s, i, c, count, o, other_count) {
    for (let j = 0; j < count; j++) {
        if (s[i + j] !== c) {
            return false;
        }
    }
    for (let j = 0; j < other_count; j++) {
        if (s[i + count + j] !== o) {
            return false;
        }
    }
    return true;

}

/**
 * @param {string[]} s
 * @param {number} count_b
 * @param {number} count_w
 */
function reachedGoal(s, count_b, count_w) {
    for (let i = 0; i < s.length - (count_b + count_w) + 1; i++) {
        if (s[i] === 'x') {
            continue;
        }

        if (s[i] === 'b') {
            if (reachedVariantGoal(s, i, 'b', count_b, 'w', count_w)) {
                return true;
            }
        }

        if (s[i] === 'w') {
            if (reachedVariantGoal(s, i, 'w', count_w, 'b', count_b)) {
                return true;
            }
        }
    }
    return false;
}

/**
 * @param {string[]} initial_state
 */
function breadthFirstSearch(initial_state) {
    if (initial_state.length < 2) {
        return [initial_state];
    }

    let count_b = 0;
    let count_w = 0;

    initial_state.forEach((s) => {
        if (s === 'b') {
            count_b++;
        }
        if (s === 'w') {
            count_w++;
        }
    })

    if (count_b + count_w === 0) {
        return [initial_state];
    }

    let q = [[initial_state]];
    let v = new Set();
    v.add(initial_state.join(''));

    let p;

    while ((p = q.shift()) !== undefined) {
        let s = p.at(-1);

        if (s === undefined) {
            console.error('We know that this can never happen but the typechecker does not understand it.');
            return null;
        }

        if (reachedGoal(s, count_b, count_w)) {
            return p;
        }

        for (let i = 0; i < s.length - 1; i++) {
            if (s[i] !== 'x' && s[i + 1] !== 'x') {
                for (let j = 0; j < s.length - 1; j++) {
                    if (s[j] === 'x' && s[j + 1] === 'x' || s[j] === 'x' && j + 1 === i || j === i + 1 && s[j + 1] === 'x') {
                        let new_s = [...s];
                        new_s[j] = s[i];
                        new_s[j + 1] = s[i + 1];
                        new_s[i] = 'x';
                        new_s[i + 1] = 'x'
                        let new_str = new_s.join('');
                        if (!v.has(new_str)) {
                            v.add(new_str);
                            let new_p = [...p, new_s];
                            q.push(new_p);
                        }
                    }
                }
            }
        }
    }

    return null;
}