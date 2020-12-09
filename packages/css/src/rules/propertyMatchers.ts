/*
	The order of rules is influenced by CSS usage metrics:

	- https://www.cssstats.com/stats/?url=css-tricks.com
	- https://www.cssstats.com/stats/?url=joshwcomeau.com
	- https://www.cssstats.com/stats/?url=mastery.games
	- https://www.cssstats.com/stats/?url=nytimes.com
	- https://www.chromestatus.com/metrics/css/popularity
*/

// Includes support for CSS custom properties
export const acceptsUnitless = /^(-|f[lo].*[^se]$|g.{6,}[^ps]$|z|o[pr]|li.*(t|mp)$|an|(bo|s).{5}im|sca|m.{7}[ds]|ta|c.*[st]$|wido|ini)/;

// TODO: Add tests to match everything below, without false positives
export const propertiesAcceptingUnitless = [
	/* ^f[lo].*[^se]$ */
	"flex",
	"flex-grow",
	"flex-shrink",
	"font-size-adjust",
	"font-weight",

	/* ^g.{6,}[^ps]$ */
	"grid-area",
	"grid-column",
	"grid-column-end",
	"grid-column-start",
	"grid-row",
	"grid-row-end",
	"grid-row-start",

	/* ^z */
	"z-index",

	/* ^o[pr] */
	"opacity",
	"order",
	"orphans",

	/* ^(-w.{6})?li.*(t|mp)$ */
	"line-height",
	"line-clamp",
	"-webkit-line-clamp",

	/* ^an */
	"animation",
	"animation-iteration-count",

	/* ^(bo|s).{5}im */
	"border-image",
	"border-image-outset",
	"border-image-slice",
	"border-image-width",
	"shape-image-threshold",

	/* ^sca */
	"scale",

	/* ^m.{7}[ds] */
	"mask-border",
	"mask-border-outset",
	"mask-border-slice",
	"mask-border-width",
	"max-lines",

	/* ^ta */
	"tab-size",

	/* ^c.*[st]$ */
	"columns",
	"column-count",

	/* ^wido */
	"widows",

	/* ^ini */
	"initial-letter",
];
