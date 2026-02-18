import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
// import { gql } from "@apollo/client";

// const GET_TESTS = gql`
//   query Tests0 {
//     tests {
//       name
//     }
//   }
// `;
export default function Index() {
  return (
    <View>
      <Text>index</Text>
    </View>
  );
}
