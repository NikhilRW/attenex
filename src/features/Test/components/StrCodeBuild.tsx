import { View } from "react-native";

import React from "react";
import codeStrToReactElement from "../utils/codeStrToElement";
import { codeStr } from "../constants/common";

const StrCodeBuild = () => {
  const element = codeStrToReactElement(codeStr);
  return <View style={{flex:1}}>{ element }</View>;
};

export default StrCodeBuild;