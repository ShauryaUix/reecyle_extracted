import isUndefined from "lodash/isUndefined";

import tests from "../components/helper/tests";

import Types from "../components/types";

const { viewerIsNotAdmin } = tests;

export default [
  "PageSingle",
  {
    icon: "tool",
    path: "/settings",
    title: "Settings",
    headerTitle: "Settings",
    topTitleKey: null,
    hidden: false,
    activity: "edit",
    url: "/settings/general",
    redirect: [["redirect.unauthorized"]],
    actions: [["ActionSave"]],
    skip: [viewerIsNotAdmin],
    fields: [
      [
        "FieldTitle",
        {
          title: "Signing Up",
          icon: null,
          style: { fontSize: "26px" },
        },
      ],
      [
        "FieldSwitch",
        {
          name: "signup.open",
          label: null,
          inlineLabelBefore: "Allow Signups?",
        },
      ],
      [
        "FieldTextArea",
        {
          name: "signup.blacklist",
          label: null,
          // eslint-disable-next-line max-len
          placeholder:
            "Blacklisted signup domains, eg: gmail.com, yahoo.com, etc.",
          autoSize: { minRows: 3 },
          prepareValueForForm: (event) =>
            isUndefined(event.target.value) || !event.target.value
              ? " "
              : event.target.value,
          prepareValueForInput: (value) => (value === " " ? undefined : value),
        },
      ],
      [
        "FieldTitle",
        {
          title: "Tiers",
          icon: null,
          style: { fontSize: "26px" },
        },
      ],
      [
        "FieldText",
        {
          name: "tierTrialDays",
          align: "right",
          label: null,
          type: "number",
          prefix: "Trial Period:",
          addonAfter: "days",
          // initialValue: 7,
        },
      ],
      [
        "FieldText",
        {
          name: "tierGraceDays",
          align: "right",
          label: null,
          type: "number",
          prefix: "Grace Period:",
          addonAfter: "days",
          // initialValue: 7,
        },
      ],
      [
        "FieldText",
        {
          name: "tierPaymentTryEveryHours",
          align: "right",
          label: null,
          type: "number",
          prefix: "Retry Charge Every:",
          addonAfter: "hours",
          // initialValue: 7,
        },
      ],
      [
        "FieldText",
        {
          name: "tierPaymentTryMaxTimes",
          align: "right",
          label: null,
          type: "number",
          prefix: "Retry Charge Max:",
          addonAfter: "times",
          // initialValue: 7,
        },
      ],
      ...Types.CUSTOMER_TIER_LIST.reduce((agr, tier) => {
        agr.push(
          [
            "FieldTitle",
            {
              title: tier.label,
              icon: null,
              style: { fontSize: "20px" },
            },
          ],
          [
            "FieldText",
            {
              name: `tiers.${tier.id}.ppu`,
              label: null,
              prefix: "Points Multiplier:",
              type: "number",
              initialValue: 0,
              align: "right",
              addonAfter: "Points",
            },
          ],
          [
            "FieldText",
            {
              name: `tiers.${tier.id}.price`,
              label: null,
              prefix: "Price:",
              type: "number",
              initialValue: 0,
              align: "right",
              addonAfter: Types.CURRENCY,
              // skip: tier.free ? [() => true] : [],
              disabled: [() => tier.free === true],
            },
          ],
          [
            "FieldSortableList",
            {
              name: `tiers.${tier.id}.features`,
              label: null,
              addButtonLabel: "Add Feature",
              fields: [
                [
                  "FieldText",
                  {
                    name: "name",
                    label: null,
                    placeholder: "Feature",
                    style: { marginTop: "-12px" },
                  },
                ],
              ],
            },
          ],
        );
        return agr;
      }, []),
    ],
  },
];
