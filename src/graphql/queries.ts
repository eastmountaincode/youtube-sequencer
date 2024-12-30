import { gql } from '@apollo/client';

// #limit: Int! specifies how many patterns to fetch per request
// #offset: Int! specifies the offset from which to start fetching patterns.
//    so for example, if limit is 10 and offset is 20, it will fetch patterns 21-30
// #orderBy: String! specifies the order in which to fetch patterns.
//    possible values might be 'created_at', 'likes_count', 'name'
// #userId: notice it's optional. if we have it, we use it to determine if the pattern was liked by the user
export const GET_PATTERNS = gql`
  query GetPatterns($limit: Int!, $offset: Int!, $orderBy: String!, $userId: String) {
    patternResponse(limit: $limit, offset: $offset, orderBy: $orderBy, userId: $userId) {
      patterns {
        id
        name
        description
        s3_url
        creator_id
        creator_display_name
        created_at
        likes_count
        liked_by_user
      }
      totalCount
    }
  }
`;

export const GET_USER_PATTERNS = gql`
  query GetUserPatterns($userId: String!, $limit: Int!, $offset: Int!, $orderBy: String!) {
    userPatterns(userId: $userId, limit: $limit, offset: $offset, orderBy: $orderBy) {
      patterns {
        id
        name
        description
        s3_url
        creator_id
        creator_display_name
        created_at
        likes_count
        liked_by_user
      }
      totalCount
    }
  }
`;

export const GET_LIKED_PATTERNS = gql`
  query GetLikedPatterns($userId: String!, $limit: Int!, $offset: Int!, $orderBy: String!) {
    likedPatterns(userId: $userId, limit: $limit, offset: $offset, orderBy: $orderBy) {
      patterns {
        id
        name
        description
        s3_url
        creator_id
        creator_display_name
        created_at
        likes_count
        liked_by_user
      }
      totalCount
    }
  }
`;

