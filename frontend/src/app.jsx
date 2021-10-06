import { BrowserRouter, Route, Switch } from "react-router-dom";

import ProtectedRoutes from "./routes/protected-routes";
import UnprotectedRoutes from "./routes/unprotected-routes";

import AuthenticationRequired
  from "./components/authentication/authentication-required";
import BaseContainer from "./components/base-container";

import './app.css';


/**
 * Renders the main components of the app
 * @return The main components of the app
 */
const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <BaseContainer>
          <Switch>

            <Route path="/home">  {/* TODO: Change path name */}
              <UnprotectedRoutes />
            </Route>

            <Route path="/protected">  {/* TODO: Change path name */}
              <AuthenticationRequired tokenRefreshInterval={ 1000 * 60 * 4 }>
                <ProtectedRoutes/>
              </AuthenticationRequired>
            </Route>

          </Switch>
        </BaseContainer>
      </BrowserRouter>
    </div>
  );
}


export default App;
