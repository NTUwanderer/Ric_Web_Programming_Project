import React, { Component } from 'react';
import classNames from 'classnames';
import 'babel-polyfill';
import fetch from 'isomorphic-fetch';

import './LogIn.css';

class LogIn extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      invalid: false,
    };

    this.changeUsername = this.changeUsername.bind(this);
    this.loginRequest = this.loginRequest.bind(this);
    this.succeedLogIn = this.succeedLogIn.bind(this);
  }

  componentWillMount() {
    this.forceUpdate();
  }

  changeUsername(e) {
    if (!e) e = window.event;
    const keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      const string = e.target.value;
      console.log(string);
      if (string !== '') {
        this.loginRequest(string);
      }
      e.target.value = '';
    }
  }

  loginRequest(username) {
    const thisArg = this;
    fetch(`/api/users/${username}`)
      .then((res) => {
        return res.json();
      })
      .then((found) => {
        console.log('found: ', found);
        if (found === false) {
          thisArg.setState({ invalid: false });
          thisArg.succeedLogIn(username);
        } else if (found === true) {
          thisArg.setState({ invalid: true });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  succeedLogIn(username) {
    console.log('succeedLogIn: ', username);
    const { router } = this.context;
    router.push(`/${username}`);
  }

  render() {
    return (
      <div className="form-page__wrapper">
        <div className="form-page__form-wrapper">
          <div className="form-page__form-header">
            <h2 className="form-page__form-heading">Login</h2>
          </div>
          <div className="form">
            <div className={classNames('form__error-wrapper', { hidden: !this.state.invalid })}>
              <p className="form__error form__error--username-taken">
                Sorry, but this username is already taken.
              </p>
            </div>
            <div className="form__field-wrapper">
              <input className="form__field-input" type="text" placeholder="frank.underwood" onKeyPress={this.changeUsername} />
              <label className="form__field-label" htmlFor="username">Username</label>
            </div>
            <div className="form__submit-btn-wrapper">
              <button className="form__submit-btn" onClick={this.succeedLogIn}>LogIn</button>
            </div>
          </div>
        </div>
      </div>);
  }
}

export default LogIn;
