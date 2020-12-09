import { setup } from "@atmc/instance";

let globalRules = {};
let pageRules = [];
let fontsRules = [];

const defaultInstance = setup({ rules: pageRules, globalRules, fonts: fontsRules });

export const css = defaultInstance.css;
export const keyframes = defaultInstance.keyframes;
export const globalStyles = defaultInstance.globalStyles;
export const fonts = defaultInstance.fonts;

export const getStyleString = (): string => {
	return defaultInstance.getStylesString();
};

export type { KeyframeRules, CSSRules, FontSrc } from "@atmc/rules";
