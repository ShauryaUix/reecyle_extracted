/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */

import React, { Component, createContext } from "react";

const Context = createContext({});

// eslint-disable-next-line react-refresh/only-export-components
export const { Consumer } = Context;

export class Provider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      setIsVisible: this.setIsVisible,
    };
  }

  setIsVisible = (visible) =>
    this.setState({
      isVisible: !!visible,
    });

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export default Context;
