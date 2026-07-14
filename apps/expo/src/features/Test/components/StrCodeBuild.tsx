import React from "react";
import { View } from "react-native";

// import codeStrToReactElement from "../utils/codeStrToElement";
// import { codeStr } from "../constants/common";

const flexStyle = { flex: 1 };

const StrCodeBuild = () => {
  // const element = codeStrToReactElement(codeStr);
  const element = "No Element";
  return <View style={flexStyle}>{element}</View>;
};

export default StrCodeBuild;
