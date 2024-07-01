import getFilterWithCol from "../../helpers/getFilterWithCol";

export const filterSearch = [
  "FilterField",
  {
    id: "search",
    label: null,
    section: "top",
    buildQuery: (value, builder) =>
      value && builder.add("where", { name: { REGEX: value, OPTIONS: "i" } }),
    getValueForField: (value) => value || "",
    getValueForQuery: (value) => {
      value = !value ? undefined : value.target ? value.target.value : value;
      return !value || !value.length ? undefined : value;
    },
    field: [
      "FieldText",
      {
        name: "search",
        placeholder: "Search by name",
      },
    ],
  },
];

export const filterStatus = [
  "FilterField",
  {
    id: "status",
    label: null,
    section: "top",
    VALUES_MAP: {
      active: { active: true, serviced: true },
      inactive: { active: true, serviced: false },
      hidden: { active: false },
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
            label: "Active",
            value: "active",
          },
          {
            label: "Inactive",
            value: "inactive",
          },
          {
            label: "Hidden",
            value: "hidden",
          },
        ],
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
  ...[
    [filterSearch, 12],
    [filterStatus, 12],
  ].map((args) => getFilterWithCol(...args)),
  filterPagination,
];
