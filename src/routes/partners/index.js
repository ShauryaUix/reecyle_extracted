/* eslint-disable no-undef */
// import Admin from 'hive-admin';

import { ADMIN as FILTERS_ADMIN } from "./filters";
import { ADMIN as COLUMNS_ADMIN } from "./columns";
import { ADMIN as FIELDS_ADMIN } from "./fields";

import tests from "../../components/helper/tests";

export default Admin.compileFromLibrary([
  "GroupResource",
  {
    title: "Partners",
    icon: "shop",
    path: "/partners",
    redirect: [["redirect.unauthorized"]],
    headerTitleKey: "name",
    filters: FILTERS_ADMIN,
    columns: COLUMNS_ADMIN,
    fields: FIELDS_ADMIN,
    archiveConfig: {
      path: "/partners",
      title: "Partners",
      label: "Partners",
      icon: "shop",
      createButtonPath: "/partners/create",
    },
    singleConfig: {
      hidden: true,
      alias: "/partners",
      headerTitle: "Create Partner",
      backButtonPaths: ["/partners"],
    },
    singleEditConfig: {},
    skip: [tests.viewerIsNotAdmin],
  },
]).pages;
