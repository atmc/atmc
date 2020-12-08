import React, { FC, useEffect, useState } from "react";
import { getStyleString } from "@atmc/css";

const getStyle: FC = () => {
	const [_, setIsClient] = useState<boolean>(false);

	useEffect(() => {
		// Fix re-hydratation
		setIsClient(true);
	}, []);

	return <style id="_cssatom" dangerouslySetInnerHTML={{ __html: getStyleString() }} />;
};

export default getStyle;
