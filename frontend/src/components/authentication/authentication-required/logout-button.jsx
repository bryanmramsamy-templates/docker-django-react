import { useMutation } from "@apollo/client";

import { LOCALSTORAGE_REFRESH_TOKEN_KEY } from "."

import {
  REVOKE_TOKEN_MUTATION
} from '../../../api/authentication/auth-token-mutations';


/**
 * Logout button component
 * @return Logout button component
 */
const LogoutButton = () => {
  // Authentication mutation
  const [revokeTokenMutation] = useMutation(REVOKE_TOKEN_MUTATION);

  /**
   * Revoke the current refreshToken, clears the localStorage from every stored
   * token and reload the page to get the login form back.
   */
  const logout = async() => {
    const refreshToken = localStorage.getItem(LOCALSTORAGE_REFRESH_TOKEN_KEY);
    if (refreshToken) {
        const revokeTokenResponse
          = await revokeTokenMutation({ variables: { refreshToken }});

        if (revokeTokenResponse.data.revokeToken.errors){
          // TODO: Error must be handled
          console.log(revokeTokenResponse.data.revokeToken.errors);
        }
    }
    localStorage.clear();
    window.location.reload();
  }

  // Handle function
  const handleOnLogout = () => logout();

  // TODO: Create custom logout component
  return (
    <button onClick={ handleOnLogout }>LOGOUT</button>
  );
}


export default LogoutButton;
