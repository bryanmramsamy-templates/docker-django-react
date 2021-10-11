import { gql } from "@apollo/client";


/**
 * Mutation which generates an tokenAuth and a refreshToken if the user enters
 * the right credentials.
 */
export const TOKEN_AUTH_MUTATION = gql`
  mutation tokenAuthMutation($username: String!, $password: String!) {
    tokenAuth(username: $username, password: $password){
      token,
      refreshToken,
      success,
      errors,
    }
  }
`


/**
 * Mutation which checks if tokenAuth is valid.
 */
export const VERIFY_TOKEN_MUTATION = gql`
  mutation verifyTokenMutation($token: String!) {
    verifyToken(token: $token){
      payload,
      success,
      errors,
    }
  }
`


/**
 * Mutation which generates a new tokenAuth if the user's refreshToken is valid.
 */
export const REFRESH_TOKEN_MUTATION = gql`
  mutation refreshTokenMutation($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken){
      token,
      refreshToken,
      payload,
      success,
      errors,
    }
  }
`


/**
 * Mutation which revoke a refreshToken.
 * Must be used when a new refreshToken has been generated.
 */
export const REVOKE_TOKEN_MUTATION = gql`
  mutation revokeTokenMutation($refreshToken: String!){
    revokeToken(refreshToken: $refreshToken){
      revoked,
      success,
      errors,
    }
  }
`
