import { setup } from "./";

/* Integration Tests - Get Rules
 * This tests follow the process like an user case
 * Each step (like each component), we add more styles
 * If the property:value already exists, just return the className,
 * but if not exist, the property:value should be added in rules array
 */
describe("Integration Tests - Get Rules", () => {
	let rules = new Set<string>();
	const instance = setup({ rules });
	const css = instance.css;
	const keyframes = instance.keyframes;

	test("First class added", () => {
		css({ margin: "10px 0" });
		expect(rules).toEqual(new Set(["._45bbqm{margin:10px 0}"]));
	});

	test("Second class added", () => {
		css({ backgroundColor: "#fff" });
		expect(rules).toEqual(new Set(["._45bbqm{margin:10px 0}", ".dfjll8{background-color:#fff}"]));
	});

	test("Add class with selectors", () => {
		css({ selectors: { "& strong": { color: "#333" } } });
		expect(rules).toEqual(new Set(["._45bbqm{margin:10px 0}", ".dfjll8{background-color:#fff}", ".yvlnnb strong{color:#333}"]));
	});

	test("Add 2ª class that not replace 1º class", () => {
		const className = css([{ selectors: { "& strong": { color: "#333" } } }, { backgroundColor: "red" }]);
		expect(className).toBe("yvlnnb _1n3rzf3");
		expect(rules).toEqual(new Set(["._1n3rzf3{background-color:red}", "._45bbqm{margin:10px 0}", ".dfjll8{background-color:#fff}", ".yvlnnb strong{color:#333}"]));
	});

	test("Add 2ª class that replace 1º class", () => {
		const className = css([{ color: "blue" }, { color: "darkblue" }]);
		expect(className).toBe("_1laqh5k");
		expect(rules).toEqual(
			new Set(["._1laqh5k{color:darkblue}", "._1n3rzf3{background-color:red}", "._45bbqm{margin:10px 0}", ".dfjll8{background-color:#fff}", ".yvlnnb strong{color:#333}"]),
		);
	});

	test("Add 2ª selector that replace 1º selector", () => {
		const className = css([{ selectors: { "& svg path": { fill: "green" } } }, { selectors: { "& svg path": { fill: "darkgreen" } } }]);
		expect(className).toBe("_1fbaxbr");
		expect(rules).toEqual(
			new Set([
				"._1fbaxbr svg path{fill:darkgreen}",
				"._1laqh5k{color:darkblue}",
				"._1n3rzf3{background-color:red}",
				"._45bbqm{margin:10px 0}",
				".dfjll8{background-color:#fff}",
				".yvlnnb strong{color:#333}",
			]),
		);
	});

	test("Add class added before this test", () => {
		const className = css({ backgroundColor: "#fff" });
		expect(className).toBe("dfjll8");
		expect(rules).toEqual(
			new Set([
				"._1fbaxbr svg path{fill:darkgreen}",
				"._1laqh5k{color:darkblue}",
				"._1n3rzf3{background-color:red}",
				"._45bbqm{margin:10px 0}",
				".dfjll8{background-color:#fff}",
				".yvlnnb strong{color:#333}",
			]),
		);
	});

	test("Add class that need add browser prefix", () => {
		const className = css({ userSelect: "none" });
		expect(className).toBe("geqzxf");
		expect(rules).toEqual(
			new Set([
				"._1fbaxbr svg path{fill:darkgreen}",
				"._1laqh5k{color:darkblue}",
				"._1n3rzf3{background-color:red}",
				"._45bbqm{margin:10px 0}",
				".dfjll8{background-color:#fff}",
				".geqzxf{user-select:none;-ms-user-select:none;-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;-ms-user-select:none;-moz-user-select:none;-ms-user-select:none}",
				".yvlnnb strong{color:#333}",
			]),
		);
	});

	test("Add :hover pseudos without selectors", () => {
		const className = css({
			color: "blue",
			":hover": {
				color: "green",
			},
		});
		expect(className).toBe("_117wnve _8tllku");
		expect(rules).toEqual(
			new Set([
				"._117wnve{color:blue}",
				"._1fbaxbr svg path{fill:darkgreen}",
				"._1laqh5k{color:darkblue}",
				"._1n3rzf3{background-color:red}",
				"._45bbqm{margin:10px 0}",
				"._8tllku:hover{color:green}",
				".dfjll8{background-color:#fff}",
				".geqzxf{user-select:none;-ms-user-select:none;-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;-ms-user-select:none;-moz-user-select:none;-ms-user-select:none}",
				".yvlnnb strong{color:#333}",
			]),
		);
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
		expect(rules).toEqual(
			new Set([
				"._117wnve{color:blue}",
				"._45bbqm{margin:10px 0}",
				"._8tllku:hover{color:green}",
				".dfjll8{background-color:#fff}",
				".yvlnnb strong{color:#333}",
				"._1n3rzf3{background-color:red}",
				"._9qipgn{animation:_13owpa8 infinite 20s linear}",
				"._1laqh5k{color:darkblue}",
				"._1fbaxbr svg path{fill:darkgreen}",
				".geqzxf{user-select:none;-ms-user-select:none;-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;-ms-user-select:none;-moz-user-select:none;-ms-user-select:none}",
				"@keyframes _13owpa8{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
				".y4ga4x{height:40vmin}",
				".je8g23{pointer-events:none}",
				"@media(prefers-reduced-motion:reduce){._1deo81b{animation:none}}",
			]),
		);
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
		expect(rules).toEqual(
			new Set([
				"._117wnve{color:blue}",
				"._45bbqm{margin:10px 0}",
				"._8tllku:hover{color:green}",
				".dfjll8{background-color:#fff}",
				".yvlnnb strong{color:#333}",
				"._1n3rzf3{background-color:red}",
				"._1laqh5k{color:darkblue}",
				"._1fbaxbr svg path{fill:darkgreen}",
				".geqzxf{user-select:none;-ms-user-select:none;-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;-ms-user-select:none;-moz-user-select:none;-ms-user-select:none}",
				"@keyframes _13owpa8{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
				".y4ga4x{height:40vmin}",
				".je8g23{pointer-events:none}",
				"._9qipgn{animation:_13owpa8 infinite 20s linear}",
				"@media(prefers-reduced-motion:reduce){._1deo81b{animation:none}}",
				"@keyframes _1ufu960{0%{fontSize:10px}30%{fontSize:15px}_100%{fontSize:12px}}",
				"._1ea3b7j{animation:_1ufu960 2s infinite}",
				"@media(prefers-reduced-motion:reduce){._1ys1pbl{font-size:14px}}",
			]),
		);
	});

	test("Prevent add empty value", () => {
		expect(css({ "": "" } as any)).toBe("");
		expect(rules).toEqual(
			new Set([
				"._117wnve{color:blue}",
				"._45bbqm{margin:10px 0}",
				"._8tllku:hover{color:green}",
				".dfjll8{background-color:#fff}",
				".yvlnnb strong{color:#333}",
				"._1n3rzf3{background-color:red}",
				"._1laqh5k{color:darkblue}",
				"._1fbaxbr svg path{fill:darkgreen}",
				".geqzxf{user-select:none;-ms-user-select:none;-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;-ms-user-select:none;-moz-user-select:none;-ms-user-select:none}",
				"@keyframes _13owpa8{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
				".y4ga4x{height:40vmin}",
				".je8g23{pointer-events:none}",
				"._9qipgn{animation:_13owpa8 infinite 20s linear}",
				"@media(prefers-reduced-motion:reduce){._1deo81b{animation:none}}",
				"@keyframes _1ufu960{0%{fontSize:10px}30%{fontSize:15px}_100%{fontSize:12px}}",
				"._1ea3b7j{animation:_1ufu960 2s infinite}",
				"@media(prefers-reduced-motion:reduce){._1ys1pbl{font-size:14px}}",
			]),
		);
	});

	test("should return a fallback values when auto-prefixing isn't enough", () => {
		expect(css({ display: "flex", justifyContent: ["space-around", "space-evenly"] })).toBe("zjik7 kg9kzo");
		expect(rules).toEqual(
			new Set([
				"._117wnve{color:blue}",
				"._45bbqm{margin:10px 0}",
				"._8tllku:hover{color:green}",
				".dfjll8{background-color:#fff}",
				".yvlnnb strong{color:#333}",
				".zjik7{display:flex}",
				"._1n3rzf3{background-color:red}",
				"._1laqh5k{color:darkblue}",
				"._1fbaxbr svg path{fill:darkgreen}",
				".geqzxf{user-select:none;-ms-user-select:none;-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;-ms-user-select:none;-moz-user-select:none;-ms-user-select:none}",
				"@keyframes _13owpa8{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
				".y4ga4x{height:40vmin}",
				".je8g23{pointer-events:none}",
				".kg9kzo{justify-content:space-around;justify-content:space-evenly}",
				"._9qipgn{animation:_13owpa8 infinite 20s linear}",
				"@media(prefers-reduced-motion:reduce){._1deo81b{animation:none}}",
				"@keyframes _1ufu960{0%{fontSize:10px}30%{fontSize:15px}_100%{fontSize:12px}}",
				"._1ea3b7j{animation:_1ufu960 2s infinite}",
				"@media(prefers-reduced-motion:reduce){._1ys1pbl{font-size:14px}}",
			]),
		);
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
		expect(rules).toEqual(
			new Set([
				"._102kj1d > * + *{margin-left:16px}",
				"._117wnve{color:blue}",
				"._45bbqm{margin:10px 0}",
				"._8tllku:hover{color:green}",
				".dfjll8{background-color:#fff}",
				".dzcwyi:active{outline:solid}",
				".gcdok5 + &{color:green}",
				".yvlnnb strong{color:#333}",
				".zjik7{display:flex}",
				"._1n3rzf3{background-color:red}",
				"._1laqh5k{color:darkblue}",
				"._1fbaxbr svg path{fill:darkgreen}",
				".geqzxf{user-select:none;-ms-user-select:none;-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;-ms-user-select:none;-moz-user-select:none;-ms-user-select:none}",
				"@keyframes _13owpa8{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
				".y4ga4x{height:40vmin}",
				".je8g23{pointer-events:none}",
				".kg9kzo{justify-content:space-around;justify-content:space-evenly}",
				".skdl2v:focus{outline:solid}",
				"._9qipgn{animation:_13owpa8 infinite 20s linear}",
				"@media(prefers-reduced-motion:reduce){._1deo81b{animation:none}}",
				"@keyframes _1ufu960{0%{fontSize:10px}30%{fontSize:15px}_100%{fontSize:12px}}",
				"._1ea3b7j{animation:_1ufu960 2s infinite}",
				"@media(prefers-reduced-motion:reduce){._1ys1pbl{font-size:14px}}",
			]),
		);
	});

	test("should return classes for global/inline properties", () => {
		expect(
			css({
				"--theme-color": "black",
				color: "var(--theme-color)",
			} as any),
		).toBe("_9ujgx8 jy6a2s");
		expect(rules).toEqual(
			new Set([
				"._102kj1d > * + *{margin-left:16px}",
				"._117wnve{color:blue}",
				"._45bbqm{margin:10px 0}",
				"._8tllku:hover{color:green}",
				"._9ujgx8{--theme-color:black}",
				".dfjll8{background-color:#fff}",
				".dzcwyi:active{outline:solid}",
				".gcdok5 + &{color:green}",
				".yvlnnb strong{color:#333}",
				".zjik7{display:flex}",
				"._1n3rzf3{background-color:red}",
				"._1laqh5k{color:darkblue}",
				"._1fbaxbr svg path{fill:darkgreen}",
				".geqzxf{user-select:none;-ms-user-select:none;-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;-ms-user-select:none;-moz-user-select:none;-ms-user-select:none}",
				"@keyframes _13owpa8{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
				".y4ga4x{height:40vmin}",
				".je8g23{pointer-events:none}",
				".jy6a2s{color:var(--theme-color)}",
				".kg9kzo{justify-content:space-around;justify-content:space-evenly}",
				".skdl2v:focus{outline:solid}",
				"._9qipgn{animation:_13owpa8 infinite 20s linear}",
				"@media(prefers-reduced-motion:reduce){._1deo81b{animation:none}}",
				"@keyframes _1ufu960{0%{fontSize:10px}30%{fontSize:15px}_100%{fontSize:12px}}",
				"._1ea3b7j{animation:_1ufu960 2s infinite}",
				"@media(prefers-reduced-motion:reduce){._1ys1pbl{font-size:14px}}",
			]),
		);
	});

	test("should return classes for non-standard pseudo-element", () => {
		expect(
			css({
				selectors: {
					"::-ms-expand": { backgroundColor: "transparent" },
				},
			}),
		).toBe("iis6lg");
		expect(rules).toEqual(
			new Set([
				"._102kj1d > * + *{margin-left:16px}",
				"._117wnve{color:blue}",
				"._45bbqm{margin:10px 0}",
				"._8tllku:hover{color:green}",
				"._9ujgx8{--theme-color:black}",
				".dfjll8{background-color:#fff}",
				".dzcwyi:active{outline:solid}",
				".gcdok5 + &{color:green}",
				".yvlnnb strong{color:#333}",
				".zjik7{display:flex}",
				"._1n3rzf3{background-color:red}",
				"._1laqh5k{color:darkblue}",
				"._1fbaxbr svg path{fill:darkgreen}",
				".geqzxf{user-select:none;-ms-user-select:none;-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;-ms-user-select:none;-moz-user-select:none;-ms-user-select:none}",
				".iis6lg::-ms-expand{background-color:transparent}",
				"@keyframes _13owpa8{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}",
				".y4ga4x{height:40vmin}",
				".je8g23{pointer-events:none}",
				".jy6a2s{color:var(--theme-color)}",
				".kg9kzo{justify-content:space-around;justify-content:space-evenly}",
				".skdl2v:focus{outline:solid}",
				"._9qipgn{animation:_13owpa8 infinite 20s linear}",
				"@media(prefers-reduced-motion:reduce){._1deo81b{animation:none}}",
				"@keyframes _1ufu960{0%{fontSize:10px}30%{fontSize:15px}_100%{fontSize:12px}}",
				"._1ea3b7j{animation:_1ufu960 2s infinite}",
				"@media(prefers-reduced-motion:reduce){._1ys1pbl{font-size:14px}}",
			]),
		);
	});

	// export const hydrate = defaultInstance.hydrate;
});
