/**
 * FontFace
 * --------
 * props:
 *  - name: [string] **required**
 *  - weight: [number] **required**
 *  - url: [string] **required**
 */

/* eslint-disable react/no-unused-prop-types, react/static-property-placement */

import React, { Component } from "react";
import PropTypes from "prop-types";

import uniq from "lodash/uniq";
import isArray from "lodash/isArray";

export function renderCss({ name, weight, src } = {}) {
  return [
    "@font-face{",
    `font-family:"${name}";`,
    `font-weight:${weight};`,
    `src:${
      isArray(src)
        ? src
            .map(({ url, format }) => `url("${url}") format("${format}")`)
            .join(",")
        : `url("${src}")`
    }`,
    "}",
  ].join("");
}

export default class FontFace extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    weights: PropTypes.arrayOf(PropTypes.number).isRequired,
    sources: PropTypes.shape({}).isRequired,
  };

  static create(name, sources, defaultWeights) {
    const FontFaceClass = this;
    return ({ weights }) => (
      <FontFaceClass
        name={name}
        sources={sources}
        weights={weights || defaultWeights}
      />
    );
  }

  shouldComponentUpdate({
    name: nextName,
    sources: nextSources,
    weights: nextWeights,
  }) {
    const {
      name: currentName,
      sources: currentSources,
      weights: currentWeights,
    } = this.props;
    if (
      currentName !== nextName ||
      currentSources !== nextSources ||
      (currentWeights !== nextWeights &&
        (currentWeights.length !== nextWeights.length ||
          uniq([...currentWeights, ...nextWeights]).length !==
            currentWeights.length))
    ) {
      return true;
    }
    return false;
  }

  render() {
    const { name, weights, sources } = this.props;
    const css = weights
      .map((weight) => {
        const source = sources[weight];
        if (!source) {
          const message = `FontFace "${
            name
          }" is missing the source for weight ${weight}`;
          if (process.env.NODE_ENV !== "production") {
            throw new Error(message);
          } else {
            // eslint-disable-next-line no-console
            console.warn(message);
          }
          return message;
        }
        return renderCss({
          name,
          weight,
          ...source,
        });
      })
      .join("");
    return <style>{css}</style>;
  }
}
