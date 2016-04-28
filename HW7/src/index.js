import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Home from './classes/Home.js';
import TodoApp from './classes/ChatApp.js';
import NotFound from './classes/NotFound.js';
import Users from './classes/Users.js';
import User from './classes/User.js';
import './chatroom.css';
import './classes/User.css'

render(
  <Router history={browserHistory}>
    <Route path="/">
    	<IndexRoute component={Home} />
      <Route path="/chat" component={TodoApp}/>
      <Route path="/users/:username" component={User}>
        
	    </Route>
      <Route path="*" component={NotFound} />
    </Route>
  </Router>
, document.getElementById('root'));

// render(<TodoApp />, document.getElementById('root'));