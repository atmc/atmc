import { serialize } from "./declarations";

test("return a size value with unit", () => {
	expect(serialize("height", 10)).toEqual("height:10px");
});

test("return a size value without unit (line height)", () => {
	expect(serialize("line-height", 1.5)).toEqual("line-height:1.5");
});
