import React, { Component } from 'react';

class Callback extends Component {
  render() {
    const style = {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100vw',
      height: '100vh'
    };

    return (
      <div style={style}>
        <span>Loading...</span>
      </div>
    );
  }
}

export default Callback;
