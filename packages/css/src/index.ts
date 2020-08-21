import { setup, getStyleId } from "@atmc/core";

const isBrowser = typeof window !== "undefined";

const defaultInstance = setup(isBrowser ? { sheet: getStyleId().sheet! } : {});

export const hydrate = defaultInstance.hydrate;
export const css = defaultInstance.css;
export const keyframes = defaultInstance.keyframes;
export type { CSSRules } from "@atmc/core";
