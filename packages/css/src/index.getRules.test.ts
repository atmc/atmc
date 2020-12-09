import { css, globalStyles, keyframes, getStyleString } from "./";

/* Integration Tests - Get Rules
 * This tests follow the process like an user case
 * Each step (like each component), we add more styles
 * If the property:value already exists, just return the className,
 * but if not exist, the property:value should be added in rules array
 * -- IGNORE DESCRIPTIONS, FOR NOW IS JUST FOR TEST CLASS AND USERCASES
 */
describe("Integration Tests - Get Rules", () => {
	let rules = new Set<string>();
	let previusStyle = "";
	test("First class added", () => {
		css({ margin: "10px 0" });
		previusStyle = "._45bbqm{margin:10px 0}";
		expect(getStyleString()).toEqual(previusStyle);
	});

	test("Global Rules Part 1", () => {
		globalStyles({
			":root": {
				backgroundColor: "#fff",
				color: "red",
			},
		});
		expect(getStyleString()).toEqual(`:root{background-color:#fff;color:red}${previusStyle}`);
		previusStyle = getStyleString();
	});

	test("Second class added", () => {
		css({ backgroundColor: "#fff" });
		expect(getStyleString()).toEqual(`${previusStyle}.dfjll8{background-color:#fff}`);
		previusStyle = getStyleString();
	});

	test("Add class with selectors", () => {
		css({ selectors: { "& strong": { color: "#333" } } });
		expect(getStyleString()).toEqual(`${previusStyle}.yvlnnb strong{color:#333}`);
		previusStyle = getStyleString();
	});

	test("Add 2ª class that not replace 1º class", () => {
		const className = css([{ selectors: { "& strong": { color: "#333" } } }, { backgroundColor: "red" }]);
		expect(className).toBe("yvlnnb _1n3rzf3");
		expect(getStyleString()).toEqual(`${previusStyle}._1n3rzf3{background-color:red}`);
		previusStyle = getStyleString();
	});

	test("Global Rules Part 2", () => {
		globalStyles({
			":root": {
				"--primary-color": "#00b3da",
			},
		});
		expect(getStyleString()).toEqual(
			`:root{background-color:#fff;color:red;--primary-color:#00b3da}._45bbqm{margin:10px 0}.dfjll8{background-color:#fff}.yvlnnb strong{color:#333}._1n3rzf3{background-color:red}`,
		);
		previusStyle = getStyleString();
	});

	test("Add 2ª class that replace 1º class", () => {
		const className = css([{ color: "blue" }, { color: "darkblue" }]);
		expect(className).toBe("_1laqh5k");
		expect(getStyleString()).toEqual(`${previusStyle}._1laqh5k{color:darkblue}`);
		previusStyle = getStyleString();
	});

	test("Add 2ª selector that replace 1º selector", () => {
		const className = css([{ selectors: { "& svg path": { fill: "green" } } }, { selectors: { "& svg path": { fill: "darkgreen" } } }]);
		expect(className).toBe("_1fbaxbr");
		expect(getStyleString()).toEqual(`${previusStyle}._1fbaxbr svg path{fill:darkgreen}`);
		previusStyle = getStyleString();
	});

	test("Add class added before this test", () => {
		const className = css({ backgroundColor: "#fff" });
		expect(className).toBe("dfjll8");
		expect(getStyleString()).toEqual(previusStyle);
		previusStyle = getStyleString();
	});

	test("Add class that need add browser prefix", () => {
		const className = css({ userSelect: "none" });
		expect(className).toBe("geqzxf");
		expect(getStyleString()).toEqual(
			`${previusStyle}.geqzxf{user-select:none;-ms-user-select:none;-moz-user-select:none;-ms-user-select:none;-webkit-user-select:none;-ms-user-select:none;-moz-user-select:none;-ms-user-select:none}`,
		);
		previusStyle = getStyleString();
	});

	test("Add :hover pseudos without selectors", () => {
		const className = css({ color: "blue", ":hover": { color: "green" } });
		expect(className).toBe("_117wnve _8tllku");
		expect(getStyleString()).toEqual(`${previusStyle}._117wnve{color:blue}._8tllku:hover{color:green}`);
		previusStyle = getStyleString();
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
		expect(getStyleString()).toEqual(
			`${previusStyle}@keyframes _13owpa8{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}.y4ga4x{height:40vmin}.je8g23{pointer-events:none}._9qipgn{animation:_13owpa8 infinite 20s linear}@media(prefers-reduced-motion:reduce){._1deo81b{animation:none}}`,
		);
		previusStyle = getStyleString();
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
			"@media": { "(prefers-reduced-motion: reduce)": { animation: "none", fontSize: 14 } },
		});
		expect(className).toBe("_1ea3b7j _1deo81b _1ys1pbl");
		expect(getStyleString()).toEqual(
			`${previusStyle}@keyframes _1ufu960{0%{fontSize:10px}30%{fontSize:15px}_100%{fontSize:12px}}._1ea3b7j{animation:_1ufu960 2s infinite}@media(prefers-reduced-motion:reduce){._1ys1pbl{font-size:14px}}`,
		);
		previusStyle = getStyleString();
	});

	test("Prevent add empty value", () => {
		expect(css({ "": "" } as any)).toBe("");
		expect(getStyleString()).toEqual(previusStyle);
		previusStyle = getStyleString();
	});

	test("add class", () => {
		expect(css({ background: "none" } as any)).toBe("bigtx2");
		expect(getStyleString()).toEqual(`${previusStyle}.bigtx2{background:none}`);
		previusStyle = getStyleString();
	});

	test("should return a fallback values when auto-prefixing isn't enough", () => {
		expect(css({ display: "flex", justifyContent: ["space-around", "space-evenly"] })).toBe("zjik7 kg9kzo");
		expect(getStyleString()).toEqual(`${previusStyle}.zjik7{display:flex}.kg9kzo{justify-content:space-around;justify-content:space-evenly}`);
		previusStyle = getStyleString();
	});

	test("should return classes for advanced selectors", () => {
		expect(css({ display: "flex", selectors: { "& > * + *": { marginLeft: 16 }, "&:focus, &:active": { outline: "solid" } } })).toBe("zjik7 _102kj1d skdl2v dzcwyi");
		expect(getStyleString()).toEqual(`${previusStyle}._102kj1d > * + *{margin-left:16px}.skdl2v:focus{outline:solid}.dzcwyi:active{outline:solid}`);
		previusStyle = getStyleString();
	});

	test("should return classes for global/inline properties", () => {
		expect(css({ "--theme-color": "black", color: "var(--theme-color)" } as any)).toBe("_9ujgx8 jy6a2s");
		expect(getStyleString()).toEqual(`${previusStyle}._9ujgx8{--theme-color:black}.jy6a2s{color:var(--theme-color)}`);
		previusStyle = getStyleString();
	});

	test("should return classes for non-standard pseudo-element", () => {
		expect(css({ selectors: { "::-ms-expand": { backgroundColor: "transparent" } } })).toBe("iis6lg");
		expect(getStyleString()).toEqual(`${previusStyle}.iis6lg::-ms-expand{background-color:transparent}`);
		previusStyle = getStyleString();
	});
});
