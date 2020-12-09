export type FontSrc = {
	family: string;
	path: string;
	style?: string;
	weight?: string;
};

type SetupFonts = {
	tagId?: string;
	sources?: string[];
};
export const setupFonts = ({ sources: src, tagId }: SetupFonts = { tagId: "__atmc-fonts", sources: [] }) => {
	let sources = src || [];

	const setFont = ({ family, path, style, weight }: FontSrc = { style: "normal", weight: "normal", family: "", path: "" }) => {
		sources.push(`@font-face{font-family:${family};font-style:${style};font-weight:${weight};src:local('${family}'), url('${path}') format('woff')}`);
	};

	return { setFont };
};
