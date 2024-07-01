import moment from "moment";

import React, { useMemo, useState } from "react";

import styled, { css } from "styled-components";

import { DeleteOutlined } from "@ant-design/icons";

import Radio from "antd/lib/radio";
import Table from "antd/lib/table";
import Pagination from "antd/lib/pagination";

import Admin from "hive-admin";
import Query from "hive-admin/src/components/Query";

import Coupon, {
  StandaloneWrapper as StandaloneCouponWrapper,
} from "../dashboard/customers/components/Coupon";

import getFilterWithCol from "../../helpers/getFilterWithCol";

import tests from "../../helpers/tests";

import Types from "../../common/modules/types";

const RadioComponent = styled(Radio.Group)`
  width: 100%;
  display: flex;
  height: auto;
  .ant-radio-button-wrapper {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    padding: 4px 8px;
    height: auto;
    line-height: 1.6;
    text-align: center;
  }
`;

const IconDelete = styled(DeleteOutlined)`
  color: ${({ theme }) => theme.less.errorColor};
  ${({ disabled }) =>
    disabled &&
    css`
      color: ${({ theme }) => theme.less.textColor};
      opacity: 0.4;
      pointer-events: none;
    `}
`;

export const fieldImage = [
  "FieldUploadRefs",
  {
    name: "details.image",
    label: "Image",
    accept: "image/png",
    transformations: [
      // TODO check pictures max width
      ["GM", { command: "compress", maxWidth: 700 }],
    ],
    rules: [["validation.isRequired"]],
  },
];

export const fieldGallery = [
  "FieldUploadRefs",
  {
    name: "details.gallery",
    label: "Gallery",
    maxCount: 10,
    accept: "image/jpg,image/jpeg,image/png",
    transformations: [
      // TODO check pictures max width
      ["GM", { command: "compress", maxWidth: 700 }],
    ],
  },
];

export const fieldCoupon = [
  "FieldReact",
  {
    label: null,
    // eslint-disable-next-line arrow-body-style
    renderContent: (props) => {
      return (
        <Query
          client={props.client}
          url={`partners/${props.form.getFieldValue("partner") || "null"}`}
        >
          {(queryProps) => {
            const partner =
              queryProps.data && queryProps.data.data
                ? queryProps.data.data
                : { name: "Partner" };
            const image = props.form.getFieldValue("details.image") || {
              src: null,
            };
            return (
              <StandaloneCouponWrapper>
                <Coupon
                  type="vertical"
                  image={image.src}
                  color={props.form.getFieldValue("details.color")}
                  colorStyle={props.form.getFieldValue("details.colorStyle")}
                  title={props.form.getFieldValue("details.name")}
                  description={partner.name}
                  points={Types.decimalizeInt(
                    parseFloat(props.form.getFieldValue("details.price")),
                  )}
                />
              </StandaloneCouponWrapper>
            );
          }}
        </Query>
      );
    },
  },
];

export const fieldPartner = [
  "FieldConnectionSelect",
  {
    name: "partner",
    label: null,
    prefix: "Partner:",
    placeholder: "Who is issuing the coupon?",
    allowClear: true,
    searchPaths: ["name"],
    url: "/partners",
    // getExtraQueryConditions: () => ([{ active: true }]),
    getChoiceLabel: (item) => `${item.name}`,
    disabled: [tests.isNotCreateActivity],
    virtual: [tests.isNotCreateActivity],
  },
];

export const fieldDetailsPrice = [
  "FieldText",
  {
    name: "details.price",
    label: null,
    type: "number",
    prefix: "Price:",
    placeholder: "Number of points deducted",
    addonAfter: "points",
    inputMode: "decimal",
    rules: [["validation.isRequired"], ["validation.isNumber"]],
  },
];

export const fieldDetailsType = [
  "FieldSelect",
  {
    name: "details.type",
    label: null,
    prefix: "Code Type:",
    placeholder: "Type of unique code coupon holds",
    initialValue: Types.COUPON_TYPES_LIST[0].id,
    choices: Types.COUPON_TYPES_LIST.map(({ id: value, label }) => ({
      label,
      value,
    })),
    rules: [["validation.isRequired"]],
    disabled: [tests.isNotCreateActivity],
  },
];

export const fieldDetailsName = [
  "FieldText",
  {
    name: "details.name",
    label: null,
    prefix: "Name:",
    placeholder: "-20%",
    rules: [["validation.isRequired"]],
  },
];

export const fieldDetailsTerms = [
  "FieldText",
  {
    name: "details.terms",
    label: null,
    prefix: "Terms:",
    placeholder: "eg. On 200 AED and more",
    rules: [],
  },
];

export const fieldDetailsDescription = [
  "FieldTextArea",
  {
    name: "details.description",
    label: null,
    placeholder: "Coupon Description",
    autoSize: { minRows: 2 },
  },
];

