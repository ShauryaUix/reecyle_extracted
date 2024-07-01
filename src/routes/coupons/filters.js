import React, { cloneElement } from "react";
import styled from "styled-components";

import Form from "antd/lib/form";
import Button from "antd/lib/button";

import Admin from "hive-admin";
import Filter from "hive-admin/src/components/Filter";

import tests from "../../helpers/tests";

import getFilterWithCol from "../../helpers/getFilterWithCol";

import Types from "../../common/modules/types";

// eslint-disable-next-line arrow-body-style
const StyledAction = styled(({ children, scale, ...props }) => {
  return cloneElement(children, props);
})`
  i {
    transform: scale(${({ scale }) => scale});
  }
`;
StyledAction.defaultProps = {
  scale: 1,
};

export const filterSearch = [
  "FilterField",
  {
    id: "search",
    label: null,
    section: "top",
    buildQuery: (value, builder) =>
      value &&
      builder.add("where", {
        OR: [
          "details.name",
          "details.partner",
          "details.tagline",
          "details.disclaimer",
        ].map((path) => ({ [path]: { REGEX: value, OPTIONS: "i" } })),
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
        placeholder: "Search coupons",
      },
    ],
  },
];

export const filterPartner = [
  "FilterField",
  {
    id: "partner",
    label: null,
    section: "top",
    propsFromPage: (props) => ({ client: props.client }),
    buildQuery: (value, builder) => {
      builder.add("sort", { name: 1 });
      value &&
        value.length &&
        builder.add("where", {
          partner: { IN: Array.isArray(value) ? value : [value] },
        });
    },
    field: [
      "FieldConnectionSelect",
      {
        name: "partner",
        url: "/partners",
        placeholder: "Partner",
        // mode: 'multiple',
        allowClear: true,
        searchPaths: ["name"],
        getChoiceLabel: (choice) => `${choice.data.name}`,
      },
    ],
  },
];

export const filterTiersAvailable = [
  "FilterField",
  {
    id: "tiers",
    label: null,
    section: "top",
    VALUES_MAP: {
      all: Types.CUSTOMER_TIER.reduce((agr, tier) => {
        agr[`tiers.${tier}.available`] = true;
        return agr;
      }, {}),
      propremium: Types.CUSTOMER_TIER.reduce((agr, tier) => {
        if (tier !== "REGULAR") {
          agr[`tiers.${tier}.available`] = true;
        } else {
          agr[`tiers.${tier}.available`] = false;
        }
        return agr;
      }, {}),
      premium: Types.CUSTOMER_TIER.reduce((agr, tier) => {
        if (tier === "PREMIUM") {
          agr[`tiers.${tier}.available`] = true;
        } else {
          agr[`tiers.${tier}.available`] = false;
        }
        return agr;
      }, {}),
      none: Types.CUSTOMER_TIER.reduce((agr, tier) => {
        if (tier !== "REGULAR") {
          agr[`tiers.${tier}.available`] = false;
        }
        return agr;
      }, {}),
    },
    buildQuery: (value, builder, filter) =>
      filter.VALUES_MAP[value]
        ? builder.add("where", { ...filter.VALUES_MAP[value] })
        : null,
    getValueForField: (value) => (value && value.length ? value : null),
    field: [
      "FieldSelect",
      {
        name: "tiers",
        placeholder: "Tiers Available",
        prepareValueForInput: (value) => (value ? value : undefined),
        allowClear: true,
        choices: [
          ["all", "All"],
          ["propremium", "Pro and VIP"],
          ["premium", "VIP only"],
          ["none", "None"],
        ].map(([value, label]) => ({
          value,
          label,
        })),
      },
    ],
  },
];

export const filterPurchasedBy = [
  "FilterField",
  {
    id: "purchased-by",
    label: null,
    section: "top",
    propsFromPage: (props) => ({ client: props.client }),
    buildQuery: (value, builder) => {
      builder.add("sort", { name: 1 });
      value &&
        value.length &&
        builder.add("where", {
          purchasedBy: { IN: Array.isArray(value) ? value : [value] },
        });
    },
    field: [
      "FieldConnectionSelect",
      {
        name: "purchased-by",
        url: "/users/customers",
        placeholder: "Customer",
        // mode: 'multiple',
        allowClear: true,
        searchPaths: ["name", "email"],
        getChoiceLabel: (choice) => `${choice.data.name}`,
      },
    ],
    skip: Admin.compileFromLibrary([tests.viewerIsNotAdmin], true),
  },
];

export const filterNewUsedCodes = [
  (
    (FilterClass) => (config) =>
      FilterClass.create(config)
  )(
    class FilterNewUsedCodes extends Filter {
      render() {
        return (
          <Form.Item key="used" label={null}>
            <Button
              type="primary"
              ghost
              block
              onClick={() =>
                this.props.onChange(
                  "used",
                  `${this.props.value}` === "true" ? undefined : "true",
                )
              }
            >
              {`${this.props.value}` === "true"
                ? "See New Coupons"
                : "See Used Coupons"}
            </Button>
          </Form.Item>
        );
      }
    },
  ),
  {
    id: "used",
    label: null,
    section: "top",
    propsFromPage: ({ history, searchParams }) => ({
      history,
      searchParams,
    }),
    buildQuery: (value, builder) =>
      builder.add(
        "where",
        `${value}` === "true"
          ? { redeemedAt: { NE: null } }
          : { redeemedAt: { EQ: null } },
      ),
  },
];

export const filterPagination = [
  "FilterPagination",
  {
    id: "pagination",
    section: "bottom",
  },
];

export const filterHiddenCoupons = [
  "FilterHidden",
  {
    id: "filterHiddenCoupons",
    section: "bottom",
    build: (builder) => {
      builder.add("populate", { partner: true });
      builder.add("sort", { createdAt: -1 });
    },
  },
];

export const filterHiddenCodes = [
  "FilterHidden",
  {
    id: "filterHiddenCodes",
    section: "bottom",
    build: (builder, filter, value, params, props) => {
      if (
        props.pageProps.viewer &&
        props.pageProps.viewer.role === Types.USER_ROLE_CONST.ADMIN
      ) {
        builder.add("populate", { partner: true, purchasedBy: true });
      }
      builder.add("where", { purchasedBy: { NE: null } });
      builder.add(
        "sort",
        `${params.used}` === "true" ? { redeemedAt: -1 } : { purchasedAt: -1 },
      );
    },
  },
];

export const ADMIN = [
  ...[
    [filterSearch, 12],
    [filterPartner, 12],
    [filterTiersAvailable, 24],
  ].map((args) => getFilterWithCol(...args)),
  filterPagination,
  filterHiddenCoupons,
];

export const CODES = [
  ...[
    [filterSearch, 12],
    [filterPartner, 12],
    [filterPurchasedBy, 24],
    [filterNewUsedCodes, 24],
  ].map((args) => getFilterWithCol(...args)),
  filterPagination,
  filterHiddenCodes,
];
