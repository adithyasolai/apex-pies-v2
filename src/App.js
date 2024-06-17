import "./App.css";
import "./styles.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import UserForm from "./UserForm";
import PieResults from "./PieResults";
import Login from "./Login";
import { StrictMode } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";
import Profile from "./Profile";
import ResourcesFaq from "./ResourcesFaq";
import Signup from "./Signup";
import ApexNavBar from "./ApexNavBar";

function App() {
  return (
    <div className="App">
      <StrictMode>
        <Router>
          <AuthProvider>

            <ApexNavBar/>

            <Switch>
              {/* User can't access UserForm until they have logged in. This re-directs them to Login if signed out. */}
              <PrivateRoute exact path="/">
                <UserForm />
              </PrivateRoute>

              <Route path="/pieresults">
                <PieResults />
              </Route>

              <Route path="/login">
                <Login />
              </Route>

              <Route path="/signup">
                <Signup />
              </Route>

              {/* User can't access Profile info until they have logged in. This re-directs them to Login if signed out. */}
              <PrivateRoute path="/profile">
                <Profile />
              </PrivateRoute>

              <Route path="/resourcesfaq">
                <ResourcesFaq />
              </Route>
            </Switch>

          </AuthProvider>
        </Router>
      </StrictMode>
    </div>
  );
}

export default App;
