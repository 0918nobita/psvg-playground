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

        let j = i + 1;         // counter variable for inner loop
        let bodyStart = -1;    // `</...>` で閉じる要素の body の先頭を指す
        let bodyEnd = -1;      // `</...>` で閉じる要素の body の末尾を指す
        let isQuoted = false;  // flag which represents whether it's parsing quoted string
        let nestingLevel = 0;  // nest level

        const parseElement = () => {
            if (bodyStart !== -1) {
                // `</...>` で閉じる要素の内側のパース
                const open = src.slice(i + 1, bodyStart - 1);
                const body = src.slice(bodyStart, bodyEnd);
                const elt: PSVG2Element = {
                    tagName: getTagName(open),
                    attributes: getAttributes(open),
                    children: parsePSVG2(body),
                    innerHTML: body,
                };
                elts.push(elt);
            } else {
                // `.../>` で閉じる要素の内側のパースを開始
                const open = src.slice(i + 1, j);
                const elt: PSVG2Element = {
                    tagName: getTagName(open),
                    attributes: getAttributes(open),
                    children: [],
                    innerHTML: '',
                };
                elts.push(elt);
            }
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
                            // `</...>` で閉じる要素の内側のパースを開始
                            parseElement();
                            i = j;
                            break;
                        }
                    } else {
                        nestingLevel++;
                    }
                } else if (src[j] === '/' && src[j + 1] === '>') {
                    nestingLevel--;

                    if (nestingLevel === -1) {
                        // `.../>` で閉じる要素の内側のパースを開始
                        parseElement();
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

export const compilePSVG2 = (src: string): void => {
    console.log(parsePSVG2(src));
};
