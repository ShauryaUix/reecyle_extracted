import React from "react";
import styled from "styled-components";

import AntdButton from "antd/lib/button";
import { Link } from "react-router-dom";
import Action from "hive-admin/src/components/Action";

// import Admin from './Admin';
import Admin from "hive-admin";

const ActionButton = styled(AntdButton)`
  text-align: left;
  padding: 0px 10px;
`;

Admin.addToLibrary(
  "FilterActionLink",
  ({ id, to, title, linkProps = {}, buttonProps = {}, ...config } = {}) =>
    Action.create({
      id: id || to,
      name: id || to,
      section: "top",
      renderAction: () => (
        <Link key={to} to={id || to} {...linkProps}>
          <ActionButton block {...buttonProps}>
            {title}
          </ActionButton>
        </Link>
      ),
      ...config,
    }),
);
