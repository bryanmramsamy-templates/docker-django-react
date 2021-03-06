import { Route, Routes } from "react-router-dom";


/**
 * Defines all the unprotected routes which allows unauthenticated users.
 * @return All the unprotected routes.
 */
const UnprotectedRoutes = () => {

  return (
    <Routes>
      <Route
        path="1"
        // TODO: Put the unprotected home page here
        element={ <h1>Home page</h1> }
      />

      <Route
        path="2"
        // TODO: Put the unprotected home page here
        element={ <h1>Home page 2</h1> }
      />
    </Routes>
  );
}


export default UnprotectedRoutes;
