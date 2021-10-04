import React from 'react';
import { Route, Switch } from "react-router-dom";


/**
 * Defines all the unprotected routes which allows unauthenticated users.
 * @return All the unprotected routes.
 */
const UnprotectedRoutes = () => {
  return (
    <Switch>
      <Route path="/home">
        <h1>Home page</h1>  {/* TODO: Put the unprotected home page here */}
      </Route>
    </Switch>
  );
}


export default UnprotectedRoutes;
