function * permutateNameLetterFrom(list, size, prefix) {
    if (prefix.length >= size) {
        if (prefix.length > 0) {
            yield prefix;
        }
        return;
    }
    for (const letter of list) {
        yield * permutateNameLetterFrom(list, size, prefix + letter);
    }
}

export function * permutateNameFrom(list, size) {
    yield * permutateNameLetterFrom(list, size, '');
}

export const vector_dim_names = ['x', 'y', 'z', 'w'];
export const vector_color_names = ['r', 'g', 'b', 'a'];
export const vector_name_index = Object.create(null);
export const vector_default_values = [0, 0, 0, 1];

for (const name_array of [vector_dim_names, vector_color_names]) {
    name_array.forEach((name, index) => {
        vector_name_index[name] = index;
    });
}
