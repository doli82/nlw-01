import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';

import Home from './pages/Home';
import CreatePoint from './pages/Points/CreatePoint';

const Routes = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Route component={Home} path="/" exact></Route>
      <Route component={CreatePoint} path="/create-point"></Route>
    </BrowserRouter>
  );
};

export default Routes;
