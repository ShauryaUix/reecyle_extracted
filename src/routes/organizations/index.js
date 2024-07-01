/* eslint-disable no-undef */
// import Admin from 'hive-admin';

import { ADMIN as FILTERS_ADMIN } from "./filters";
import { ADMIN as COLUMNS_ADMIN } from "./columns";
import { ADMIN as FIELDS_ADMIN } from "./fields";

import tests from "../../components/helper/tests";

export default Admin.compileFromLibrary([
  "GroupResource",
  {
    title: "Organizations",
    icon: "bank",
    path: "/organizations",
    redirect: [["redirect.unauthorized"]],
    headerTitleKey: "name",
    filters: FILTERS_ADMIN,
    columns: COLUMNS_ADMIN,
    fields: FIELDS_ADMIN,
    archiveConfig: {
      path: "/organizations",
      title: "Organizations",
      label: "Organizations",
      icon: "bank",
      createButtonPath: "/organizations/create",
    },
    singleConfig: {
      hidden: true,
      alias: "/organizations",
      headerTitle: "Create Organization",
      backButtonPaths: ["/organizations"],
    },
    singleEditConfig: {},
    skip: [tests.viewerIsNotAdmin],
  },
]).pages;
