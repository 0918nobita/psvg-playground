import { parsePSVG2 } from './parser';
import { transpilePSVG2 } from './transpiler';

export const compilePSVG2 = (src: string): void => {
    const prgm = parsePSVG2(src);
    console.log(transpilePSVG2(prgm));
};
