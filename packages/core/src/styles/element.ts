export const styleID = "_atmc";

export const getStyleId = (): HTMLStyleElement => {
	// Hydrate existing style element if available
	let el = document.getElementById(styleID) as HTMLStyleElement | null;
	if (el) {
		return el;
	}

	// Create a new one otherwise
	el = document.createElement("style");
	el.id = styleID;

	// Avoid Edge bug where empty style elements don't create sheets
	el.appendChild(document.createTextNode(""));

	return document.head.appendChild(el);
};
