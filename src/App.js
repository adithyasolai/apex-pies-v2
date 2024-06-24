import "./App.css";
import "./styles.css";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import UserForm from "./UserForm";
import PieResults from "./PieResults";
import Login from "./Login";
import { StrictMode } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import FormRouteOnly from "./FormRouteOnly"
import Profile from "./Profile";
import ResourcesFaq from "./ResourcesFaq";
import Signup from "./Signup";
import ApexNavBar from "./ApexNavBar";
import MyPies from "./MyPies";

function App() {
  return (
    <div className="App">
      <StrictMode>
        <Router>
          <AuthProvider>

            <ApexNavBar/>

            <Switch>
              {/* User can't access UserForm until they have logged in. This re-directs them to Login if signed out. */}
              <Route exact path="/">
                <UserForm />
              </Route>

              <FormRouteOnly path="/pieresults">
                <PieResults />
              </FormRouteOnly>

              <PublicOnlyRoute path="/login">
                <Login />
              </PublicOnlyRoute>

              <Route path="/signup">
                <Signup />
              </Route>

              {/* Must be signed-in to access mypies page */}
              <PrivateRoute path="/mypies">
                <MyPies />
              </PrivateRoute>

              {/* User can't access Profile info until they have logged in. This re-directs them to Login if signed out. */}
              <PrivateRoute path="/profile">
                <Profile />
              </PrivateRoute>

              <Route path="/resourcesfaq">
                <ResourcesFaq />
              </Route>

              {/* route everything else to UserForm homepage as well */}
              <Route path="/">
                <Redirect to="/" />
              </Route>
            </Switch>

          </AuthProvider>
        </Router>
      </StrictMode>
    </div>
  );
}

export default App;
