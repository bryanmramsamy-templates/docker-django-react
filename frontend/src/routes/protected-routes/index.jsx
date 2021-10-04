import React from 'react';
import { Route, Switch } from "react-router-dom";


/**
 * Defines all the protected routes which requires the user to be authenticated.
 * @return All the protected routes.
 */
const ProtectedRoutes = () => {
  return (
    <Switch>
      <Route path="/protected">
        <h1>Protected page</h1>  {/* TODO: Put the protected pages here */}
      </Route>
    </Switch>
  );
}


export default ProtectedRoutes;
