// import isArray from 'lodash/isArray';

import getFilterWithCol from "../../helpers/getFilterWithCol";

export const filterSearch = [
  "FilterField",
  {
    id: "search",
    label: null, // 'ID',
    section: "top",
    col: 12,
    buildQuery: (value, builder) =>
      value &&
      builder.add("where", {
        OR: ["code", "description"].map((name) => ({
          [name]: { REGEX: value, OPTIONS: "i" },
        })),
      }),
    getValueForField: (value) => value || "",
    getValueForQuery: (value) => {
      value = !value ? undefined : value.target ? value.target.value : value;
      return !value || !value.length ? undefined : value;
    },
    field: [
      "FieldText",
      {
        name: "search",
        placeholder: "Search by code or description",
      },
    ],
  },
];

export const filterPagination = [
  "FilterPagination",
  {
    id: "pagination",
    section: "bottom",
  },
];

export const ADMIN = [
  ...[[filterSearch, 12]].map(([filter, col]) => getFilterWithCol(filter, col)),

  filterPagination,
];
