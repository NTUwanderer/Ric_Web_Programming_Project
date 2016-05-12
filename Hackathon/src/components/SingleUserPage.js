import React, { Component } from 'react';
import classNames from 'classnames';
import './SingleUserPage.css';

class SingleUserPage extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      user: "None",
      err: null,
      username: null
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
    console.log("handleClick: " + name);
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
    this.setState({index: index});
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
  componentDidUpdate() {
    this.refresh();
  }

  render() {
    let user = this.state.user;
    if (user === "None" && this.state.err === null) {
      let message = "No such user with username: " + this.props.params.username;
      if (this.state.err != null)
        message = "Error Message: " + err.message;      
      return (<h1>{message}</h1>);
    }
    else {
      let icons = user.following.map(function(person) {
        return (
          <div key={"icon: " + person.name} className="col-md-6">
            <div className="useravatar followings">
              <img onClick={this.clickFollowingHandler(person.name)} alt="" src={person.photo} />
            </div>
            <div className="card-info" /*onClick={this.clickFollowingHandler(name)}*/>
              <span className="card-title">{person.name}</span>
            </div>
          </div>
              );
      }, this);

      let followings = [];
      for (let i = 0, length = icons.length; i < length; ++i) {
        let temp = {};
        if (i < length - 1) {
          temp =  (<div key={i} className="row" style={{textAlign: "center"}}>
                    {[icons[i], icons[i + 1]]}
                  </div>);
          ++i;
        } else {
          temp =  (<div key={i} className="row" style={{textAlign: "center"}}>
                    {icons[i]}
                  </div>);
        }
        followings.push(temp);
      }

      return (
        <div className="col-lg-6 col-sm-6">
          <div className="card hovercard">
              <div className="card-background">
                  <img className="card-bkimg" alt="" src={user.photo} />
              </div>
              <div className="useravatar">
                  <img alt="" src={user.photo} />
              </div>
              <div className="card-info">
                <span className="card-title">{user.name}</span>
              </div>
          </div>
          <div className="btn-pref btn-group btn-group-justified btn-group-lg" role="group" aria-label="...">
              <div className="btn-group" role="group">
                  <button onClick={this.clickIndexHandler(0)} type="button" id="stars" className={classNames('btn', {'btn-primary': this.state.index === 0}, {'btn-default': this.state.index !== 0})} href="#tab1" data-toggle="tab"><span className="glyphicon glyphicon-list-alt" aria-hidden="true"></span>
                      <div className="hidden-xs">Info</div>
                  </button>
              </div>
              <div className="btn-group" role="group">
                  <button onClick={this.clickIndexHandler(1)} type="button" id="favorites" className={classNames('btn', {'btn-primary': this.state.index === 1}, {'btn-default': this.state.index !== 1})} href="#tab2" data-toggle="tab"><span className="glyphicon glyphicon-heart" aria-hidden="true"></span>
                      <div className="hidden-xs">Favorites & Weapon</div>
                  </button>
              </div>
              <div className="btn-group" role="group">
                  <button onClick={this.clickIndexHandler(2)} type="button" id="following" className={classNames('btn', {'btn-primary': this.state.index === 2}, {'btn-default': this.state.index !== 2})} href="#tab3" data-toggle="tab"><span className="glyphicon glyphicon-user" aria-hidden="true"></span>
                      <div className="hidden-xs">Following</div>
                  </button>
              </div>
          </div>

          <div className="well">
              <div className="tab-content">
                <div className="tab-pane fade in active" id="tab1">
                  <div className="row" style={{textAlign: "center"}}>
                    <div className="col-md-4">Name</div>
                    <div className="col-md-8">{user.name}</div>
                  </div>
                  <div className="row" style={{textAlign: "center"}}>
                    <div className="col-md-4">Hobby</div>
                    <div className="col-md-8">{user.hobby}</div>
                  </div>
                </div>
                <div className="tab-pane fade in" id="tab2">
                  <div className="row" style={{textAlign: "center"}}>
                    <div className="col-md-4">Best Subject</div>
                    <div className="col-md-8">{user.best_subject}</div>
                  </div>
                  <div className="row" style={{textAlign: "center"}}>
                    <div className="col-md-4">Best Spell</div>
                    <div className="col-md-8">{user.best_spell}</div>
                  </div>
                  <div className="row" style={{textAlign: "center"}}>
                    <div className="col-md-4">Wand</div>
                    <div className="col-md-8">{user.wand}</div>
                  </div>
                </div>
                <div className="tab-pane fade in" id="tab3">
                    {
                      followings
                    }
                </div>
              </div>
            </div>
          </div>
        );
    }
  }
}

export default SingleUserPage;
