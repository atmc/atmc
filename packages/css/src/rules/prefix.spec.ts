import { prefix } from "./prefix";

test("return non-prefixed property", () => {
	expect(prefix("display", "block")).toEqual("display:block");
});
test("return prefixed property", () => {
	expect(prefix("aparence", "button")).toEqual("aparence:button;-moz-aparence:button;-webkit-aparence:button;-moz-aparence:button");
});
