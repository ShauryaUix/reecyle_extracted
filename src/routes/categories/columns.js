import React from "react";

import Types from "../../common/modules/types";

export const columnName = {
  path: "name",
  width: "100%",
  link: "/categories/:_id",
};

export const columnActive = {
  path: "active",
  align: "center",
  render: (record) => (record.active ? "Active" : "-"),
};

export const columnHidden = {
  path: "hidden",
  align: "center",
  render: (record) => (record.hidden ? "Hidden" : "-"),
};

export const columnUnit = {
  path: "unit",
  align: "right",
  render: (record) =>
    (Types.CATEGORY_UNITS_MAP[record.unit] || {}).label || "-",
};

export const columnPpu = {
  path: "ppu",
  title: <span style={{ whiteSpace: "nowrap" }}>Points Per Unit</span>,
  align: "right",
};

export const ADMIN = [
  columnName,
  columnActive,
  columnHidden,
  columnUnit,
  columnPpu,
];
