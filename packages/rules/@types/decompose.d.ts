import { CSSRules } from "./types";
declare type DecomposeToClassNames = {
    rules: CSSRules;
    textHead: string;
    textTail: string;
    selectorStartIndex?: number;
};
export declare const setup: (has: (nameIndex: string) => boolean, add: (rule: string) => void) => (options: DecomposeToClassNames) => string;
export {};
