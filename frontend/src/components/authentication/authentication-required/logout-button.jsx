import React from 'react';
import { useMutation } from "@apollo/client";

import {
  REVOKE_TOKEN_MUTATION
} from '../../../api/authentication/auth-token-mutations';

import { logout } from '../../../utils/authentication';


// NOTE: This is an example component !

/*
 * flagUserAsAuthenticated, setAuthenticationLoading and tokensClear are
 * required props.
 * revokeTokenMutation is a required mutation.
 * logout is a required callback.
 */

/**
 * Logout button
 * @return Logout button
 */
const LogoutButton = () => {
  const [revokeTokenMutation] = useMutation(REVOKE_TOKEN_MUTATION);

  const handleOnLogout = () => {
    logout(revokeTokenMutation);
  }

  // TODO: Create custom logout component
  return (
    <button onClick={ handleOnLogout }>LOGOUT</button>
  );
}


export default LogoutButton;
