import { gql } from "@apollo/client";


/**
 * Current user information query
 */
// TODO: Adapt query to user fields if custom user model is used in backend
export const ME = gql`
  query MeQuery {
    me {
      id,
      pk,
      username,
      email,
      firstName,
      lastName,
      lastLogin,
      isActive,
      isStaff,
      dateJoined,
      verified,
      archived,
      secondaryEmail
    }
  }
`
