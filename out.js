function __val(x) {
    if (new RegExp(/^[+-]?(\d+([.]\d*)?([eE][+-]?\d+)?|[.]\d+([eE][+-]?\d+)?)$/g).test(x)) {
        return parseFloat(x);
    }
    if (x == `true` || x == `false`) {
        return x == `true`;
    }
    let hascm = x["includes"](",");
    if (hascm) {
        x = x.replace(/, */g, ",");
        let hasws = x["includes"](" ");
        var y = __tolist(x);
        if (!hasws) {
            y["allCommas"] = true;
        }
        return y;
    }
    if (x["includes"](" ")) {
        return __tolist(x);
    }
    return x;
}

function __tolist(s) {
    return __makelist(s.replace(/,/g, " ").split(" ").filter((x) => x.length).map(__val));
}

function __makelist(x) {
    x.toString = function() {
        return x.join(x["allCommas"] ? "," : " ");
    };
    return x;
}

const NTH = function(x, i) {
    if (typeof x == "string") {
        x = __tolist(x);
    }
    return x[i];
};

const TAKE = function(x, n) {
    if (typeof x == "string") {
        x = __tolist(x);
    }
    return __makelist(x.slice(0, n));
};

const DROP = function(x, n) {
    if (typeof x == "string") {
        x = __tolist(x);
    }
    return __makelist(x.slice(n));
};

const UPDATE = function(x, i, y) {
    if (typeof x == "string") {
        x = __tolist(x);
    }
    let z = x.slice();
    z[i] = y;
    return __makelist(z);
};

const MAP = function(x, f) {
    if (typeof x == "string") {
        x = __tolist(x);
    }
    return __makelist(x.map((y) => f(__val(y))));
};

const FILTER = function(x, f) {
    if (typeof x == "string") {
        x = __tolist(x);
    }
    return __makelist(x.filter((y) => f(__val(y))));
};

const COUNT = function(x) {
    if (typeof x == "string") {
        x = __tolist(x);
    }
    return x.length;
};

const CAT = function(...args) {
    return __makelist([].concat(...args.filter((y) => y.toString().length).map((x) => typeof x == "string" ? __tolist(x) : x)));
};

const REV = function(x) {
    if (typeof x == "string") {
        x = __tolist(x);
    }
    return __makelist(x.slice().reverse());
};

const FILL = function(x, n) {
    return __makelist(new Array(n)["fill"](x));
};

const LERP = function(x, y, t) {
    return x * (1 - t) + y * t;
};

const CLAMP = function(x, lo, hi) {
    [lo, hi] = [Math.min(lo, hi), Math.max(lo, hi)];
    return Math.min(Math.max(x, lo), hi);
};

const MAPVAL = function(x, istart, istop, ostart, ostop) {
    return ostart + (ostop - ostart) * ((x - istart) / (istop - istart));
};

const ABS = Math["abs"];
const ACOS = Math["acos"];
const ACOSH = Math["acosh"];
const ASIN = Math["asin"];
const ASINH = Math["asinh"];
const ATAN = Math["atan"];
const ATANH = Math["atanh"];
const ATAN2 = Math["atan2"];
const CEIL = Math["ceil"];
const CBRT = Math["cbrt"];
const EXPM1 = Math["expm1"];
const CLZ32 = Math["clz32"];
const COS = Math["cos"];
const COSH = Math["cosh"];
const EXP = Math["exp"];
const FLOOR = Math["floor"];
const FROUND = Math["fround"];
const HYPOT = Math["hypot"];
const IMUL = Math["imul"];
const LOG = Math["log"];
const LOG1P = Math["log1p"];
const LOG2 = Math["log2"];
const LOG10 = Math["log10"];
const MAX = Math["max"];
const MIN = Math["min"];
const POW = Math["pow"];
const RANDOM = Math["random"];
const ROUND = Math["round"];
const SIGN = Math["sign"];
const SIN = Math["sin"];
const SINH = Math["sinh"];
const SQRT = Math["sqrt"];
const TAN = Math["tan"];
const TANH = Math["tanh"];
const TRUNC = Math["trunc"];
const E = Math["E"];
const LN10 = Math["LN10"];
const LN2 = Math["LN2"];
const LOG10E = Math["LOG10E"];
const LOG2E = Math["LOG2E"];
const PI = Math["PI"];
const SQRT1_2 = Math["SQRT1_2"];
const SQRT2 = Math["SQRT2"];

let __out = '';
__out += `<svg xmlns="http://www.w3.org/2000/svg" width="${500}" height="${200}" >`;

const WIDTH = 500;
const HEIGHT = 200;

for (let i = 0; i < 5; i += 1) {
    let red = RANDOM() * 255;
    let green = RANDOM() * 255;
    let blue = RANDOM() * 255;
    __out += `<circle cx="${i * 50 + 30}" cy="${i * 50 + 30}" r="${15}" fill="${__val(`rgb(${red},${green},${blue})`)}" />`;
}

__out+='</svg>';

console.log(__out);
