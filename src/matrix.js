const matrix_determinant_generator = {
    2: function (rows, cols) {
        const result = [[], []];
        result[0].push([[rows[0], cols[0]], [rows[1], cols[1]]]);
        result[1].push([[rows[0], cols[1]], [rows[1], cols[0]]]);
        return result;
    }
};

for (let size = 3; size <= 4; ++size) {
    matrix_determinant_generator[size] = function (rows, cols) {
        const result = [[], []];
        for (let i = 0; i < size; ++i) {
            const s = i % 2;
            const c = cols.filter((v, x) => x !== i);
            const r = rows.slice(1);
            const t = matrix_determinant_generator[size - 1](r, c);
            result[s].push(...t[0].map(v => [[rows[0], cols[i]], ...v]));
            result[1 - s].push(...t[1].map(v => [[rows[0], cols[i]], ...v]));
        }
        return result;
    };
}

export function get_determinant_code(name, size, rows = new Array(size).fill(0).map((v, i) => i), cols = new Array(size).fill(0).map((v, i) => i)) {
    if (size === 1) {
        return `${name}[${rows[0]}][${cols[0]}]`;
    }
    const [positive, negative] = matrix_determinant_generator[size](rows, cols);
    return positive.map(factor => factor.map(coord => `${name}[${coord[0]}][${coord[1]}]`).join(' * ')).join(' + ') + ' - ' +
        negative.map(factor => factor.map(coord => `${name}[${coord[0]}][${coord[1]}]`).join(' * ')).join(' - ');
}
