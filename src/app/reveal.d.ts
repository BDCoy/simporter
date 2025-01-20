declare module 'reveal.js' {
  export interface RevealOptions {
    controls?: boolean;
    progress?: boolean;
    slideNumber?: boolean;
    hash?: boolean;
    width?: number | string;
    height?: number | string;
    margin?: number;
    minScale?: number;
    maxScale?: number;
    [key: string]: any;
  }

  export default class Reveal {
    constructor(node: HTMLElement, options?: RevealOptions);
    initialize(): Promise<void>;
    slide(indexh: number, indexv?: number, indexf?: number): void;
  }
}
