import React, { Component } from 'react';
import 'babel-polyfill';
import fetch from 'isomorphic-fetch';

import './UsersPage.css';

class UsersPage extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      users: []
    };
    this.handleClick = this.handleClick.bind(this);
  }

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  componentWillMount() {
    this.forceUpdate();
  }

  handleClick(name) {
    console.log("handleClick: " + name);
    const { router } = this.context;
    router.push(`/users/${name}`);
  }

  componentDidMount() {
    const thisArg = this;
    fetch('/api/users')
      .then(function(res) {
        return res.json();
      })
      .then(function(json) {
        console.log(json);
        thisArg.setState({users: json});
      })
      .catch(function(err) {
        console.log(err);
      });
  }

  render() {
    console.log(this.state.users);
    return (
      <div>
        <table className = "table">
          <caption>Click Photo to see personal info...</caption>
           
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Best Subject</th>
              <th>Best Spell</th>
              <th>Hobby</th>
              <th>Wand</th>
            </tr>
          </thead>
           
          <tbody>
            {
              this.state.users.map(
                function(user, index) {
                  console.log(user);
                  return <UserList key={user.name} userInfo={user} index={index} click={this.handleClick} />;
                }, this)
            }
          </tbody>
           
        </table>
      </div>
    );
  }
}

class UserList extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.props.click(this.props.userInfo.name);
  }

  render() {
    console.log(this.props.userInfo);
    const { userInfo, index } = this.props;
    return (
      <tr>
        <td><img onClick={this.handleClick} className="img-responsive" src={userInfo.photo} /></td>
        <td>{userInfo.name}</td>
        <td>{userInfo.best_subject}</td>
        <td>{userInfo.best_spell}</td>
        <td>{userInfo.hobby}</td>
        <td>{userInfo.wand}</td>
      </tr>
      );
  }
}

export default UsersPage;
