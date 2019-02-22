import ApolloClient from 'apollo-boost';
import { gql } from 'graphql-tag';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
});

export default client;
