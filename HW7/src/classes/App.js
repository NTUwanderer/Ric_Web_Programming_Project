import React from 'react';
import { Link } from 'react-router';

class App extends React.Component {
	render() {
		return (<Link to="/chat">Click to enter Chatroom.</Link>);
	}
}

export default App;