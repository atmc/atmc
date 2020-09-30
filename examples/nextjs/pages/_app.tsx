import { AppProps } from "next/app";
import * as React from "react";
import { getStyleElement } from "@atmc/ssr";

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
	if (typeof window !== "undefined") {
		getStyleElement();
	}
	return <Component {...pageProps} />;
}
