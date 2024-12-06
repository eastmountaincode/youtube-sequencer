import { gql } from '@apollo/client';

export const GET_PRESIGNED_URL = gql`
  mutation GetPresignedUrl($filename: String!) {
    getPresignedUrl(filename: $filename) {
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
