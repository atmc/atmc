// tslint:disable: no-bitwise
/*
 * @ see more in
 * https://github.com/garycourt/murmurhash-js
 */

const hasher = (str: string): string => {
	const c = (s: string, i: number) => s.charCodeAt(i) & 0xff;

	const g = (k: any) => (k & 0xffff) * 0x5bd1e995 + (((k >>> 16) * 0xe995) << 16);

	const j = (h: any) => (h & 0xffff) * 0x5bd1e995 + (((h >>> 16) * 0xe995) << 16);

	let h = 0;
	let k;
	let i = 0;
	let len = str.length;
	for (; len >= 4; ++i, len -= 4) {
		k = c(str, i) | (c(str, ++i) << 8) | (c(str, ++i) << 16) | (c(str, ++i) << 24);

		k = g(k);
		k ^= k >>> 24;

		h = g(k) ^ j(h);
	}

	switch (len) {
		case 3:
			h ^= c(str, i + 2) << 16;
		case 2:
			h ^= c(str, i + 1) << 8;
		case 1:
			h ^= c(str, i);
			h = j(h);
	}

	h ^= h >>> 13;
	h = j(h);

	return ((h ^ (h >>> 15)) >>> 0).toString(36);
};

export const hash = (str: string): string => {
	const h = hasher(str);
	// CSS class names can not start with numbers
	const prefix = /[0-9]/gi.test(h[0]) ? "_" : "";
	const commaPrevent = prefix.replace(",", "_");
	return `${commaPrevent}${h}`;
};

export default hash;
