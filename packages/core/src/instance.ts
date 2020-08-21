import hash from "./utils/hash";
import { extract } from "./styles/keyframes";
import { setup as decompose } from "./styles/decompose";
import { KeyframeRules, CSSRules } from "./styles/types";
import { objectsMerge } from "./utils/deepMerge";

const maxClassName = 9;

/**
 * Creates a new @atmc/css-in-js instance. Usable for managing styles of
 * multiple browsing contexts (e.g. an `<iframe>` besides the main document).
 */
export type Instance = {
	hydrate(): void;
	css(stylesRules: CSSRules | CSSRules[]): string;
	keyframes(
		rules: KeyframeRules,
	): {
		toString(): string;
	};
};

type Setup = {
	sheet?: CSSStyleSheet;
	rules?: Set<string>;
};
export const setup = ({ rules, sheet }: Setup = {}): Instance => {
	const ruleSet = rules || new Set<string>();
	const ruleIndex = new Set<string>();
	// Rule indexes by identification name

	const has = (nameIndex: string): boolean => ruleIndex.has(nameIndex);

	const add = (name: string, rule: string) => {
		ruleIndex.add(name);
		ruleSet.add(rule);
		if (sheet) {
			try {
				sheet.insertRule(rule, ruleIndex.size - 1);
			} catch (e) {
				console.info(`The "${rule}" class cannot be added: Syntax error`, e);
			}
		}
	};
	const decomposeToClassNames = decompose(has, add);

	const hydrateScopedSubtree = (cssRule: CSSRule): void => {
		if (cssRule.type === 1 /* CSSRule.STYLE_RULE */) {
			const { selectorText } = cssRule as CSSStyleRule;
			const index = selectorText.indexOf(".", 2);

			// Remove leading `.` from class selector
			ruleSet.add(selectorText.slice(1, index < 0 ? maxClassName : index));
		} else {
			hydrateScopedSubtree((cssRule as CSSGroupingRule).cssRules[0]);
		}
	};

	return {
		/**
		 * Marks server-rendered CSS identity names as available
		 * to avoid re-injecting them to the style sheet during runtime.
		 */
		hydrate(): void {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			// const { cssRules } = injector.sheet!;
			// for (let i = 0, { length } = cssRules; i < length; ++i) {
			// 	const cssRule = cssRules[i];
			// 	if (cssRule.type === 7 /* CSSRule.KEYFRAMES_RULE */) {
			// 		// Keyframes needn't be checked recursively, as they are never nested
			// 		rulesIndexes.add((cssRule as CSSKeyframesRule).name);
			// 	} else {
			// 		hydrateScopedSubtree(cssRule);
			// 	}
			// }
		},

		/* used to specify the values for the animating properties at
     various points during the animation */
		/**
		 * Creates keyframes for animating values of given properties over time.
		 *
		 * @param rules CSS keyframe rules as
		 * - https://gist.github.com/threepointone/9f87907a91ec6cbcd376dded7811eb31
		 *  with value fallbacks represented as arrays.
		 *
		 * - Numbers assigned to non-unitless properties are postfixed with "px".
		 * - Excess white space characters are truncated.
		 *
		 * @returns Lazy method for stably generating a unique
		 * animation name upon usage.
		 *
		 * @example
		 * const pulse = keyframes({
		 *   from: { opacity: 0 },
		 *   to: { opacity: 1 }
		 * });
		 *
		 * // Referencing
		 * const className = css({
		 *   animation: `${pulse} 3s infinite alternate`
		 * });
		 */
		css(stylesRules: CSSRules | CSSRules[]): string {
			const rules: CSSRules = (stylesRules as any).length ? objectsMerge(stylesRules as CSSRules[]) : (stylesRules as CSSRules);

			// The leading white space character gets removed
			return decomposeToClassNames({
				rules,
				textHead: "",
				textTail: "",
			}).slice(1);
		},

		keyframes(rules: KeyframeRules): { /** @private */ toString(): string } {
			let identName: string | undefined;

			return {
				toString(): string {
					if (!identName) {
						const cssText = extract(rules);

						identName = hash(cssText);
						if (!has(identName)) {
							add(identName, `@keyframes ${identName}{${cssText}}`);
						}
					}

					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					return identName!;
				},
			};
		},
	};
};
