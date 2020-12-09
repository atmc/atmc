import React, { FC } from "react";
import { getStyleString } from "../";

const styleID = "_atmc";

const getElement = (): HTMLStyleElement => {
	// Hydrate existing style element if available
	let el = document.getElementById(styleID) as HTMLStyleElement;
	if (el) {
		return el;
	}

	// Create a new one otherwise
	el = document.createElement("style");
	el.id = styleID;

	// Avoid Edge bug where empty style elements don't create sheets
	el.appendChild(document.createTextNode(""));
	document.head.appendChild(el);
	return el;
};

export const ReactStyle: FC = () => {
	if (window) {
		const element = getElement();
		element.innerHTML = getStyleString();
		return <></>;
	}
	return <style id={styleID} dangerouslySetInnerHTML={{ __html: getStyleString() }} />;
};
