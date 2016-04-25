import React from 'react';
import { render } from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';
import App from './classes/App.js';
import TodoApp from './classes/ChatApp.js';
import './chatroom.css';

render(<TodoApp />, document.getElementById('root'));