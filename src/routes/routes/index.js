/* eslint-disable no-undef */
// import Admin from 'hive-admin';
// import GroupResource from 'hive-admin/src/components/GroupResource';

import {
  ADMIN as FILTERS_ADMIN,
  ADMIN_NEW as FILTERS_ADMIN_NEW,
} from "./filters";
import {
  ADMIN as COLUMNS_ADMIN,
  ADMIN_NEW as COLUMNS_ADMIN_NEW,
} from "./columns";
import { ADMIN as FIELDS_ADMIN } from "./fields";

import Types from "../../components/types";

import tests from "../../components/helper/tests";

export default Admin.compileFromLibrary([
  "GroupResource",
  {
    title: "Routes",
    icon: "car",
    path: "/routes",
    redirect: [["redirect.unauthorized"]],
    headerTitleKey: "name",
    filters: FILTERS_ADMIN,
    columns: COLUMNS_ADMIN,
    fields: FIELDS_ADMIN,
    archiveConfig: {
      icon: "car",
      title: "Routes",
      label: "Routes",
      titleColumnPath: "_id",
      createButtonPath: "/routes/create",
      getCreateButtonPath: (props) =>
        props.viewer && props.viewer.role === "ADMIN"
          ? props.createButtonPath
          : null,
    },
    afterArchivePages: [
      [
        "PageArchiveTable",
        {
          path: "/routes/create",
          alias: "/routes",
          exact: true,
          title: "New Route",
          label: "New Route",
          icon: "car",
          loadUrl: "/users/customers",
          loadExtractData: GroupResource.config.archiveLoadExtractData,
          createButtonSupported: false,
          subtitleColumnPath: "name",
          filters: FILTERS_ADMIN_NEW,
          columns: COLUMNS_ADMIN_NEW,
          skip: [tests.viewerIsNotAdmin],
          hidden: true,
        },
      ],
    ],
    singleCreateConfig: {
      skip: [() => true],
    },
    singleEditConfig: {
      hidden: true,
      alias: "/routes",
      title: "Route",
      headerTitle: "Route",
      loadUrl: `routes/:id/?query=${btoa(
        JSON.stringify({
          populate: {
            driver: true,
            "stops.customer": true,
          },
        }),
      )}`,
      backButtonPaths: ["/routes"],
      actions: [
        [
          "ActionWithRequest",
          {
            name: "start",
            title: "Start",
            icon: "rocket",
            type: "primary",
            ghost: true,
            skip: [
              (props) =>
                !props.data || props.data.started || props.data.completed,
            ],
            getRequestConfig: ({ data }) => ({
              url: `routes/${data._id}/actions/start`,
              method: "POST",
            }),
            handleSuccess: (data, actionProps) => actionProps.reload(),
          },
        ],
        [
          "ActionWithRequest",
          {
            name: "complete",
            title: "Complete",
            icon: "check",
            type: "primary",
            ghost: true,
            skip: [
              (props) =>
                !props.data || !props.data.started || props.data.completed,
            ],
            getRequestConfig: ({ data }) => ({
              url: `routes/${data._id}/actions/complete`,
              method: "POST",
            }),
            handleSuccess: (data, actionProps) => actionProps.reload(),
          },
        ],
        [
          "ActionDelete",
          {
            skip: [
              (props) =>
                !props.viewer ||
                props.viewer.role !== Types.USER_ROLE_CONST.ADMIN,
            ],
          },
        ],
      ],
    },
    skip: [
      (props) =>
        !props.viewer ||
        ![Types.USER_ROLE_CONST.ADMIN, Types.USER_ROLE_CONST.DRIVER].includes(
          props.viewer.role,
        ),
    ],
  },
]).pages;
