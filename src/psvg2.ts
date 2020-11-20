export interface PSVG2Element {
    tagName: string;
    children: PSVG2Element[];
    attributes: Record<string, string>;
    innerHTML: string;
}

const eliminateComments =
    (src: string): string => src.replace(/<!--[^\0]*?-->/gm, '');

const getTagName =
    (open: string): string => open.trim().split(' ')[0].trimEnd();

const getAttributes =
    (open: string) => {
        const iter = open.matchAll(/(^| )([^ ]+?)\="([^"]*)"/g);
        const arr = Array.from(iter);
        return Object.fromEntries(arr.map((x) => x.slice(2)));
    };

export const parsePSVG2 = (src: string): PSVG2Element[] => {
    src = eliminateComments(src);
    let i = 0;
    const elts: PSVG2Element[] = [];

    while (i <= src.length) {
        if (!(src[i] === '<')) {
            i++;
            continue;
        }

        let j = i + 1;
        let bodyStart = -1;
        let bodyEnd = -1;
        let isQuoted = false;
        let nestingLevel = 0;

        const parseNormalTag = (bodyStart: number, bodyEnd: number): void => {
            const open = src.slice(i + 1, bodyStart - 1);
            const body = src.slice(bodyStart, bodyEnd);
            const elt: PSVG2Element = {
                tagName: getTagName(open),
                attributes: getAttributes(open),
                children: parsePSVG2(body),
                innerHTML: body,
            };
            elts.push(elt);
        };

        const parseSelfClosingTag = (): void => {
            const open = src.slice(i + 1, j);
            const elt: PSVG2Element = {
                tagName: getTagName(open),
                attributes: getAttributes(open),
                children: [],
                innerHTML: '',
            };
            elts.push(elt);
        };

        while (j <= src.length) {
            if (src[j] === '\\') j++;

            if (src[j] === '"') isQuoted = !isQuoted;

            if (!isQuoted) {
                if (src[j] === '>' && nestingLevel === 0 && bodyStart === -1) bodyStart = j + 1;

                if (src[j] === '<') {
                    if (src[j + 1] === '/') {
                        nestingLevel--;

                        if (nestingLevel === -1) bodyEnd = j;

                        while (src[j] !== '>') j++;

                        if (nestingLevel === -1) {
                            parseNormalTag(bodyStart, bodyEnd);
                            i = j;
                            break;
                        }
                    } else {
                        nestingLevel++;
                    }
                } else if (src[j] === '/' && src[j + 1] === '>') {
                    nestingLevel--;

                    if (nestingLevel === -1) {
                        parseSelfClosingTag();
                        i = j;
                        break;
                    }
                }
            }
            j++;
        }

        i++;
    }

    return elts;
};

export interface PSVG2Func {
    name: string;
    args: string[];
}

export const transpilePSVG2 = (prgm: PSVG2Element[]): string => {
    const funcs: Record<string, PSVG2Func> = {};

    const __val = (x: string): any => {
        if (new RegExp(/^[+-]?(\d+([.]\d*)?([eE][+-]?\d+)?|[.]\d+([eE][+-]?\d+)?)$/g).test(x))
            return parseFloat(x);

        if (x === 'true' || x === 'false') return x === 'true';

        const hasComma = x.includes(',');
        if (hasComma) {
            x = x.replace(/, */g, ',');
            const hasWhitespace = x.includes(' ');
            const y = __tolist(x);
            if (!hasWhitespace) {
                (y as any)['allCommas'] = true;
            }
            return y;
        }
    };

    const __makelist = (x: any[]): any[] => {
        x.toString = () => x.join((x as any)['allCommas'] ? ',' : ' ');
        return x;
    };

    const __tolist = (s: string): any[] =>
        __makelist(s.replace(/,/g, ' ').split(' ').filter(x => x.length).map(__val));

    return Function(`"use strict"; return (${__val.toString()})('false');`)();
};

export const compilePSVG2 = (src: string): void => {
    const prgm = parsePSVG2(src);
    console.log(transpilePSVG2(prgm));
};
