import React, { Component } from 'react';
// import classNames from 'classnames';
import './SingleUserPage.css';

class Room extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      name: 'None',
      seats: [null, null, null, null], // north, east, south, west
      username: null,
    };
    this.clickFollowing = this.clickFollowing.bind(this);
    this.clickFollowingHandler = this.clickFollowingHandler.bind(this);
    this.clickIndex = this.clickIndex.bind(this);
    this.clickIndexHandler = this.clickIndexHandler.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  componentWillMount() {
    this.forceUpdate();
  }

  componentDidMount() {
    this.refresh();
  }

  clickFollowing(name) {
    console.log('handleClick: ', name);
    const { router } = this.context;
    router.push(`/users/${name}`);
  }
  clickFollowingHandler(name) {
    function func() {
      this.clickFollowing(name);
    }
    func = func.bind(this);
    return func;
  }

  clickIndex(index) {
    this.setState({ index: index });
  }

  clickIndexHandler(index) {
    function func() {
      this.clickIndex(index);
    }
    func = func.bind(this);
    return func;
  }

  refresh() {
    const username = this.props.params.username;
    console.log("params.username: " + username);
    console.log("state.upsername: " + this.state.username);
    if (username !== this.state.username) {
      const thisArg = this;
      fetch('/api/users/' + username)
        .then(function(res) {
          return res.json();
        })
        .then(function(json) {
          thisArg.setState({user: json, username: username, err: null});
        })
        .catch(function(err) {
          console.log(err);
          thisArg.setState({err: err, user: "None"});
        })
    }
  }

  render() {
    return <div>Room</div>;
  }
}

export default Room;
