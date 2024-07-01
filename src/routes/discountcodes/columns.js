import React from "react";
import { Link } from "react-router-dom";

import Types from "../../common/modules/types";

export const columnCode = {
  path: "code",
  width: "100%",
  render: (record) => (
    <Link to={`/discountcodes/${record._id}`}>
      <span>
        <code>{record.code}</code>
      </span>
    </Link>
  ),
};

export const columnAmountFixed = {
  path: "amountFixed",
  title: `Amount (${Types.CURRENCY})`,
  align: "right",
  render: (record) => {
    const label = (
      <span style={{ opacity: record.amountFixed > 0 ? 1 : 0.4 }}>
        {`${
          record.amountFixed > 0
            ? `${record.amountFixed} ${Types.CURRENCY}`
            : "-"
        }`}
      </span>
    );
    return label;
  },
};

export const columnAmountPercentage = {
  path: "amountPercentage",
  title: "Amount (%)",
  align: "right",
  render: (record) => {
    const label = (
      <span style={{ opacity: record.amountPercentage > 0 ? 1 : 0.4 }}>
        {`${record.amountPercentage > 0 ? `${record.amountPercentage}%` : "-"}`}
      </span>
    );
    return label;
  },
};

export const columnCustomers = {
  path: "customers",
  title: "Signups",
  render: (record, column, props) => {
    const label = `${record.signupsCount || 0} / ${
      record.signupsCountMax > 0 ? record.signupsCountMax : "Unlimited"
    }`;
    return label;
  },
};

export const ADMIN = [
  columnCode,
  columnAmountFixed,
  columnAmountPercentage,
  columnCustomers,
];
