import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

const httpLink = createHttpLink({
  uri:
    process.env.NODE_ENV === 'development'
      ? 'https://swim-puffer-backend.herokuapp.com/graphql'
      : ' https://swim-puffer-backend.herokuapp.com/graphql'
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const idToken = localStorage.getItem('idToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      id: idToken || 'test!'
    }
  };
});

const client = new ApolloClient({
  // link: httpLink,
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client;
