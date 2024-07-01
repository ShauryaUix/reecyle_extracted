// eslint-disable-next-line no-unused-vars
import React from "react";

import Admin from "hive-admin";

import ActionPasswordReset from "hive-admin/src/components/ActionPasswordReset";
import ActionPasswordSet from "hive-admin/src/components/ActionPasswordSet";
import ActionLogin from "hive-admin/src/components/ActionLogin";

import Button from "../routes/dashboard/customers/components/Button";

Admin.addToLibrary(
  "redirect.viewerHasNoRole",
  (destination = "/", roles = []) =>
    ({ isAuthorized, viewer }) =>
      !isAuthorized || !viewer
        ? false
        : !roles.includes(viewer.role)
          ? destination
          : false,
);

Admin.addToLibrary(
  "redirect.viewerHasRole",
  (destination = "/", roles = []) =>
    ({ isAuthorized, viewer }) =>
      !isAuthorized || !viewer
        ? false
        : roles.includes(viewer.role)
          ? destination
          : false,
);

[
  ["ActionPasswordReset", ActionPasswordReset],
  ["ActionPasswordSet", ActionPasswordSet],
  ["ActionLogin", ActionLogin],
].forEach(([name, component]) =>
  Admin.addToLibrary(name, (config = {}) =>
    component.create({
      ...config,
      renderAction: (actionProps, instance) => {
        const action = instance.renderAction(actionProps);
        return (
          <Button
            {...action.props}
            color="brand"
            style={
              action.props.disabled
                ? { opacity: 0.4, padding: "15px" }
                : undefined
            }
          />
        );
      },
    }),
  ),
);
