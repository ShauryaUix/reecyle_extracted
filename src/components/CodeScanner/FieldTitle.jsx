import isString from "lodash/isString";
import isFunction from "lodash/isFunction";

import React from "react";
import styled from "styled-components";

import Admin from "hive-admin";
import FieldReact from "hive-admin/src/components/FieldReact";

import Icon from "antd/lib/icon";

const Title = styled.h1`
  font-size: 26px;
  font-weight: 600;
  margin: 0px;
  padding: 0px;
  margin-top: 20px;
  text-align: left;
  > .field-title-text {
    color: ${({ theme }) => theme.less.textColor};
    opacity: 0.8;
    padding-left: 0px;
  }
`;

Admin.addToLibrary(
  "FieldTitle",
  ({
    title = null,
    icon = null,
    style = undefined,
    textStyle = undefined,
    ...config
  } = {}) =>
    FieldReact.create({
      label: null,
      renderContent: (props, field) => (
        <Title style={style}>
          {isString(icon) ? <Icon type={icon} /> : icon}
          {title ? (
            <>
              {" "}
              <span style={textStyle} className="field-title-text">
                {isFunction(title) ? title(props, field) : title}
              </span>
            </>
          ) : null}
        </Title>
      ),
      ...config,
    }),
);
