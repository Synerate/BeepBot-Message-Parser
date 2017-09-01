export interface ITokens {
    type: string;
    value: string;
    position: number;
}

const REGEX = /[^\s{}]/i;

export function tokenizer(input: string) {
    let current = 0;
    const tokens: ITokens[] = [];

    while (current < input.length) {
        let char = input[current];
        if (char === '{') {
            tokens.push({ type: 'paren', value: '{', position: current });
            current++;
            continue;
        }
        if (char === '}') {
            tokens.push({ type: 'paren', value: '}', position: current });
            current++;
            continue;
        }
        if (char === '"') {
            let value = '';
            char = input[++current];

            while (char !== '"') {
                value += char;
                char = input[++current];
            }

            char = input[++current];
            tokens.push({ type: 'string', value, position: current });
            continue;
        }
        // Ignore white spaces.
        if (/\s/.test(char)) {
            current++;
            continue;
        }

        let text = '';
        while (REGEX.test(char) && char != null) {
            text += char;
            char = input[++current];
        }
        tokens.push({ type: 'string', value: text, position: current });
    }

    return tokens;
}
