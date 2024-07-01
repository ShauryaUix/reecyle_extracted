import startCase from "lodash/startCase";
import moment from "moment";

import React from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";

import FieldRadio from "hive-admin/src/components/FieldRadio";

import { getLinkWithSearchFields } from "../../../components/Links";

import clickAnchor from "../../../helpers/clickAnchor";
import getFilterWithCol from "../../../helpers/getFilterWithCol";

const getValueForFieldDefault = (value) =>
  value && value.length ? value : undefined;

const RadioComponent = styled(FieldRadio.config.Component)`
  display: flex;
  width: 100%;
  > .ant-radio-button-wrapper {
    flex: 1;
    flex-shrink: 1;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: auto;
    line-height: 100%;
    display: flex;
    padding: 8px 5px;
    white-space: nowrap;
  }
`;

export const [filterCustomer, filterSorter, filterOrganization, filterCage] = [
  ["customer", "/users/customers"],
  ["sorter", "/users/sorters", "author"],
  ["organization", "/organizations"],
  ["cage", "/cages"],
].map(([id, url, key]) => [
  "FilterField",
  {
    id,
    label: null,
    section: "top",
    propsFromPage: (props) => ({ client: props.client }),
    buildQuery: (value, builder) =>
      value &&
      value.length &&
      builder.add("where", {
        [key || id]: { IN: Array.isArray(value) ? value : [value] },
      }),
    getValueForField: getValueForFieldDefault,
    field: [
      "FieldConnectionSelect",
      {
        name: id,
        url,
        placeholder: startCase(id),
        mode: "multiple",
        allowClear: true,
        searchPaths: ["name"],
        // getChoiceLabel: choice => `${(choice.data.name)}`,
      },
    ],
  },
]);

const filterDatesConfigGetThis = (now, id, span) =>
  id === "from" ? now.startOf(span) : now.endOf(span);

const filterDatesConfig = [
  [
    "this",
    [
      ["Day", filterDatesConfigGetThis, "day"],
      ["Week", filterDatesConfigGetThis, "week"],
      ["Month", filterDatesConfigGetThis, "month"],
      ["Year", filterDatesConfigGetThis, "year"],
    ],
  ],
];

export const filterPeriod = [
  "FilterField",
  {
    id: "period",
    label: null,
    section: "top",
    buildQuery: (value, builder, _1, _2, { pageProps }) => {
      if (value !== "custom") {
        const now = moment();
        const dateKey =
          pageProps.searchParams.date === "completed"
            ? "completedAt"
            : pageProps.searchParams.data === "approved"
              ? "approvedAt"
              : "createdAt";
        builder.add("where", {
          [dateKey]: {
            GTE: now
              .clone()
              .startOf("day")
              .startOf(value === "week" ? "week" : "month")
              .toJSON(),
          },
        });
        builder.add("where", {
          [dateKey]: {
            LTE: now
              .clone()
              .endOf("day")
              .endOf(value === "week" ? "week" : "month")
              .toJSON(),
          },
        });
      }
    },
    getValueForField: (value) => (value && value.length ? value : "month"),
    field: [
      "FieldRadio",
      {
        name: "period",
        label: null,
        initialValue: "month",
        choices: [
          {
            label: "This Week",
            value: "week",
          },
          {
            label: "This Month",
            value: "month",
          },
          {
            label: "Custom Period",
            value: "custom",
          },
        ],
        Component: RadioComponent,
      },
    ],
  },
];

export const [filterFrom, filterTo] = [
  ["from", "After this date", "GTE"],
  ["to", "Before this date", "LTE"],
].map(([id, placeholder, operator]) => [
  "FilterField",
  {
    id,
    label: null,
    section: "top",
    skip: [(props) => props.searchParams.period !== "custom"],
    buildQuery: (value, builder, _1, _2, { pageProps }) => {
      if (
        value &&
        pageProps &&
        (!pageProps.searchParams.period ||
          pageProps.searchParams.period === "custom")
      ) {
        const dateKey =
          pageProps.searchParams.date === "completed"
            ? "completedAt"
            : "createdAt";
        builder.add("where", { [dateKey]: { [operator]: value } });
      }
    },
    getValueForField: (value) => (value ? moment(value) : undefined),
    getValueForQuery: (value) =>
      value
        ? filterDatesConfigGetThis(moment(value), id, "day").toJSON()
        : undefined,
    field: [
      "FieldDatePicker",
      {
        name: id,
        placeholder,
        format: "ll",
        showToday: false,
        renderExtraFooter: () => {
          const now = moment();
          return filterDatesConfig.map(([period, options]) => (
            <div key={period}>
              <span>
                {`${
                  id === "from" ? `Start of ${period}: ` : `End of ${period}: `
                }`}
              </span>
              {options.reduce((agr, [label, getter, ...args], i, array) => {
                agr.push(
                  <span key={label}>
                    <Link
                      to={getLinkWithSearchFields(
                        // eslint-disable-next-line no-undef
                        window.location,
                        [
                          {
                            name: id,
                            value: getter(moment(now), id, ...args).toJSON(),
                            replace: true,
                          },
                        ],
                        { pathname: "/orders" },
                      )}
                    >
                      {/* eslint-disable-next-line jsx-a11y/interactive-supports-focus, jsx-a11y/click-events-have-key-events */}
                      <span
                        role="button"
                        onClick={() => {
                          if (document.activeElement) {
                            document.activeElement.blur();
                          }
                        }}
                      >
                        {label}
                      </span>
                    </Link>
                  </span>,
                );
                if (i < array.length - 1) {
                  agr.push(<span key={`sep${label}`}> / </span>);
                }
                return agr;
              }, [])}
            </div>
          ));
        },
      },
    ],
  },
]);

export const [filterActionExport, filterActionExportNoUsers] = [
  ["export", "Export", true],
  ["export-waste-only", "Export Waste Only", false],
].map(([id, title, users]) => [
  "FilterField",
  {
    id,
    name: id,
    label: null,
    section: "top",
    buildQuery: () => {},
    // eslint-disable-next-line max-len
    propsFromPage: ({ client, queryBuilder, restBaseRoot, searchParams }) => ({
      client,
      queryBuilder,
      restBaseRoot,
      searchParams,
    }),
    field: [
      "Action",
      {
        name: id,
        title,
        icon: "download",
        type: "default",
        style: { width: "100%" },
        onClick: (props) =>
          clickAnchor({
            url: `${props.restBaseRoot}/logentries/sort/report`,
            query: {
              access_token: props.client.getAccessToken(),
              query: JSON.stringify({
                ...props.queryBuilder.build(),
                users,
              }),
            },
          }),
      },
    ],
  },
]);

export const filterPagination = [
  "FilterPagination",
  {
    id: "pagination",
    section: "bottom",
  },
];

export const filterPopulate = [
  "FilterHidden",
  {
    id: "populate",
    section: "bottom",
    build: (builder) =>
      builder.add("populate", {
        customer: true,
        organization: true,
        cage: true,
      }),
  },
];

export const filterSort = [
  "FilterHidden",
  {
    id: "sort",
    section: "bottom",
    build: (builder) => builder.add("sort", { createdAt: -1 }),
  },
];

export const ADMIN = [
  ...[
    [filterPeriod, 24],
    [filterFrom, 12],
    [filterTo, 12],
    [filterCustomer, 12],
    [filterSorter, 12],
    [filterOrganization, 12],
    [filterCage, 12],
    [filterActionExport, 12],
    [filterActionExportNoUsers, 12],
  ].map((args) => getFilterWithCol(...args)),

  filterPagination,
  filterPopulate,
  filterSort,
];
