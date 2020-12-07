import { serialize, ValueArray, normalizePropertyKey } from "@atmc/rules";

export const getGlobalRule = (key: string, rule: ValueArray): string => {
	const property = normalizePropertyKey(key);
	return serialize(property, rule);
};

export * from "./types";
