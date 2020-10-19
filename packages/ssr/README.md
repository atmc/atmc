# @atmc/ssr

## Next.js SSR Implementation

1. Install the package: `yarn add @atmc/ssr` or `npm install @atmc/ssr`

2. Configure the pages/_document.js

```
import { getStyleElement } from "@atmc/ssr";

export default class CustomDocument extends Document {
  static async getInitialProps({ renderPage }) {
    const page = await renderPage();
    return {
      ...page,
      styles: getStyleElement(),
    };
  }
}
```

3. Create styles with @atmc/ssr instead @atmc/css.

4. Done!
