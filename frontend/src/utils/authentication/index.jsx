import {
  LOCALSTORAGE_TOKEN_AUTH_KEY,
  LOCALSTORAGE_REFRESH_TOKEN_KEY,
} from '../../components/authentication/authentication-required';


/**
 * Generates a new tokenAuth and a refreshToken to store in localStorage if
 * valid credentials are submitted. Otherwise sign the user out and clear
 * localStorage from all tokens.
 * @param {string} username Submitted username
 * @param {string} password Submitted password
 * @param {Function} flagUserAsAuthenticated Flags the user as authenticated
 * @param {Function} setAuthenticationLoading Change the Authentication loading
 * @param {Function} tokenAuthMutation Mutation which generates a new tokenAuth
 * and a refreshToken if valid credentials are given. Must be called in a
 * useMutation hook in the component which calls this function.
 * @param {Function} tokensClear Clear the localStorage and flags the user as
 * unauthenticated to log one out
 */
export const login = (
  username,
  password,

  flagUserAsAuthenticated,
  setAuthenticationLoading,
  tokenAuthMutation,
  tokensClear,
) => {

  setAuthenticationLoading(true);

  tokenAuthMutation({ variables: { username, password }})
    .then(response => {
      const { token, refreshToken, errors } = response.data.tokenAuth;
      if (!errors) {
        localStorage.setItem(LOCALSTORAGE_TOKEN_AUTH_KEY, token);
        localStorage.setItem(LOCALSTORAGE_REFRESH_TOKEN_KEY, refreshToken);

        flagUserAsAuthenticated();

      } else {
        console.log(errors);  // DEBUG: Must be removed
        window.alert(errors.nonFieldErrors.map(
          nonFieldError => nonFieldError.message
        ));

        tokensClear();

      }
    }).catch(e => {
      console.log(e);  // DEBUG: Must be removed
      window.alert("An error has occurred");

      tokensClear();

      throw e;
    })
}

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
