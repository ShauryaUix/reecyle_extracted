/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* global Frames */

import React, { Component, forwardRef } from "react";
import styled from "styled-components/macro"; // useTheme,
// import { transparentize } from 'polished';
// import { useDictionary } from '../../context/Dictionary';

import FieldReact from "hive-admin/src/components/FieldReact";

import Admin from "./Admin";

// if (
//   typeof window !== 'undefined' &&
//   !document.getElementById('framesv2script')
// ) {
//   const script = document.createElement('script');
//   script.id = 'framesv2script';
//   script.src = 'https://cdn.checkout.com/js/framesv2.min.js';
//   document.body.appendChild(script);
// }

let DID_INIT = false;

const EVENTS = [
  "cardSubmitted",
  "cardTokenizationFailed",
  "cardTokenized",
  "cardValidationChanged",
  "frameActivated",
  "frameBlur",
  "frameFocus",
  "frameValidationChanged",
  "paymentMethodChanged",
  "ready",
].map((event) => ({
  prop: `on${event[0].toUpperCase()}${event.slice(1)}`,
  event,
}));

const Wrapper = styled.div`
  position: relative;
  height: 40px;
  width: 100%;
  border-bottom: 1px solid
    ${({ theme }) =>
      theme.theme === "dark"
        ? "hsla(0, 0%, 100%, 0.1)"
        : "hsla(0, 0%, 0%, 0.1)"};
  overflow: hidden;
  &.frame--invalid {
    border-bottom: 1px solid rgba(255, 0, 0, 0.4);
  }

  filter: grayscale(1);
`;

class InputCheckoutCardComponent extends Component {
  constructor(props) {
    super(props);
    this.eventHandlers = EVENTS.map(({ event, prop }) => ({
      event,
      callback: (ev) => this.props[prop] && this.props[prop](ev),
    }));
  }

  async getFrames(forceReinit = false) {
    const el = document.querySelector('[data-frames-wrapper="true"]');
    if (el) {
      if (!DID_INIT || forceReinit) {
        DID_INIT = true;
        Frames.init({
          // localization: this.props.localization,
          publicKey: this.props.publicKey,
          // style: {
          //   base: {
          //     color: this.props.colors.body,
          //   },
          //   focus: {
          //     color: this.props.colors.body,
          //   },
          //   valid: {
          //     color: this.props.colors.body,
          //   },
          //   invalid: {
          //     color: this.props.colors.error,
          //   },
          //   placeholder: {
          //     base: {
          //       color: transparentize(0.5, this.props.colors.body),
          //     },
          //   },
          // },
        });
      }
      return Frames;
    }
    return new Promise((resolve) => setTimeout(resolve, 10)).then(() => {
      if (!this.unmounted) {
        return this.getFrames();
      }
      return null;
    });
  }

  async componentDidMount() {
    const frames = await this.getFrames();
    this.eventHandlers.forEach(({ event, callback }) =>
      frames.addEventHandler(event, callback),
    );
    frames.render();
  }

  async componentWillUnmount() {
    const frames = await this.getFrames();
    this.eventHandlers.forEach(({ event }) =>
      frames.removeAllEventHandlers(event),
    );
    this.unmounted = true;
  }

  async componentDidUpdate(previousProps) {
    if (
      previousProps.publicKey !== this.props.publicKey
      // || previousProps.localization !== this.props.localization
    ) {
      await this.getFrames(true);
    }
  }

  render() {
    return (
      <Wrapper
        className={`card-frame${
          this.props.className ? ` ${this.props.className}` : ""
        }`}
        data-frames-wrapper="true"
        style={this.props.style}
      />
    );
  }
}

// eslint-disable-next-line arrow-body-style
const InputCheckoutCard = forwardRef((props, ref) => {
  return <InputCheckoutCardComponent ref={ref} {...props} />;
});

Admin.addToLibrary("FieldCheckoutCard", (config = {}) =>
  FieldReact.create({
    ...config,
    renderContent: ({ style, className, checkoutCardInputRef, ...props }) => (
      <InputCheckoutCard
        ref={checkoutCardInputRef}
        style={style}
        className={className}
        publicKey={config.checkoutPublicKey}
        {...props}
      />
    ),
  }),
);

export default InputCheckoutCard;
