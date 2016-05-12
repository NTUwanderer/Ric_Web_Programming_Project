import React, { Component } from 'react';
import 'babel-polyfill';
import fetch from 'isomorphic-fetch';

class AddList extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
    this.changeRoomname = this.changeRoomname.bind(this);
    this.createRoom = this.createRoom.bind(this);
  }
  handleClick() {
    this.props.click(this.props.roomInfo.name);
  }

  changeRoomname(e) {
    if (!e) e = window.event;
    const keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      const string = e.target.value;
      console.log(string);
      if (string !== '') {
        this.createRoom(string);
      }
      e.target.value = '';
    }
  }

  createRoom(roomname) {
    const thisArg = this;
    fetch(`/api/createRoom/${roomname}/${this.props.username}`)
      .then((res) => {
        return res.json();
      })
      .then((succeed) => {
        if (succeed === true) {
          thisArg.props.click(roomname);
        } else {
          console.log('Fail to create room, return: ', succeed);
        }
      })
      .catch((err) => {
        console.log('err', err);
      });
  }

  render() {
    console.log(this.props.roomInfo);
    const { roomInfo } = this.props;
    return (
      <tr>
        <td><input placeholder="create your room" onKeyPress={this.changeRoomname} /></td>
        <td></td>
        <td></td>
      </tr>
      );
  }
}

export default AddList;
