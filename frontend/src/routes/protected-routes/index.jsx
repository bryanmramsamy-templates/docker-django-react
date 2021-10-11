import React from 'react';
import { Route, Switch, useRouteMatch } from "react-router-dom";


/**
 * Defines all the protected routes which requires the user to be authenticated.
 * @return All the protected routes.
 */
const ProtectedRoutes = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>

      <Route path={ path + "/1" }>
        <h1>Protected page</h1>  {/* TODO: Put the protected pages here */}
      </Route>

      <Route path={ path + "/2" }>
        <h1>Protected page 2</h1>  {/* TODO: Put the protected pages here */}
      </Route>

    </Switch>
  );
}


export default ProtectedRoutes;
