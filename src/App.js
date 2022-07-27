import "./App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import apex_logo from "./resources/Apex_Logo_Final.png";
import UserForm from "./UserForm";
import PieResults from "./PieResults";
import { StrictMode } from "react";

function App() {
  return (
    <div className="App">
      <StrictMode>

        <Router>
          <header>
            <Link to="/">
              <img src={apex_logo} alt="" />
            </Link>
          </header>

          <Switch>

            <Route exact path='/'>
              <UserForm/>
            </Route>

            <Route path='/pieresults'>
              <PieResults/>
            </Route>

            
          </Switch>
        
      </Router>

      </StrictMode>
      
    </div>
  );
}

export default App;
