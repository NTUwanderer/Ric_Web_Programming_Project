import React from 'react';
import { Route, IndexRedirect, IndexRoute } from 'react-router';
import LogIn from './components/LogIn';
import Lobby from './components/Lobby';
import Room from './components/Room';
import NotFoundPage from './components/NotFoundPage';

export default (
  <Route path="/">
    <IndexRoute component={LogIn} />
    <Route path=":username">
      <IndexRedirect to="lobby" />
      <Route path="lobby">
        <IndexRoute component={Lobby} />
        <Route path=":roomname">
          <IndexRoute component={Room} />
        </Route>
      </Route>
    </Route>
    <Route path="*" component={NotFoundPage} />
  </Route>
);
