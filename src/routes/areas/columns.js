import React from "react";

export const columnName = {
  path: "name",
  width: "100%",
  link: "/areas/:_id",
};

export const columnStatus = {
  path: "status",
  render: (record) =>
    !record.active ? "Hidden" : !record.serviced ? "Inactive" : "Active",
};

export const columnSize = {
  path: "polygon.size",
  title: "Area",
  align: "right",
  render: (record) => (
    <span>
      {(record.polygon.size / 10 ** 6).toFixed(2)}
      &nbsp;
      <span>
        km
        <sup>2</sup>
      </span>
    </span>
  ),
};

export const ADMIN = [columnName, columnStatus, columnSize];
