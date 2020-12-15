import hash from "../hash";
import { objectsMerge } from "../merge-styles";
import { extractKeyFrames, setupDecompose, KeyframeRules, CSSRules } from "../rules";
import { getGlobalRule, GlobalRules, HTMLTags } from "../global";
import { getStyleId } from "../dom";
import { FontSrc } from "../fonts";

type ExtraClassNames = {
	before?: string;
	after?: string;
};

export type Instance = {
	getStyleString(): string;
	css(stylesRules: CSSRules | CSSRules[], extraClassNames?: ExtraClassNames): string;
	globalStyles(stylesRules: Partial<GlobalRules>): void;
	fonts(srcs: FontSrc[]): void;
	keyframes(
		rules: KeyframeRules,
	): {
		toString(): string;
	};
};

type GlobalRulesSet = { [key in HTMLTags]: string[] };

type Setup = {
	sheet?: CSSStyleSheet;
	rules?: string[];
	globalRules?: Partial<GlobalRulesSet>;
	fonts?: string[];
};
export const setup = ({ sheet, rules, globalRules, fonts }: Setup = {}): Instance => {
	const ruleArr = rules || [];
	const globalSet = globalRules || {};
	const fontArr = fonts || [];
	let target;

	const has = (nameIndex) => ruleArr.indexOf(nameIndex) > -1;
	const add = (rule, customIndex = 0) => {
		ruleArr.push(rule);

		if (sheet) {
			try {
				if (!target) {
					target = getStyleId();
				}
				target.insertBefore(document.createTextNode(rule), !!customIndex ? customIndex : target.childNodes[target.childNodes.length - 1]);
			} catch (e) {
				console.info(`The "${rule}" class cannot be added: Syntax error`, e);
			}
		}
	};

	const decomposeToClassNames = setupDecompose(has, add);

	const hydrateScopedSubtree = (cssRule: CSSRule): void => {
		if (cssRule.type === 1 /* CSSRule.STYLE_RULE */) {
			const { selectorText } = cssRule as CSSStyleRule;
			console.log({ selectorText });

			// Remove leading `.` from class selector
			// ruleSet.add(selectorText.slice(1, index < 0 ? maxClassName : index));
		} else {
			hydrateScopedSubtree((cssRule as CSSGroupingRule).cssRules[0]);
		}
	};

	return {
		globalStyles(stylesRules: Partial<GlobalRules>): void {
			Object.keys(stylesRules).forEach((property: string) => {
				if (!globalSet[property]) {
					globalSet[property] = [];
				}
				const styleKeys = Object.keys(stylesRules[property]!);
				styleKeys.forEach((skey, key) => {
					const gRule = getGlobalRule(skey, stylesRules[property]![skey]);
					add(gRule, key);
					globalSet[property]!.push(gRule);
				});
			});
		},

		fonts(srcs: FontSrc[]): void {
			srcs.forEach((f: FontSrc) => {
				fontArr.push(`@font-face{font-family:${f.family};font-style:${f.style};font-weight:${f.weight};src:${f.path}}`);
			});
		},

		/**
		 * Marks server-rendered CSS identity names as available
		 * to avoid re-injecting them to the style sheet during runtime.
		 */
		getStyleString(): string {
			let styleString = "";

			Object.keys(globalSet).forEach((key: string) => (styleString += `${key}{${globalSet[key]!.join(";")}}`));
			ruleArr.forEach((rule) => (styleString += rule));
			fontArr.forEach((font) => (styleString += font));

			return styleString;
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
		css(stylesRules: CSSRules | CSSRules[], { before, after }: ExtraClassNames = { before: "", after: "" }): string {
			const rules: CSSRules = (stylesRules as any).length ? objectsMerge(stylesRules as CSSRules[]) : (stylesRules as CSSRules);

			let classNames: string[] = [];
			if (before) {
				classNames.push(before);
			}

			// The leading white space character gets removed
			classNames.push(decomposeToClassNames({ rules, textHead: "", textTail: "" }).slice(1));

			if (after) {
				classNames.push(after);
			}
			return classNames.join(" ");
		},

		keyframes(rules: KeyframeRules): { /** @private */ toString(): string } {
			let identName: string | undefined;

			return {
				toString(): string {
					if (!identName) {
						const cssText = extractKeyFrames(rules);

						identName = hash(cssText);
						if (!has(identName)) {
							add(`@keyframes ${identName}{${cssText}}`);
						}
					}

					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					return identName!;
				},
			};
		},
	};
};
