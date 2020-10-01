import { minifyValue } from "../minify";

import { prefix } from "./prefix";
import { acceptsUnitless } from "./propertyMatchers";

type Value = string | number;

const normalize = (property: string, value: Value): string => {
	if (typeof value === "number" && !acceptsUnitless.test(property)) {
		// Append missing unit
		return prefix(property, `${value}px`);
	}
	return prefix(property, minifyValue(`${value}`));
};

export type ValueArray = Value | Value[];

export const serialize = (property: string, value: ValueArray): string => {
	if (typeof value !== "object") {
		return normalize(property, value);
	}
	return value.map((indexValue: Value) => normalize(property, indexValue)).join(";");
};
