import {
  LOCALSTORAGE_TOKEN_AUTH_KEY,
  LOCALSTORAGE_REFRESH_TOKEN_KEY,
} from '../../components/authentication/authentication-required';

/**
 * Revoke the current refreshToken, clears the localStorage from every stored
 * token and reload the page to get the login form back.
 * @param {Function} revokeTokenMutation Mutation which revokes a refreshToken.
 * Must be called in a useMutation hook in the component which calls this
 * function.
 */
export const logout = async(revokeTokenMutation) => {
  const refreshToken = localStorage.getItem(LOCALSTORAGE_REFRESH_TOKEN_KEY);
  if (refreshToken) await revokeTokenMutation({ variables: { refreshToken }});

  localStorage.clear();
  window.location.reload();
}
