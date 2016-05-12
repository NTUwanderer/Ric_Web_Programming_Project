import React, { Component } from 'react';
// import classNames from 'classnames';
import './SingleUserPage.css';

const fourSeats = [
  'North',
  'East',
  'South',
  'West',
];

class Room extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      name: 'None',
      owner: 'None',
      seats: [null, null, null, null], // north, east, south, west
      username: props.params.username,
      observers: [],
    };
    this.clickFollowing = this.clickFollowing.bind(this);
    this.clickFollowingHandler = this.clickFollowingHandler.bind(this);
    this.clickIndex = this.clickIndex.bind(this);
    this.clickIndexHandler = this.clickIndexHandler.bind(this);
  }

  componentWillMount() {
    this.forceUpdate();
  }

  componentDidMount() {
    const thisArg = this;
    fetch(`/api/rooms/${this.props.params.roomname}`)
      .then((res) => {
        if (res.status === 404) {
          const { router } = this.context;
          router.push(`${this.props.params.username}/lobby`);
        } else {
          return res.json();
        }
      })
      .then((json) => {
        console.log('room: ', json);
        if (json === "Not Found") {
          console.log("Error: Not Found but not 404...");
        } else {
          thisArg.setState(json);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
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

  render() {
    return (
      <div>
        <p>{this.state.name}</p>
        <p>{`Username: ${this.state.username}`}</p>
        <p>{`Owner: ${this.state.owner}`}</p>
        <ul>
          {
            this.state.seats.map((seat, index) => {
              return <li><p>{`${fourSeats[index]}: ${seat}`}</p></li>;
            })
          }
        </ul>
        <p>Observers: </p>
        <ul>
          {
            this.state.observers.map((observer, index) => {
              return <li><p>{`${index}: ${observer}`}</p></li>;
            })
          }
        </ul>
      </div>
    );
  }
}

export default Room;
