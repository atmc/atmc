import { CSSRules } from "../rules";

const isObject = (item: any) => item && typeof item === "object" && !Array.isArray(item);

export const merge = (target: any, ...sources: any): any => {
	if (!sources.length) {
		return target;
	}

	const source = sources.shift();

	if (isObject(target) && isObject(source)) {
		for (const key in source) {
			if (isObject(source[key])) {
				if (!target[key]) {
					Object.assign(target, { [key]: {} });
				}
				merge(target[key], source[key]);
			} else {
				Object.assign(target, { [key]: source[key] });
			}
		}
	}

	return merge(target, ...sources);
};

export const objectsMerge = (objects: CSSRules[]): CSSRules => {
	let rules: CSSRules = {};
	objects.forEach((rule: CSSRules) => {
		rules = merge(rules, rule);
	});
	return rules;
};
