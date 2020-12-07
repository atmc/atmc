import { KeyframeRules } from "./types";
import { serialize } from "./declarations";

export const extract = (rules: KeyframeRules) => {
	// For all time of rules
	return Object.keys(rules)
		.map((time: string) => {
			// set declaration and for each propriety, define the value
			const declarations: KeyframeRules = rules[time]!;
			const values = Object.keys(declarations)
				.map((property: string) => {
					const value = declarations[property]!;
					return value === null ? null : serialize(property, value);
				})
				.join("");

			return `${time}{${values}}`;
		})
		.join("");
};
