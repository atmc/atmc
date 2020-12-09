import React, { FC, useEffect, useState } from "react";
import { getStyleString } from "../";

export const getReactStyle: FC = () => {
	const [_, setIsClient] = useState<boolean>(false);

	useEffect(() => {
		// Fix re-hydratation
		setIsClient(true);
	}, []);

	return <style id="_atmc" dangerouslySetInnerHTML={{ __html: getStyleString() }} />;
};
