import Document, { DocumentContext, DocumentInitialProps } from "next/document";
import { getStyleElement } from "@atmc/ssr";

export default class MyDocument extends Document {
	static async getInitialProps({ renderPage }: DocumentContext): Promise<DocumentInitialProps> {
		const page = await renderPage();
		return {
			...page,
			styles: getStyleElement(),
		};
	}
}
