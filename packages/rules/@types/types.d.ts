import { PropertiesFallback, SimplePseudos } from "csstype";
export declare type Properties = PropertiesFallback<string | number>;
declare type Style<P extends Record<string, any> = Properties> = P & {
    [pseudo in SimplePseudos]?: P;
} & {
    selectors?: {
        [selector: string]: P;
    };
};
declare type Grouping<P extends Record<string, any> = Properties> = {
    "@media"?: {
        [conditionText: string]: Rules<P>;
    };
    "@supports"?: {
        [conditionText: string]: Rules<P>;
    };
};
export declare type Rules<P extends Record<string, any> = Properties> = Style<P> & Grouping<P>;
export declare type KeyframeRules = {
    [time in "from" | "to"]?: Properties;
} | {
    [time: string]: Properties;
};
export interface CSSRules extends Rules<Omit<Properties, "all">> {
}
export {};
