const { Window } = require("happy-dom");
const window = new Window();
const _CSSStyleSheet = jest.fn();

window.CSSStyleSheet = _CSSStyleSheet;

Object.assign(global, {
	CSSStyleSheet: _CSSStyleSheet,
});
