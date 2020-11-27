import { PSVG2Element } from './element';
import { PSVG2Func } from './func';

export const transpilePSVG2 = (prgm: PSVG2Element[]): string => {
    const funcs: Record<string, PSVG2Func> = {};

    const __val = (x: string): any => {
        if (
            new RegExp(
                /^[+-]?(\d+([.]\d*)?([eE][+-]?\d+)?|[.]\d+([eE][+-]?\d+)?)$/g
            ).test(x)
        )
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
        __makelist(
            s
                .replace(/,/g, ' ')
                .split(' ')
                .filter((x) => x.length)
                .map(__val)
        );

    return Function(`"use strict"; return (${__val.toString()})('false');`)();
};
