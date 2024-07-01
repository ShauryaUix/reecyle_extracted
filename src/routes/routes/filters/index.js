import Admin from "hive-admin";

import getFilterWithCol from "../../../helpers/getFilterWithCol";

import {
  filterCustomersInclude as filterCustomersIncludeDefault,
  filterCustomersExclude as filterCustomersExcludeDefault,
} from "./new-route";

import tests from "../../../helpers/tests";

const { viewerIsNotAdmin } = tests;

export const filterStatus = [
  "FilterField",
  {
    id: "status",
    label: null,
    section: "top",
    VALUES_MAP: {
      any: null,
      scheduled: { started: { EQ: false }, completed: { EQ: false } },
      started: { started: { EQ: true } },
      complete: { completed: { EQ: true } },
    },
    buildQuery: (value, builder, filter) =>
      filter.VALUES_MAP[value]
        ? builder.add("where", { ...filter.VALUES_MAP[value] })
        : null,
    getValueForField: (value) => (value && value.length ? value : "any"),
    field: [
      "FieldSelect",
      {
        name: "status",
        placeholder: "Status",
        prepareValueForInput: (value) => (value ? value : "any"),
        initialValue: "any",
        choices: [
          {
            label: "Any Status",
            value: "any",
          },
          {
            label: "Scheduled",
            value: "scheduled",
          },
          {
            label: "Started",
            value: "started",
          },
          {
            label: "Complete",
            value: "complete",
          },
        ],
      },
    ],
  },
];

export const filterDriver = [
  "FilterField",
  {
    id: "driver",
    label: null,
    section: "top",
    propsFromPage: (props) => ({ client: props.client }),
    buildQuery: (value, builder) =>
      value &&
      value.length &&
      builder.add("where", {
        driver: { IN: Array.isArray(value) ? value : [value] },
      }),
    field: [
      "FieldConnectionSelect",
      {
        name: "drivers",
        url: "/users/drivers",
        placeholder: "Drivers",
        mode: "multiple",
        allowClear: true,
        searchPaths: ["name", "email"],
        getChoiceLabel: (choice) => `${choice.data.name}`,
      },
    ],
    skip: Admin.compileFromLibrary([viewerIsNotAdmin], true),
  },
];

export const [filterCustomersInclude, filterCustomersExclude] = [
  [filterCustomersIncludeDefault, "IN"],
  [filterCustomersExcludeDefault, "NIN"],
].map(([[filter, config], operator]) => [
  filter,
  {
    ...config,
    buildQuery: (value, builder) =>
      value &&
      value.length &&
      builder.add("where", {
        "stops.customer": {
          [operator]: Array.isArray(value) ? value : [value],
        },
      }),
    skip: Admin.compileFromLibrary([viewerIsNotAdmin], true),
  },
]);

export const filterPagination = [
  "FilterPagination",
  {
    id: "pagination",
    section: "bottom",
  },
];

export const filterSortDefault = [
  "FilterHidden",
  {
    id: "sortDefault",
    section: "bottom",
    build: (builder) => builder.add("sort", { startsAt: -1, createdAt: -1 }),
  },
];

export const filterPopulateDriver = [
  "FilterHidden",
  {
    id: "populateDriver",
    section: "bottom",
    build: (builder) => builder.add("populate", { driver: true }),
  },
];

export { ADMIN_NEW } from "./new-route";

export const ADMIN = [
  ...[
    [filterStatus, 12],
    [filterDriver, 12],
    [filterCustomersInclude, 12],
    [filterCustomersExclude, 12],
  ].map((args) => getFilterWithCol(...args)),
  filterPagination,
  filterPopulateDriver,
  filterSortDefault,
];
