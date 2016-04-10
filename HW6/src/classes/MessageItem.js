import React, { Component, PropTypes } from 'react';

class MessageItem extends React.Component {
  render() {
    let string = this.props.message.me ? "message-item message-from-me" : "message-item message-from-other";
    return (
      <div className={string}>
        <span>{this.props.message.message}</span>
      </div>);
  }
}

export default MessageItem;