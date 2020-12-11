// tslint:disable: no-bitwise
/*
 * @ see more in
 * https://github.com/garycourt/murmurhash-js
 */

const hasher = (str: string): string => {
	const z = 0x5bd1e995;
	const y = 0xe995;
	const x = 16;
	const w = 0xffff;
	const v = 24;

	const c = (s: string, i: number) => s.charCodeAt(i) & 0xff;
	const g = (k: any) => (k & w) * z + (((k >>> x) * y) << x);
	const j = (h: any) => (h & w) * z + (((h >>> x) * y) << x);

	let h = 0;
	let k;
	let i = 0;
	let len = str.length;
	for (; len >= 4; ++i, len -= 4) {
		k = c(str, i) | (c(str, ++i) << 8) | (c(str, ++i) << x) | (c(str, ++i) << v);

		k = g(k);
		k ^= k >>> v;

		h = g(k) ^ j(h);
	}

	switch (len) {
		case 3:
			h ^= c(str, i + 2) << x;
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
