import React, { Component, PropTypes } from 'react';
import { IndexLink } from 'react-router';
import 'babel-polyfill';
import fetch from 'isomorphic-fetch';

export default class App extends Component {
  static propTypes = {
    children: PropTypes.any.isRequired,
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  constructor() {
    super();
    this.logOut = this.logOut.bind(this);
    this.redirect = this.redirect.bind(this);
  }
  logOut() {
    fetch(`/api/logOut/${this.props.params.username}`)
      .then((res) => {
        return res.json();
      })
      .then((found) => {
        console.log('found: ', found);
      })
      .catch((err) => {
        console.log(err);
      });
    this.redirect();
  }

  redirect() {
    const { router } = this.context;
    console.log('context: ');
    console.log(router);
    router.push('/');
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-inverse">
          <div className="container-fluid">
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle collapsed"
                data-toggle="collapse"
                data-target="#bs-example-navbar-collapse-9"
                aria-expanded="false"
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <a className="navbar-brand" href="#">Bridge Online</a>
            </div>
            <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-9">
              <ul className="nav navbar-nav">
                <li><IndexLink to={`/${this.props.params.username}/lobby`} activeClassName="active">Lobby</IndexLink></li>
              </ul>
              <ul className="nav navbar-nav pull-right">
                <li><a>{this.props.params.username}</a></li>
                <li><a onClick={this.logOut}>LogOut</a></li>
              </ul>
            </div>
          </div>
        </nav>
        {/* this will render the child routes */}
        <div className="container">
          {this.props.children}
        </div>
      </div>
    );
  }
}
