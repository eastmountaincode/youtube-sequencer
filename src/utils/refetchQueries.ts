import { GET_PATTERNS, GET_USER_PATTERNS } from '../graphql/queries';

export const getRefetchQueries = (itemsPerPage: number, orderBy: string, userId: string | null) => [
  {
    query: GET_PATTERNS,
    variables: {
      limit: itemsPerPage,
      offset: 0,
      orderBy: orderBy,
      userId: userId || null
    }
  },
  {
    query: GET_USER_PATTERNS,
    variables: {
      userId: userId || '',
      limit: itemsPerPage,
      offset: 0,
      orderBy: orderBy
    }
  }
];
