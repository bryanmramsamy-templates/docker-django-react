import { Route, Routes } from "react-router-dom";


/**
 * Defines all the protected routes which requires the user to be authenticated.
 * @return All the protected routes.
 */
const ProtectedRoutes = () => {
  return (
    <Routes>
      <Route
        path="1"  // TODO: Put the protected pages here
        element={ <h1>Protected page</h1> }
      />

      <Route
        path="2"  // TODO: Put the protected pages here
        element={ <h1>Protected page 2</h1> }
      />
    </Routes>
  );
}


export default ProtectedRoutes;
