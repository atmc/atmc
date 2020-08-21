import { setup } from "./";

const getStyle = (rule) => `${rule.style["0"]}:${rule.style[rule.style["0"]]}`;
const getPropertyKey = (rule) => `${rule.selectorText}{${getStyle(rule)}}`;
const getSheetAttr = (rules: any) =>
	rules.map((rule: any) => {
		if (rule.media) {
			return `@media${rule.media[0]}{${getPropertyKey(rule.cssRules[0])}}`;
		}

		if (!rule.style) {
			return `@keyframes ${rule.name}{${rule.cssRules.map((keyframe) => `${keyframe.keyText}{${getStyle(keyframe)}}`).join("")}}`;
		}

		// for property=>value
		return getPropertyKey(rule);
	});

/* Integration Tests - CSSStyleSheet
 * This tests follow the process like an user case
 * Each step (like each component), we add more styles
 * If the property:value already exists, just return the className,
 * but if not exist, the property:value should be added in rules array
 */
describe("Integration Tests - CSSStyleSheet", () => {
	var style = document.createElement("style");
	document.head.appendChild(style);
	var sheet = style.sheet as CSSStyleSheet;
	const instance = setup({ sheet });
	const css = instance.css;
	const keyframes = instance.keyframes;

	test("First class added", () => {
		css({ margin: "10px 0" });
		expect(getSheetAttr(sheet.cssRules)).toEqual(["._45bbqm{margin:10px 0}"]);
	});

	test("Second class added", () => {
		css({ backgroundColor: "#fff" });
		expect(getSheetAttr(sheet.cssRules)).toEqual(["._45bbqm{margin:10px 0}", ".dfjll8{background-color:#fff}"]);
	});

	test("Add class with selectors", () => {
		css({ selectors: { "& strong": { color: "#333" } } });
		expect(getSheetAttr(sheet.cssRules)).toEqual(["._45bbqm{margin:10px 0}", ".dfjll8{background-color:#fff}", ".yvlnnb strong{color:#333}"]);
	});

	test("Add 2ª class that not replace 1º class", () => {
		const className = css([{ selectors: { "& strong": { color: "#333" } } }, { backgroundColor: "red" }]);
		expect(className).toBe("yvlnnb _1n3rzf3");
		expect(getSheetAttr(sheet.cssRules)).toEqual(["._45bbqm{margin:10px 0}", ".dfjll8{background-color:#fff}", ".yvlnnb strong{color:#333}", "._1n3rzf3{background-color:red}"]);
	});

	test("Add 2ª class that replace 1º class", () => {
		const className = css([{ color: "blue" }, { color: "darkblue" }]);
		expect(className).toBe("_1laqh5k");
		expect(getSheetAttr(sheet.cssRules)).toEqual([
			"._45bbqm{margin:10px 0}",
			".dfjll8{background-color:#fff}",
			".yvlnnb strong{color:#333}",
			"._1n3rzf3{background-color:red}",
			"._1laqh5k{color:darkblue}",
		]);
	});

	test("Add 2ª selector that replace 1º selector", () => {
		const className = css([{ selectors: { "& svg path": { fill: "green" } } }, { selectors: { "& svg path": { fill: "darkgreen" } } }]);
		expect(className).toBe("_1fbaxbr");
		expect(getSheetAttr(sheet.cssRules)).toEqual([
			"._45bbqm{margin:10px 0}",
			".dfjll8{background-color:#fff}",
			".yvlnnb strong{color:#333}",
			"._1n3rzf3{background-color:red}",
			"._1laqh5k{color:darkblue}",
			"._1fbaxbr svg path{fill:darkgreen}",
		]);
	});

	test("Add class added before this test", () => {
		const className = css({ backgroundColor: "#fff" });
		expect(className).toBe("dfjll8");
		expect(getSheetAttr(sheet.cssRules)).toEqual([
			"._45bbqm{margin:10px 0}",
			".dfjll8{background-color:#fff}",
			".yvlnnb strong{color:#333}",
			"._1n3rzf3{background-color:red}",
			"._1laqh5k{color:darkblue}",
			"._1fbaxbr svg path{fill:darkgreen}",
		]);
	});

	test("Add class that need add browser prefix", () => {
		const className = css({ userSelect: "none" });
		expect(className).toBe("geqzxf");
		expect(getSheetAttr(sheet.cssRules)).toEqual([
			"._45bbqm{margin:10px 0}",
			".dfjll8{background-color:#fff}",
			".yvlnnb strong{color:#333}",
			"._1n3rzf3{background-color:red}",
			"._1laqh5k{color:darkblue}",
			"._1fbaxbr svg path{fill:darkgreen}",
			".geqzxf{user-select:none}",
		]);
	});

	test("Add :hover pseudos without selectors", () => {
		const className = css({
			color: "blue",
			":hover": {
				color: "green",
			},
		});
		expect(className).toBe("_117wnve _8tllku");
		expect(getSheetAttr(sheet.cssRules)).toEqual([
			"._45bbqm{margin:10px 0}",
			".dfjll8{background-color:#fff}",
			".yvlnnb strong{color:#333}",
			"._1n3rzf3{background-color:red}",
			"._1laqh5k{color:darkblue}",
			"._1fbaxbr svg path{fill:darkgreen}",
			".geqzxf{user-select:none}",
			"._117wnve{color:blue}",
			"._8tllku:hover{color:green}",
		]);
	});

	test("Add 'spin' keyframes", () => {
		const spin = keyframes({
			from: { transform: "rotate(0deg)" },
			to: { transform: "rotate(360deg)" },
		});
		expect(`${spin}`).toBe("_13owpa8");
		expect(spin.toString()).toBe("_13owpa8");

		// Add spin on css class to complete animation
		const className = css({
			height: "40vmin",
			pointerEvents: "none",
			animation: `${spin} infinite 20s linear`,
			"@media": {
				"(prefers-reduced-motion: reduce)": {
					animation: "none",
				},
			},
		});
		// This classNames should be differently from 'spin' className
		// because the 'spin' className is part another className
		expect(className).toBe("y4ga4x je8g23 _9qipgn _1deo81b");
		expect(getSheetAttr(sheet.cssRules)).toEqual([
			"._45bbqm{margin:10px 0}",
			".dfjll8{background-color:#fff}",
			".yvlnnb strong{color:#333}",
			"._1n3rzf3{background-color:red}",
			"._1laqh5k{color:darkblue}",
			"._1fbaxbr svg path{fill:darkgreen}",
			".geqzxf{user-select:none}",
			"._117wnve{color:blue}",
			"._8tllku:hover{color:green}",
			"@keyframes _13owpa8{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
			".y4ga4x{height:40vmin}",
			".je8g23{pointer-events:none}",
			"._9qipgn{animation:_13owpa8 infinite 20s linear}",
			"@media(prefers-reduced-motion:reduce){._1deo81b{animation:none}}",
		]);
	});

	test("Add 'multi step' keyframes", () => {
		const fontbulger = keyframes({
			"0%": { fontSize: 10 },
			"30%": { fontSize: 15 },
			"_100%": { fontSize: 12 },
		});
		expect(`${fontbulger}`).toBe("_1ufu960");
		expect(fontbulger.toString()).toBe("_1ufu960");

		// Add spin on css class to complete animation
		const className = css({
			animation: `${fontbulger} 2s infinite`,
			"@media": {
				"(prefers-reduced-motion: reduce)": {
					animation: "none",
					fontSize: 14,
				},
			},
		});
		expect(className).toBe("_1ea3b7j _1deo81b _1ys1pbl");
		expect(getSheetAttr(sheet.cssRules)).toEqual([
			"._45bbqm{margin:10px 0}",
			".dfjll8{background-color:#fff}",
			".yvlnnb strong{color:#333}",
			"._1n3rzf3{background-color:red}",
			"._1laqh5k{color:darkblue}",
			"._1fbaxbr svg path{fill:darkgreen}",
			".geqzxf{user-select:none}",
			"._117wnve{color:blue}",
			"._8tllku:hover{color:green}",
			"@keyframes _13owpa8{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
			".y4ga4x{height:40vmin}",
			".je8g23{pointer-events:none}",
			"._9qipgn{animation:_13owpa8 infinite 20s linear}",
			"@media(prefers-reduced-motion:reduce){._1deo81b{animation:none}}",
			"@keyframes _1ufu960{0%{fontSize:10px}30%{fontSize:15px}_100%{fontSize:12px}}",
			"._1ea3b7j{animation:_1ufu960 2s infinite}",
			"@media(prefers-reduced-motion:reduce){._1ys1pbl{font-size:14px}}",
		]);
	});

	test("Prevent add empty value", () => {
		expect(css({ "": "" } as any)).toBe("");
		expect(getSheetAttr(sheet.cssRules)).toEqual([
			"._45bbqm{margin:10px 0}",
			".dfjll8{background-color:#fff}",
			".yvlnnb strong{color:#333}",
			"._1n3rzf3{background-color:red}",
			"._1laqh5k{color:darkblue}",
			"._1fbaxbr svg path{fill:darkgreen}",
			".geqzxf{user-select:none}",
			"._117wnve{color:blue}",
			"._8tllku:hover{color:green}",
			"@keyframes _13owpa8{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
			".y4ga4x{height:40vmin}",
			".je8g23{pointer-events:none}",
			"._9qipgn{animation:_13owpa8 infinite 20s linear}",
			"@media(prefers-reduced-motion:reduce){._1deo81b{animation:none}}",
			"@keyframes _1ufu960{0%{fontSize:10px}30%{fontSize:15px}_100%{fontSize:12px}}",
			"._1ea3b7j{animation:_1ufu960 2s infinite}",
			"@media(prefers-reduced-motion:reduce){._1ys1pbl{font-size:14px}}",
		]);
	});

	test("should return a fallback values when auto-prefixing isn't enough", () => {
		expect(css({ display: "flex", justifyContent: ["space-around", "space-evenly"] })).toBe("zjik7 kg9kzo");
		expect(getSheetAttr(sheet.cssRules)).toEqual([
			"._45bbqm{margin:10px 0}",
			".dfjll8{background-color:#fff}",
			".yvlnnb strong{color:#333}",
			"._1n3rzf3{background-color:red}",
			"._1laqh5k{color:darkblue}",
			"._1fbaxbr svg path{fill:darkgreen}",
			".geqzxf{user-select:none}",
			"._117wnve{color:blue}",
			"._8tllku:hover{color:green}",
			"@keyframes _13owpa8{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
			".y4ga4x{height:40vmin}",
			".je8g23{pointer-events:none}",
			"._9qipgn{animation:_13owpa8 infinite 20s linear}",
			"@media(prefers-reduced-motion:reduce){._1deo81b{animation:none}}",
			"@keyframes _1ufu960{0%{fontSize:10px}30%{fontSize:15px}_100%{fontSize:12px}}",
			"._1ea3b7j{animation:_1ufu960 2s infinite}",
			"@media(prefers-reduced-motion:reduce){._1ys1pbl{font-size:14px}}",
			".zjik7{display:flex}",
			".kg9kzo{justify-content:space-evenly}",
		]);
	});

	test("should return classes for advanced selectors", () => {
		expect(
			css({
				display: "flex",
				selectors: {
					"& > * + *": { marginLeft: 16 },
					"&:focus, &:active": { outline: "solid" },
					"& + &": { color: "green" },
				},
			}),
		).toBe("zjik7 _102kj1d skdl2v dzcwyi gcdok5");
		expect(getSheetAttr(sheet.cssRules)).toEqual([
			"._45bbqm{margin:10px 0}",
			".dfjll8{background-color:#fff}",
			".yvlnnb strong{color:#333}",
			"._1n3rzf3{background-color:red}",
			"._1laqh5k{color:darkblue}",
			"._1fbaxbr svg path{fill:darkgreen}",
			".geqzxf{user-select:none}",
			"._117wnve{color:blue}",
			"._8tllku:hover{color:green}",
			"@keyframes _13owpa8{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
			".y4ga4x{height:40vmin}",
			".je8g23{pointer-events:none}",
			"._9qipgn{animation:_13owpa8 infinite 20s linear}",
			"@media(prefers-reduced-motion:reduce){._1deo81b{animation:none}}",
			"@keyframes _1ufu960{0%{fontSize:10px}30%{fontSize:15px}_100%{fontSize:12px}}",
			"._1ea3b7j{animation:_1ufu960 2s infinite}",
			"@media(prefers-reduced-motion:reduce){._1ys1pbl{font-size:14px}}",
			".zjik7{display:flex}",
			".kg9kzo{justify-content:space-evenly}",
			"._102kj1d > * + *{margin-left:16px}",
			".skdl2v:focus{outline:solid}",
			".dzcwyi:active{outline:solid}",
			".gcdok5 + &{color:green}",
		]);
	});

	test("should return classes for global/inline properties", () => {
		expect(
			css({
				"--theme-color": "black",
				color: "var(--theme-color)",
			} as any),
		).toBe("_9ujgx8 jy6a2s");
		expect(getSheetAttr(sheet.cssRules)).toEqual([
			"._45bbqm{margin:10px 0}",
			".dfjll8{background-color:#fff}",
			".yvlnnb strong{color:#333}",
			"._1n3rzf3{background-color:red}",
			"._1laqh5k{color:darkblue}",
			"._1fbaxbr svg path{fill:darkgreen}",
			".geqzxf{user-select:none}",
			"._117wnve{color:blue}",
			"._8tllku:hover{color:green}",
			"@keyframes _13owpa8{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
			".y4ga4x{height:40vmin}",
			".je8g23{pointer-events:none}",
			"._9qipgn{animation:_13owpa8 infinite 20s linear}",
			"@media(prefers-reduced-motion:reduce){._1deo81b{animation:none}}",
			"@keyframes _1ufu960{0%{fontSize:10px}30%{fontSize:15px}_100%{fontSize:12px}}",
			"._1ea3b7j{animation:_1ufu960 2s infinite}",
			"@media(prefers-reduced-motion:reduce){._1ys1pbl{font-size:14px}}",
			".zjik7{display:flex}",
			".kg9kzo{justify-content:space-evenly}",
			"._102kj1d > * + *{margin-left:16px}",
			".skdl2v:focus{outline:solid}",
			".dzcwyi:active{outline:solid}",
			".gcdok5 + &{color:green}",
			"._9ujgx8{--theme-color:black}",
			".jy6a2s{color:var(--theme-color)}",
		]);
	});

	test("should return classes for non-standard pseudo-element", () => {
		expect(
			css({
				selectors: {
					"::-ms-expand": { backgroundColor: "transparent" },
				},
			}),
		).toBe("iis6lg");
		expect(getSheetAttr(sheet.cssRules)).toEqual([
			"._45bbqm{margin:10px 0}",
			".dfjll8{background-color:#fff}",
			".yvlnnb strong{color:#333}",
			"._1n3rzf3{background-color:red}",
			"._1laqh5k{color:darkblue}",
			"._1fbaxbr svg path{fill:darkgreen}",
			".geqzxf{user-select:none}",
			"._117wnve{color:blue}",
			"._8tllku:hover{color:green}",
			"@keyframes _13owpa8{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
			".y4ga4x{height:40vmin}",
			".je8g23{pointer-events:none}",
			"._9qipgn{animation:_13owpa8 infinite 20s linear}",
			"@media(prefers-reduced-motion:reduce){._1deo81b{animation:none}}",
			"@keyframes _1ufu960{0%{fontSize:10px}30%{fontSize:15px}_100%{fontSize:12px}}",
			"._1ea3b7j{animation:_1ufu960 2s infinite}",
			"@media(prefers-reduced-motion:reduce){._1ys1pbl{font-size:14px}}",
			".zjik7{display:flex}",
			".kg9kzo{justify-content:space-evenly}",
			"._102kj1d > * + *{margin-left:16px}",
			".skdl2v:focus{outline:solid}",
			".dzcwyi:active{outline:solid}",
			".gcdok5 + &{color:green}",
			"._9ujgx8{--theme-color:black}",
			".jy6a2s{color:var(--theme-color)}",
			".iis6lg::-ms-expand{background-color:transparent}",
		]);
	});

	// export const hydrate = defaultInstance.hydrate;
});
