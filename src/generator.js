import fs from 'node:fs';
import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import Code from './code.js';
import { renderFile as renderFileAsync } from 'ejs';

const renderFile = promisify(renderFileAsync);

const __file__ = fileURLToPath(import.meta.url);
const __dir__ = dirname(__file__);

const vector_dim_names = ['x', 'y', 'z', 'w'];
const vector_color_names = ['r', 'g', 'b', 'a'];
const vector_name_index = Object.create(null);
const vector_default_values = [0, 0, 0, 1];

for (const name_array of [vector_dim_names, vector_color_names]) {
    name_array.forEach((name, index) => {
        vector_name_index[name] = index;
    });
}

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

function * permutateNameFrom(list, size) {
    yield * permutateNameLetterFrom(list, size, '');
}

function matrixDefaultValues(rows, columns) {
    let values = (new Array(rows * columns)).fill(0);
    if (rows === columns) {
        values = values.map((v, i) => (i % (rows + 1) ? 1 : 0));
    }
    return values;
}

function make_indent(indent) {
    return new Array(indent).fill('  ').join('');
}

function json_stringify_array(items) {
    let is_multiline = false;
    const strings = new Array(items.length);
    let i = 0;
    for (const item of items) {
        let string = json_stringify(item);
        if (string == null) {
            string = 'null';
        }
        is_multiline = is_multiline || string.indexOf('\n') >= 0;
        strings[i++] = string;
    }
    if (is_multiline) {
        const lines = [`[`];
        for (let i = 0; i < strings.length - 1; ++i) {
            lines.push(...strings[i].split('\n').map(s => `${make_indent(1)}${s}`));
            lines[lines.length - 1] += ',';
        }
        lines.push(...strings[strings.length - 1].split('\n').map(s => `${make_indent(1)}${s}`));
        lines.push(`]`);
        return lines.join('\n');
    }
    return `[${strings.join(', ')}]`;
}

function json_stringify_object(object) {
    let is_multiline = false;
    let total_length = 0;
    const entries = [];
    for (const [name, value] of Object.entries(object)) {
        const entry_name = JSON.stringify(name);
        const entry_value = json_stringify(value);
        is_multiline = is_multiline || entry_value.indexOf('\n') >= 0;
        total_length += entry_name.length + entry_value.length;
    }
    if (!is_multiline) {
        if (total_length + (entries.length - 1) * 4 + 4 + 2 > 160) {
            is_multiline = true;
        }
    }
    if (is_multiline) {
        const lines = ['{'];
        for (let i = 0; i < entries.length - 1; ++i) {
            const [name, value] = entries[i];
            const value_lines = value.split('\n').map(s => `${make_indent(1)}${s}`);
            value_lines[0] = `${name}: ${value_lines[0]}`;
            value_lines[value_lines.length - 1] += ',';
            lines.push(...value_lines);
        }
        {
            const [name, value] = entries[entries.length - 1];
            const value_lines = value.split('\n').map(s => `${make_indent(1)}${s}`);
            value_lines[0] = `${name}: ${value_lines[0]}`;
            lines.push(...value_lines);
        }
        lines.push('}');
        return lines.join('\n');
    }

    return `{ ${entries.map(([name, value]) => `${name}: ${value}`).join(', ')} }`;
}

function json_stringify(value) {
    if (value == null || typeof value === 'boolean' || typeof value === 'number' || typeof value === 'string') {
        return `${JSON.stringify(value)}`;
    }
    if (value !== Object(value) || typeof value === 'function') {
        return null;
    }
    if (typeof value[Symbol.iterator] === 'function') {
        return json_stringify_array([...value]);
    }
    return json_stringify_object(value);
}

const cache = Object.create(null);

{
    const filename = resolvePath(__dir__, 'template/main.js.ejs');
    let script_code = await renderFile(filename, {
        vector_dim_names,
        vector_color_names,
        vector_name_index,
        vector_default_values,
        permutateNameFrom,
        matrixDefaultValues
    }, {
        cache,
        escape: json_stringify,
        async: true,
        strict: true
    });
    script_code = script_code.split('\n');
    let code = new Code();
    code.append(...script_code);
    code = code.toString();
    code = code.split(/\n{3,}/mg).join('\n\n');
    code = code.trimEnd();
    console.log(code.toString());
}
