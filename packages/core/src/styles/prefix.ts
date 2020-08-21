// tslint:disable: no-bitwise
import { prefixProperty, prefixValue } from "tiny-css-prefixer";

/** Auto-prefixer method for CSS property–value pairs. */
export const prefix = (property: string, value: string): string => {
	let declaration = `${property}:${prefixValue(property, value)}`;
	const flag = prefixProperty(property);
	if (flag & 0b001) {
		declaration += `;-ms-${declaration}`;
	}
	if (flag & 0b010) {
		declaration += `;-moz-${declaration}`;
	}
	if (flag & 0b100) {
		declaration += `;-webkit-${declaration}`;
	}
	return declaration;
};
