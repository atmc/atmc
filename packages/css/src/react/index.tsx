import React, { FC, Fragment } from "react";
import { getStyleString } from "../";
import { styleID } from "../dom";

export const ClientStyle: FC = () => {
	if (typeof window === "undefined") {
		return <Fragment />;
	}
	// Hydrate existing style element if available
	let el = document.getElementById(styleID) as HTMLStyleElement;
	if (el) {
		el.innerHTML = getStyleString();
	} else {
		// Create a new one otherwise
		el = document.createElement("style");
		el.id = styleID;

		// Avoid Edge bug where empty style elements don't create sheets
		el.appendChild(document.createTextNode(getStyleString()));
		document.head.appendChild(el);
	}
	return <Fragment />;
};

export const StyleTag: FC = () => {
	return <style id={styleID} dangerouslySetInnerHTML={{ __html: getStyleString() }} />;
};
