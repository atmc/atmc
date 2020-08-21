/* eslint-disable @typescript-eslint/no-explicit-any */

import { PropertiesFallback, SimplePseudos } from "csstype";

type Properties = PropertiesFallback<string | number>;

type Style<P extends Record<string, any> = Properties> = P &
	{ [pseudo in SimplePseudos]?: P } & {
		selectors?: { [selector: string]: P };
	};

type Grouping<P extends Record<string, any> = Properties> = {
	"@media"?: { [conditionText: string]: Rules<P> };
	"@supports"?: { [conditionText: string]: Rules<P> };
};

type Rules<P extends Record<string, any> = Properties> = Style<P> & Grouping<P>;

export type KeyframeRules =
	| { [time in "from" | "to"]?: Properties }
	| { [time: string]: Properties };

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface CSSRules extends Rules<Omit<Properties, "all">> {}
