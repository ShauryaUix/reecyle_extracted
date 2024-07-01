import startCase from "lodash/startCase";
import moment from "moment-timezone";

import React from "react";
import { Link } from "react-router-dom";

// import {
//   IconWithValue,
//   IconCoin,
// } from '../users/columns';

import Types from "../../../common/modules/types";

export const columnCreatedAt = {
  path: "createdAt",
  title: "Date",
  render: (record) =>
    moment(record.createdAt).tz(Types.TIMEZONE).format("DD/MM/YYYY HH:mm"),
};

export const columnPoints = {
  path: "categories",
  title: "Points",
  align: "right",
  render: (record, index, { viewer }) => {
    const { points } = viewer._.categories.reduce(
      (agr, category) => {
        agr.points += record.categories[category.id].points;
        return agr;
      },
      { points: 0 },
    );
    return <span>{Types.decimalizeInt(points)}</span>;
  },
};

export const [columnSorter, columnCustomer, columnOrganization, columnCage] = [
  ["author", "/users", "Sorter"],
  ["customer", "/users"],
  ["organization", "/organizations"],
  ["cage", "/cages"],
].map(([prefix, link, title]) => ({
  path: prefix,
  title: title || startCase(prefix),
  render: (record) =>
    !record[prefix] ? (
      "-"
    ) : (
      <Link to={`${link}/${record[prefix]._id || record[prefix]}`}>
        {record[prefix] && record[prefix].name
          ? record[prefix].name
          : record[`${prefix}Name`]}
      </Link>
    ),
}));

export const ADMIN = [
  columnCreatedAt,
  columnSorter,
  columnPoints,
  columnCustomer,
  columnOrganization,
  columnCage,
];
