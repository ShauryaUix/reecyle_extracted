import styled from "styled-components";

import Input from "hive-admin/src/components/Input/Input";

import Types from "../../common/modules/types";

const InputUppercase = styled(Input)`
  text-transform: uppercase;
`;

const activityIsNotCreate = ({ activity }) => activity !== "create";

export const fieldCode = [
  "FieldText",
  {
    name: "code",
    label: null,
    prefix: "Code:",
    Component: InputUppercase,
    rules: [["validation.isRequired"]],
    skip: [activityIsNotCreate],
  },
];

export const fieldDescription = [
  "FieldText",
  {
    name: "description",
    label: null,
    prefix: "Tagline:",
  },
];

export const fieldAmountFixed = [
  "FieldText",
  {
    name: "amountFixed",
    label: null,
    prefix: "Fixed Amount:",
    initialValue: 0,
    type: "number",
    align: "right",
    addonAfter: Types.CURRENCY,
  },
];

export const fieldAmountPercentage = [
  "FieldText",
  {
    name: "amountPercentage",
    label: null,
    prefix: "Percentage Amount",
    initialValue: 0,
    type: "number",
    align: "right",
    addonAfter: "%",
  },
];

export const fieldSignupsCountMax = [
  "FieldText",
  {
    name: "signupsCountMax",
    label: null,
    prefix: "Max Signups:",
    type: "number",
    align: "right",
    initialValue: 0,
    placeholder: 0,
    info: "Number of customers that can signup using this code",
    description: "*set to 0 for unlimited usage",
  },
];

export const fieldPaymentsPerAccountCountMax = [
  "FieldText",
  {
    name: "paymentsPerAccountCountMax",
    label: null,
    prefix: "Max Payments per Account:",
    type: "number",
    align: "right",
    initialValue: 0,
    placeholder: 0,
    // eslint-disable-next-line max-len
    info: "Number of times each customer will have their monthly bill reduced",
    description: "*set to 0 for unlimited usage",
  },
];

export const ADMIN = [
  fieldCode,
  fieldDescription,
  fieldAmountFixed,
  fieldAmountPercentage,
  [
    "FieldTitle",
    {
      title: "Limits",
    },
  ],
  fieldSignupsCountMax,
  fieldPaymentsPerAccountCountMax,
];
