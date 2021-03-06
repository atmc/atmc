export type FontSrc = {
	family: string;
	path: string;
	style?: string;
	weight?: string;
	display?: string;
	unicodeRange?: string;
};

type SetupFonts = {
	tagId?: string;
	sources?: string[];
};
export const setupFonts = ({ sources: src, tagId }: SetupFonts = { tagId: "__atmc-fonts", sources: [] }) => {
	let sources = src || [];

	const setFont = (
		{ family, path, display, style, weight, unicodeRange }: FontSrc = { style: "normal", weight: "normal", display: "swap", family: "", path: "", unicodeRange: undefined },
	) => {
		sources.push(
			`@font-face{font-family:${family};font-style:${style};font-weight:${weight};font-display: ${display}${
				unicodeRange ? `unicode-range:${unicodeRange}` : ""
			};src:local('${family}'), url('${path}') format('woff')}`,
		);
	};

	return { setFont };
};
