import { Route, Routes, useMatch } from "react-router-dom";


/**
 * Defines all the unprotected routes which allows unauthenticated users.
 * @return All the unprotected routes.
 */
const UnprotectedRoutes = () => {
  const { path } = useMatch();

  return (
    <Routes>
      <Route path={ path + "/1" }>
        <h1>Home page</h1>  {/* TODO: Put the unprotected home page here */}
      </Route>

      <Route path={ path + "/2" }>
        <h1>Home page 2</h1>  {/* TODO: Put the unprotected home page here */}
      </Route>
    </Routes>
  );
}


export default UnprotectedRoutes;
