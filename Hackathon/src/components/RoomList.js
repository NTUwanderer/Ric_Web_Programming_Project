import React, { Component } from 'react';

class RoomList extends Component {
  constructor() {
    super();
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    this.props.click(this.props.roomInfo.name);
  }

  render() {
    console.log(this.props.roomInfo);
    const { roomInfo } = this.props;
    return (
      <tr>
        <td onClick={this.handleClick}>{roomInfo.name}</td>
        <td>{roomInfo.owner}</td>
        <td>{roomInfo.num_of_people}</td>
      </tr>
      );
  }
}

export default RoomList;
