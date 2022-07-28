import "./App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import apex_logo from "./resources/Apex_Logo_Final.png";
import UserForm from "./UserForm";
import PieResults from "./PieResults";
import Login from "./Login";
import { StrictMode } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import PrivateRoute from "./PrivateRoute";

function App() {
  return (
    <div className="App">
      <StrictMode>

        <Router>
          <AuthProvider>
          <header>
            <Link to="/">
              <img src={apex_logo} alt="" />
            </Link>
          </header>

          <Switch>

            <PrivateRoute exact path='/'>
              <UserForm/>
            </PrivateRoute>

            <Route path='/pieresults'>
              <PieResults/>
            </Route>

            <Route path="/login">
              <Login />
            </Route>

            
          </Switch>
          </AuthProvider>
        </Router>

      </StrictMode>
      
    </div>
  );
}

export default App;
