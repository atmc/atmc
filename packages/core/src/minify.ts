// Remove excess white space characters
export const minifyValue = (value: string): string =>
	value.trim().replace(/\s+/g, " ");

export const minifyCondition = (condition: string): string =>
	minifyValue(condition).replace(/([([]) | ([)\]])| ?(:) ?/g, "$1$2$3");
