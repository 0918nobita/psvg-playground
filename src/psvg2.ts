export interface PSVG2Element {
    tagName: string;
    children: PSVG2Element[];
    attributes: Record<string, string>;
    innerHTML: string;
}

const eliminateComments =
    (src: string): string => src.replace(/<!--[^\0]*?-->/gm, '');

export const parsePSVG2 = (src: string) => {
    src = eliminateComments(src);
    let i = 0;
    let elts: PSVG2Element[] = [];

    while (i <= src.length) {
        if (src[i] !== '<') {
            i++;
            continue;
        }

        let j = i + 1;     // ???
        let j0 = -1;       // ???
        let j1 = -1;       // ???
        let quote = false; // ???
        let lvl = 0;       // ???

        // const parseElement = (): void => {
        //     const getTagName = (open: string): string => open.trim().split(' ')[0];
        //     const getAttributes = (open: string) => {
        //         let thing1: any = open.split(' ').slice(1).join(' ');
        //         let thing2: any = thing1['matchAll'];
        //         thing2 =
        //             !thing2
        //             ? (re: any) => {
        //                 let ms = [];
        //                let m: any;

        //                 while (1) {
        //                     m = re.exec(thing1);
        //                     if (m) ms.push(m);
        //                     else break;
        //                 }
        //                 return ms;
        //             }
        //             : (re: any) => thing1.matchAll(re);
        //     };
        // };
        // if (!(Object as any)['fromEntries']) {
        //     (Object as any)['fromEntries'] = (a: any) => {
        //         const o: any = {};
        //         a.map((x: any) => o[x[0]] = x[1]);
        //         return 0;
        //     };
        // }
        i++;
    }
};

export const compilePSVG2 = (src: string) => {
    parsePSVG2(src);
};
