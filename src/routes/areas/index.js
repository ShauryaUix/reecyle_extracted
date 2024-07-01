/* eslint-disable no-undef */
// import Admin from 'hive-admin';

import { ADMIN as FILTERS_ADMIN } from "./filters";
import { ADMIN as COLUMNS_ADMIN } from "./columns";
import { ADMIN as FIELDS_ADMIN } from "./fields";

import tests from "../../components/helper/tests";

export default Admin.compileFromLibrary([
  "GroupResource",
  {
    title: "Areas",
    icon: "appstore",
    path: "/areas",
    redirect: [["redirect.unauthorized"]],
    headerTitleKey: "name",
    filters: FILTERS_ADMIN,
    columns: COLUMNS_ADMIN,
    fields: FIELDS_ADMIN,
    archiveConfig: {
      path: "/areas",
      title: "Areas",
      label: "Areas",
      icon: "appstore",
      createButtonPath: "/areas/create",
      getCreateButtonPath: (props) =>
        props.viewer && props.viewer.role === "ADMIN"
          ? props.createButtonPath
          : null,
    },
    singleConfig: {
      hidden: true,
      alias: "/areas",
      headerTitle: "Create Area",
      backButtonPaths: ["/areas"],
    },
    singleEditConfig: {},
    skip: [tests.viewerIsNotAdmin],
  },
]).pages;
