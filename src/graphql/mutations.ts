import { gql } from '@apollo/client';

export const GET_PRESIGNED_URL = gql`
  mutation GetPresignedUrl($filename: String!, $folder: String!) {
    getPresignedUrl(filename: $filename, folder: $folder) {
      url
      key
    }
  }
`;

export const CREATE_PATTERN = gql`
  mutation CreatePattern($input: CreatePatternInput!) {
    createPattern(input: $input) {
      id
      name
      description
      s3_url
      creator_id
      creator_display_name
      created_at
      likes_count
    }
  }
`;

export const GET_DOWNLOAD_URL = gql`
  mutation GetDownloadUrl($s3_url: String!) {
    getDownloadUrl(s3_url: $s3_url) {
      url
    }
  }
`;

export const LIKE_PATTERN = gql`
  mutation LikePattern($patternId: String!, $userId: String!) {
    likePattern(patternId: $patternId, userId: $userId) {
      id
      likes_count
    }
  }
`;

export const DELETE_PATTERN = gql`
  mutation DeletePattern($patternId: String!) {
    deletePattern(patternId: $patternId) {
      id
      success
    }
  }
`;
