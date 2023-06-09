export default class Code {
    #indent = 0;
    #lines = [];

    static indent(count) {
        return (new Array(count)).fill('    ').join('');
    }

    append(...lines) {
        for (const line of lines) {
            if (/^\s*[)}\]]/.test(line)) {
                --this.#indent;
            }
            this.#append(line);
            if (/[({[]\s*$/.test(line)) {
                this.#indent++;
            }
        }
    }

    #append(line) {
        line = line.trimStart();
        if (line.length > 0) {
            this.#lines.push(`${Code.indent(this.#indent)}${line.trimStart()}`);
        } else {
            this.#lines.push('');
        }
    }

    get lines() {
        return this.#lines;
    }

    get indent() {
        return this.#indent;
    }

    set indent(value) {
        if (!Number.isSafeInteger(value) || value < 0) {
            throw new TypeError('Indent must be positive integer');
        }
        this.#indent = value;
    }

    toString() {
        return this.#lines.join('\n');
    }
}
