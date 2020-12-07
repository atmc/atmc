import React, { FC } from "react";
import { getStyleString } from "@atmc/css";

const getStyle: FC = () => {
	return <style id="_cssatom" dangerouslySetInnerHTML={{ __html: getStyleString() }} />;
};

export default getStyle;
