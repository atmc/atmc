import hash from "../utils/hash";
import { minifyCondition } from "../minify";

import { serialize } from "./declarations";
import { CSSRules } from "./types";

type GetParentRule = {
	parentRules: string[] | undefined;
	firstParentRule: string;
	parentRuleTail: string;
	selectorStartIndex?: number;
};

const getParentRule = (key: string, textHeadLength: number, selectorStartIndex?: number): GetParentRule => {
	let parentRules: string[] | undefined;
	let firstParentRule = key[0] === ":" || key[0] === "@" || key[0] === "&" ? key : minifyCondition(key);
	let parentRuleTail = "";
	let startIndex = selectorStartIndex;

	if (startIndex == null) {
		if (firstParentRule[0] === ":" || firstParentRule[0] === "&") {
			// eslint-disable-next-line no-param-reassign
			startIndex = textHeadLength;
			parentRules = firstParentRule.split(",").map(
				(singleSelector) => minifyCondition(singleSelector).replace("&", ""), // lgtm [js/incomplete-sanitization]
			);
		} else if (firstParentRule === "selectors") {
			firstParentRule = "";
		} else if (firstParentRule[0] !== "@") {
			firstParentRule += "{";
			parentRuleTail = "}";
		}
	}

	return {
		parentRules,
		firstParentRule,
		parentRuleTail,
		selectorStartIndex: startIndex,
	};
};

type DecomposeToClassNames = {
	rules: CSSRules;
	textHead: string;
	textTail: string;
	selectorStartIndex?: number;
};

export const setup = (has: (nameIndex: string) => boolean, add: (name: string, rule: string) => void): ((options: DecomposeToClassNames) => string) => {
	const rulesToClassNames = ({ rules, textHead, textTail, selectorStartIndex }: DecomposeToClassNames): string => {
		let classNames = "";

		Object.keys(rules).forEach((key: string) => {
			const value = rules[key as keyof typeof rules];

			if (!value && value !== 0) {
				return;
			}

			if (typeof value !== "object" || Array.isArray(value)) {
				// Class specificities are controlled with repetition, see:
				// https://csswizardry.com/2014/07/hacks-for-dealing-with-specificity/

				const propertyKey = key.replace(/[A-Z]/g, (match: string): string => `-${match.toLowerCase()}`);
				// In case of class start with -
				const declarations = serialize(propertyKey, value);
				const className = hash(textHead + declarations);
				if (!has(className)) {
					const scopeSelector = `.${className}`;
					const styleRule = `${
						textHead.slice(0, selectorStartIndex) + scopeSelector + (selectorStartIndex != null ? `${textHead.slice(selectorStartIndex)}{` : "{")
					}${declarations}}${textTail}`;
					add(className, styleRule);
				}
				classNames += ` ${className}`;
			} else {
				const { parentRules, firstParentRule, parentRuleTail, selectorStartIndex: selectorStartIndexToRule } = getParentRule(key, textHead.length, selectorStartIndex);
				(parentRules || [firstParentRule]).forEach(
					// eslint-disable-next-line no-loop-func
					(parentRuleHead) => {
						classNames += rulesToClassNames({
							rules: value as CSSRules,
							textHead: textHead + parentRuleHead,
							textTail: parentRuleTail + textTail,
							selectorStartIndex: selectorStartIndexToRule,
						});
					},
				);
			}
		});

		return classNames;
	};

	return rulesToClassNames;
};
