import React from "react";

import Admin from "hive-admin";
import PageSingle from "hive-admin/src/components/PageSingle";

import PageDashboard from "../pageDashboard";

import Customer from "./customer";

import tests from "../../../components/helper/tests";

// eslint-disable-next-line import/no-anonymous-default-export
export default Admin.compileFromLibrary([
  (config) => PageDashboard.create(config),
  {
    icon: "dashboard",
    title: "Dashboard",
    path: "/(reecycle|reewards)/(available|my)?/:id?",
    exact: true,
    activity: "edit",
    redirect: [["redirect.unauthorized"]],
    loadExtractData: PageSingle.config.loadExtractData,
    loadUrl: "/users/me",
    actions: [],
    hidden: [tests.viewerIsNotCustomer],
    skip: [tests.viewerIsNotCustomer],
    hideSidebar: true,
    hideHeader: true,
    getHideSidebar: (props) =>
      !props.viewer || props.viewer.role === "CUSTOMER",
    getHideHeader: (props) => !props.viewer || props.viewer.role === "CUSTOMER",
    renderHeaderTitle: (props) => null,
    renderContent: (props) => <Customer {...props} />,
  },
]);
