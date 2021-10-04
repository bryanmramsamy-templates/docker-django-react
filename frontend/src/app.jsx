import { BrowserRouter } from "react-router-dom";

import ProtectedRoutes from "./routes/protected-routes";
import UnprotectedRoutes from "./routes/unprotected-routes";

import AuthenticationRequired
  from "./components/authentication/authentication-required";
import { TestQueries } from "./test-query";

import './app.css';


/**
 * Renders the main components of the app
 * @return The main components of the app
 */
const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <TestQueries/>
        <UnprotectedRoutes />
        <AuthenticationRequired tokenRefreshInterval={ 1000 * 60 * 4 }>
          <ProtectedRoutes />
        </AuthenticationRequired>
      </BrowserRouter>
    </div>
  );
}


export default App;
