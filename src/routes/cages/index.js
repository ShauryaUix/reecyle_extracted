/* eslint-disable no-undef */
// import Admin from 'hive-admin';

import { ADMIN as FILTERS_ADMIN } from "./filters";
import { ADMIN as COLUMNS_ADMIN } from "./columns";
import { ADMIN as FIELDS_ADMIN } from "./fields";

import tests from "../../components/helper/tests";
import clickAnchor from "../../components/helper/clickAnchor";

export default Admin.compileFromLibrary([
  "GroupResource",
  {
    title: "Cages",
    icon: "delete",
    path: "/cages",
    redirect: [["redirect.unauthorized"]],
    headerTitleKey: "name",
    filters: FILTERS_ADMIN,
    columns: COLUMNS_ADMIN,
    fields: FIELDS_ADMIN,
    archiveConfig: {
      path: "/cages",
      title: "Cages",
      label: "Cages",
      icon: "delete",
      createButtonPath: "/cages/create",
    },
    singleConfig: {
      hidden: true,
      alias: "/cages",
      headerTitle: "Create Cage",
      backButtonPaths: ["/cages"],
    },
    singleEditConfig: {
      actions: [
        ["ActionSave"],
        ["ActionDelete"],
        [
          "Action",
          {
            name: "download-tag",
            title: "Download Cage Tag",
            ghost: true,
            onClick: (props) =>
              clickAnchor(
                {
                  url: `${props.restBaseRoot}/recycletags/generate`,
                  query: {
                    count: 1,
                    download: true,
                    cage: props.data._id,
                    access_token: props.client.getAccessToken(),
                  },
                },
                { download: true },
              ),
          },
        ],
      ],
    },
    skip: [tests.viewerIsNotAdmin],
  },
]).pages;
