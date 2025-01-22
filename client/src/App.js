import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './(pages)/home/page';
import Auth from './(pages)/auth/page';
import Dashboard from './(pages)/dashboard/page';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
