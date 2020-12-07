export { serialize } from "./declarations";
export type { ValueArray } from "./declarations";

export { setup as setupDecompose } from "./decompose";
export { extract as extractKeyFrames } from "./keyframes";
export { minifyCondition, minifyValue } from "./minify";
export { prefix } from "./prefix";
export { normalizePropertyKey } from "./properties";
export { acceptsUnitless, propertiesAcceptingUnitless } from "./propertyMatchers";

export * from "./types";
