// import React, { useEffect } from 'react';
import { parse as parseQuery } from "querystring";

import Page from "hive-admin/src/components/Page";

class PageCheckout extends Page {
  render() {
    const { success } = parseQuery(window.location.search.slice(1));
    window.parent.postMessage(
      JSON.stringify(["checkout", { success: `${success}` === "true" }]),
      "*",
    );
    return null;
  }
}

export default [
  (config = {}) => PageCheckout.create(config),
  {
    hidden: true,
    hideHeader: true,
    hideSidebar: true,
    path: "/checkout-card-verification",
    exact: true,
  },
];
