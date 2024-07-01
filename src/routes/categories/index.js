/* eslint-disable no-undef */
// import Admin from 'hive-admin';

import { ADMIN as FILTERS_ADMIN } from "./filters";
import { ADMIN as COLUMNS_ADMIN } from "./columns";
import { ADMIN as FIELDS_ADMIN } from "./fields";

import tests from "../../components/helper/tests";

export default Admin.compileFromLibrary([
  "GroupResource",
  {
    title: "Categories",
    icon: "filter",
    path: "/categories",
    redirect: [["redirect.unauthorized"]],
    headerTitleKey: "name",
    filters: FILTERS_ADMIN,
    columns: COLUMNS_ADMIN,
    fields: FIELDS_ADMIN,
    archiveConfig: {
      path: "/categories",
      title: "Categories",
      label: "Categories",
      icon: "filter",
      // createButtonPath: '/categories/create',
      createButtonSupported: false,
    },
    singleConfig: {
      hidden: true,
      alias: "/categories",
      headerTitle: "Create Category",
      backButtonPaths: ["/categories"],
    },
    singleEditConfig: {
      actions: [["ActionSave"]],
    },
    skip: [tests.viewerIsNotAdmin],
  },
]).pages;
