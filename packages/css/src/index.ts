import { setup } from "./instance";

let globalRules = {};
let pageRules = [];
let fontsRules = [];

const defaultInstance = setup({ rules: pageRules, globalRules, fonts: fontsRules });

export const getStyleString = defaultInstance.getStylesString;
export const css = defaultInstance.css;
export const keyframes = defaultInstance.keyframes;
export const globalStyles = defaultInstance.globalStyles;
export const fonts = defaultInstance.fonts;
export { ClientStyle, StyleTag } from "./react";

export type { KeyframeRules, CSSRules } from "./rules";
export type { FontSrc } from "./fonts";
export type { GlobalRules } from "./global";
