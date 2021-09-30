import './App.css';
import Login from './login';
import Chat from './chat';
import {BrowserRouter as Router, Route} from 'react-router-dom';

function App() {
  return (
      <div className="App">
        <Router>
          <Route exact path="/" component={Login}/>
          <Route path="/chat" component={Chat}/>
        </Router>
      </div>

  );
}

export default App;
