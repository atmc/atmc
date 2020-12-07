import { KeyframeRules, CSSRules } from "@atmc/rules";
import { GlobalRules, HTMLTags, FontSrc } from "@atmc/global";
export declare type Instance = {
    hydrate(): void;
    css(stylesRules: CSSRules | CSSRules[]): string;
    globalStyles(stylesRules: Partial<GlobalRules>): void;
    fonts(srcs: FontSrc[]): void;
    keyframes(rules: KeyframeRules): {
        toString(): string;
    };
};
declare type GlobalRulesSet = {
    [key in HTMLTags]: string[];
};
declare type Setup = {
    rules?: string[];
    globalRules?: Partial<GlobalRulesSet>;
    fonts?: string[];
};
export declare const setup: ({ rules, globalRules, fonts }?: Setup) => Instance;
export {};
