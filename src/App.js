import './App.css';
import Login from './login';
import Chat from './chat';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import React from 'react';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
      <div className="App">
        <Router>
          <Route exact path="/" component={Login}/>
          <ProtectedRoute path="/chat" component={Chat}/>
        </Router>
      </div>

  );
}

export default App;
