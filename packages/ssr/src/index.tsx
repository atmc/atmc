import * as React from "react";
import { setup, getStyleId, styleID } from "@atmc/core";

let rules = new Set<string>();

const isBrowser = typeof window !== "undefined";

const defaultInstance = setup(isBrowser ? { sheet: getStyleId().sheet! } : { rules });

export const hydrate = defaultInstance.hydrate;
export const css = defaultInstance.css;
export const keyframes = defaultInstance.keyframes;

/**
 * Transforms an injector's data into a `<style>` JSX element.
 *
 *
 * @returns A `<style>` JSX element containing server-renderable CSS.
 */
export function getStyleElement() {
	let styleString = "";
	rules.forEach((rule) => (styleString += rule));
	return <style id={styleID} dangerouslySetInnerHTML={{ __html: styleString }} />;
}

export type { CSSRules, KeyframeRules } from "@atmc/core";