export const fieldDetailsColor = [
  "FieldColorPicker",
  {
    name: "details.color",
    label: null,
    prefix: "Color:",
    initialValue: "#98DE3C",
    rules: [["validation.isRequired"]],
  },
];

export const fieldDetailsColorStyle = [
  "FieldRadio",
  {
    name: "details.colorStyle",
    label: null,
    initialValue: 1,
    Component: RadioComponent,
    choices: Types.COUPON_COLOR_STYLES_LIST.map(({ id, label }) => ({
      label,
      value: id,
    })),
    rules: [["validation.isRequired"]],
  },
];

export const fieldTiersAvailableStatus = [
  "FieldRadio",
  {
    name: "tiersAvailableStatus",
    label: null,
    initialValue: "ALL",
    Component: RadioComponent,
    choices: [
      ["ALL", "All"],
      ["PRO_PREMIUM", "Pro and VIP"],
      ["PREMIUM", "VIP only"],
      ["NONE", "None"],
    ].map(([value, label]) => ({
      value,
      label,
    })),
    rules: [["validation.isRequired"]],
  },
];

export const fieldCodesTitle = [
  "FieldTitle",
  {
    title: "Coupon Codes",
    style: { marginTop: "20px" },
    skip: [tests.isNotEditActivity],
  },
];

const CouponCodesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const CouponCodesTable = styled(Table)`
  width: 100%;
  .ant-table-body {
    margin: 0px !important;
  }
  td,
  th {
    white-space: nowrap;
  }
`;

const CouponCodesColumnCode = styled.code`
  font-weight: 100;
  opacity: 0.7;
`;

const CouponCodesPagination = styled(Pagination)`
  display: flex;
  max-width: 100%;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
`;

function CouponCodes({ coupon, client, queryRef, adminProps }) {
  const [pageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [actionDelete] = useMemo(
    () =>
      Admin.compileFromLibrary(
        [
          [
            "ActionWithRequest",
            {
              renderAction: (actionProps, instance) => {
                const {
                  props: { onClick, disabled },
                } = instance.renderAction(actionProps);
                return <IconDelete onClick={onClick} disabled={disabled} />;
              },
              getRequestConfig: (props) => ({
                url: `couponcodes/${props.actionParams.id}`,
                method: "delete",
              }),
              handleSuccess: (data, actionProps) => actionProps.reload(),
            },
          ],
        ],
        true,
      ),
    [],
  );
  const columns = useMemo(
    () => [
      {
        key: "code",
        title: "Code",
        width: "100%",
        render: (text, record) => (
          <CouponCodesColumnCode>{record.code}</CouponCodesColumnCode>
        ),
      },
      {
        key: "purchasedAt",
        title: "Purchased At",
        align: "right",
        render: (text, record) =>
          record.purchasedAt ? moment(record.purchasedAt).format("lll") : "-",
      },
      {
        key: "actions",
        title: null,
        align: "right",
        render: (text, record) =>
          actionDelete.render({
            ...adminProps,
            actionParams: { id: record._id },
          }),
      },
    ],
    [actionDelete, adminProps],
  );
  if (!coupon || !coupon.partner) {
    return null;
  }
  return (
    <Query
      ref={queryRef}
      client={client}
      url={`couponcodes/?query=${btoa(
        JSON.stringify({
          where: { coupon: coupon._id },
          sort: { createdAt: 1 },
          skip: pageSize * page,
        }),
      )}`}
    >
      {({ data }) => {
        if (!data || !data.data) {
          return null;
        }
        return (
          <CouponCodesWrapper>
            <CouponCodesTable
              rowKey="_id"
              size="small"
              pagination={false}
              columns={columns}
              dataSource={data.data.data}
            />
            <CouponCodesPagination
              pageSize={pageSize}
              total={data.data.count}
              current={page + 1}
              onChange={(newPage) => setPage(newPage - 1)}
              size="small"
            />
          </CouponCodesWrapper>
        );
      }}
    </Query>
  );
}

export const fieldCodes = [
  "FieldReact",
  {
    label: null,
    renderContent: (props) => {
      if (!props.data || !props.data.partner) {
        return null;
      }
      return (
        <CouponCodes
          queryRef={props.couponCodesQueryRef}
          client={props.client}
          coupon={props.data}
          adminProps={props}
        />
      );
    },
    skip: [tests.isNotEditActivity],
  },
];

export const ADMIN = [
  fieldCoupon,
  ...[
    [fieldImage, 5],
    [fieldGallery, 19],
    [fieldDetailsName, 12],
    [fieldPartner, 12],
    [fieldDetailsType, 12],
    [fieldDetailsPrice, 12],
    [fieldDetailsColor, 12],
    [fieldDetailsColorStyle, 12],
  ].map((args) => getFilterWithCol(...args)),
  fieldDetailsTerms,
  fieldDetailsDescription,
  fieldTiersAvailableStatus,
  fieldCodesTitle,
  fieldCodes,
];
