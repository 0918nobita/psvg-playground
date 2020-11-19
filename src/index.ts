import { compilePSVG, parsePSVG } from '@lingdong/psvg';

import { compilePSVG2 } from './psvg2';

// debugger;

const src = `
    <psvg width="500" height="200">
        <for i="0" true="{i < 5}" step="1">
            <var red="{RANDOM() * 255}" />
            <var green="{RANDOM() * 255}" />
            <var blue="{RANDOM() * 255}" />

            <circle
                cx="{i * 50 + 30}"
                cy="{i * 50 + 30}"
                r="15"
                fill="rgb({red},{green},{blue})" />
        </for>
    </psvg>`;


console.log(parsePSVG(src));

const svgElem = compilePSVG(src);

console.log({ svgElem });

compilePSVG2(src);

const div = document.createElement('div');
div.innerHTML = svgElem;
document.body.appendChild(div);