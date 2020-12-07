export const normalizePropertyKey = (key: string) => key.replace(/[A-Z]/g, (match: string): string => `-${match.toLowerCase()}`);
