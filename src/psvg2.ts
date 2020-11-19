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
    let elts: PSVG2Element[] = [];

    while (i <= src.length) {
        if (!(src[i] === '<')) {
            i++;
            continue;
        }

        console.log('outer', src.slice(i));

        let j = i + 1;     // counter variable for inner loop
        let j0 = -1;       // ???
        let j1 = -1;       // ???
        let quote = false; // ???
        let lvl = 0;       // nest level

        const parseElement = () => {
            if (j0 !== -1) {
                let open = src.slice(i + 1, j0 - 1);
                let body = src.slice(j0, j1);
                let elt: PSVG2Element = {
                    tagName: getTagName(open),
                    attributes: getAttributes(open),
                    children: parsePSVG2(body),
                    innerHTML: body,
                };
                elts.push(elt);
            } else {
                let open = src.slice(i + 1, j);
                let elt: PSVG2Element = {
                    tagName: getTagName(open),
                    attributes: getAttributes(open),
                    children: [],
                    innerHTML: '',
                }
                elts.push(elt);
            }
        };

        while (j <= src.length) {
            if (src[j] === '\\') j++;

            if (src[j] === '"') quote = !quote;

            if (!quote) {
                if (src[j] === '>' && lvl === 0 && j0 === -1) j0 = j + 1;

                if (src[j] === '<') {
                    if (src[j + 1] === '/') {
                        lvl--;

                        if (lvl === -1) j1 = j;

                        while (src[j] !== '>') j++;

                        if (lvl === -1) {
                            // `</...>` で閉じる要素の内側のパースを開始
                            parseElement();
                            i = j;
                            break;
                        }
                    } else {
                        lvl++;
                    }
                } else if (src[j] === '/' && src[j + 1] === '>') {
                    lvl--;

                    if (lvl === -1) {
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
