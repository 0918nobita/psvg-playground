export interface PSVG2Element {
    tagName: string;
    children: PSVG2Element[];
    attributes: Record<string, string>;
    innerHTML: string;
}
