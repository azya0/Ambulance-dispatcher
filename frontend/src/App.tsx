import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './css/style.css'
import Personal from './source/Personal';

function App() {
  const paths: { [key: string]: JSX.Element } = {
    '/personal': <Personal/>, 
  };

  return (
      <Router>
      <Routes>
        { Object.keys(paths).map((value: string) => <Route path={value} element={ paths[value] } />) }
      </Routes>
      </Router>
  );
}

export default App;
