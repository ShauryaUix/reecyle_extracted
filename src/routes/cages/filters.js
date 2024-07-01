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

export const filterPagination = [
  "FilterPagination",
  {
    id: "pagination",
    section: "bottom",
  },
];

export const filterHiddenPopulate = [
  "FilterHidden",
  {
    id: "filterHiddenPopulate",
    section: "bottom",
    build: (builder) => {
      builder.add("populate", { organization: true });
      builder.add("sort", { name: 1 });
    },
  },
];

export const ADMIN = [
  ...[[filterSearch, 12]].map((args) => getFilterWithCol(...args)),
  filterPagination,
  filterHiddenPopulate,
];
