/* eslint-disable no-undef */
/* eslint-disable react-refresh/only-export-components */
import styled from "styled-components";

// import Admin from "hive-admin";

import { ADMIN as FILTERS_ADMIN } from "./filters";
import { ADMIN as COLUMNS_ADMIN } from "./columns";
import { ADMIN as FIELDS_ADMIN } from "./fields";

import tests from "../../components/helper/tests";

const Description = styled.span``;

export default Admin.compileFromLibrary([
  "GroupResource",
  {
    title: "Discount Codes",
    icon: "tag",
    path: "/discountcodes",
    redirect: [["redirect.unauthorized"]],
    headerTitleKey: "code",
    filters: FILTERS_ADMIN,
    columns: COLUMNS_ADMIN,
    fields: FIELDS_ADMIN,
    archiveConfig: {
      path: "/discountcodes",
      title: "Discount Codes",
      label: "Discount Codes",
      icon: "tag",
      createButtonPath: "/discountcodes/create",
    },
    singleConfig: {
      hidden: true,
      alias: "/discountcodes",
      headerTitle: "Create Discount Code",
      backButtonPaths: ["/discountcodes"],
    },
    singleEditConfig: {
      renderHeaderDescription: (props) =>
        props.data ? (
          <Description>
            {`${props.data.active ? "Active" : "Inactive"} | Signups: ${
              props.data.signupsCount || 0
            }${
              props.data.signupsCountMax > 0
                ? ` / ${props.data.signupsCountMax}`
                : ""
            }`}
          </Description>
        ) : null,
      actions: [
        ["ActionSave"],
        [
          "ActionWithRequest",
          {
            name: "activate",
            title: "Activate",
            skip: [["condition.check", { path1: "data.active", value2: true }]],
            getRequestConfig: (props) => ({
              url: `discountcodes/${props.data._id}/activate`,
              method: "POST",
              data: JSON.stringify({ activate: true }),
            }),
            handleSuccess: (data, props) => props.reload(),
          },
        ],
        [
          "ActionWithRequest",
          {
            name: "deactivate",
            title: "Deactivate",
            skip: [
              ["condition.check", { path1: "data.active", value2: false }],
            ],
            getRequestConfig: (props) => ({
              url: `discountcodes/${props.data._id}/activate`,
              method: "POST",
              data: JSON.stringify({ activate: false }),
            }),
            handleSuccess: (data, props) => props.reload(),
          },
        ],
        ["ActionDelete"],
      ],
    },
    skip: [tests.viewerIsNotAdmin],
  },
]).pages;
