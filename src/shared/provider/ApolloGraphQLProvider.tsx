import React, { ReactNode } from "react";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";

const client = new ApolloClient({
  link: new HttpLink({ uri: "http://localhost:5000/graphql" }),
  cache: new InMemoryCache(),
});
const ApolloGraphQLProvider = ({ children }: { children: ReactNode }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloGraphQLProvider;
