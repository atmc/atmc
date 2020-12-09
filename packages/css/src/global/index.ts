import { serialize, ValueArray, normalizePropertyKey } from "../rules";

export const getGlobalRule = (key: string, rule: ValueArray): string => {
	const property = normalizePropertyKey(key);
	return serialize(property, rule);
};

export * from "./types";
