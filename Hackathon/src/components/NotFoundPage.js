import React, { Component } from 'react';

class NotFoundPage extends Component {
  constructor() {
    super();
    this.state = {
      NotFound: true,
    };
  }
  render() {
    if (this.state.NotFound) {
      return (
        <div>NotFoundPage</div>
      );
    }
    return (
      <div>Found</div>
      );
  }
}

export default NotFoundPage;
