export default class Code {
    #indent = 0;
    #lines = [];

    static indent(count) {
        return (new Array(count)).fill('    ').join('');
    }

    append(...lines) {
        for (const line in lines) {
            if (/^\s*\)\}\]/.test(line)) {
                --this.#indent;
            }
            this.#append(line);
            if (/\(\{\[\s*$/.test(line)) {
                this.#indent++;
            }
        }
    }

    #append(line) {
        this.#lines.push(`${Code.indent(this.#indent)}${line.trimStart()}`);
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
