import React, { Component } from 'react';
import 'babel-polyfill';
import fetch from 'isomorphic-fetch';

import RoomList from './RoomList';

class Lobby extends Component {
  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  constructor(props, context) {
    super(props, context);
    this.state = {
      rooms: [],
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    const thisArg = this;
    fetch('/api/rooms')
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        console.log('rooms', json);
        if (json !== undefined || json !== null) {
          thisArg.setState({ rooms: json });
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }

  handleClick(roomname) {
    console.log('handleClick: ', roomname);
    const { router } = this.context;
    router.push(`${this.props.params.username}/lobby/${roomname}`);
  }

  render() {
    console.log(this.state.users);
    return (
      <div>
        <table className="table">
          <caption>Click Room name to enter the room...</caption>
          <thead>
            <tr>
              <th>Room</th>
              <th>Owner</th>
              <th>Num of People</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.rooms.map(
                (room) => {
                  console.log(room);
                  return <RoomList key={room.name} roomInfo={room} click={this.handleClick} />;
                }, this)
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default Lobby;
