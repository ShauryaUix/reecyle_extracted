import moment from "moment";

import React from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";

import DeleteOutlined from "@ant-design/icons/DeleteOutlined";

import Admin from "hive-admin";

const Code = styled.code`
  font-size: 90%;
  opacity: 0.8;
`;

const IconDelete = styled(DeleteOutlined)`
  color: ${({ theme }) => theme.less.errorColor};
`;

const deleteAction = Admin.compileFromLibrary([
  "ActionWithRequest",
  {
    name: "delete",
    title: null,
    ghost: true,
    type: "danger",
    icon: "delete",
    size: "small",
    getRequestConfig: (props) => ({
      url: `couponcodes/${props.actionParams.id}`,
      method: "delete",
    }),
    renderAction: (actionProps, instance) => {
      const {
        props: { onClick, disabled },
      } = instance.renderAction(actionProps);
      return <IconDelete onClick={onClick} disabled={disabled} />;
    },
    handleSuccess: (data, props) => props.reload(),
  },
]);

export const columnName = {
  path: "details.name",
  title: "Coupon",
  width: "100%",
  render: (record) => (
    <Link to={`/coupons/${record.coupon || record._id}`}>
      {record.details.name}
    </Link>
  ),
};

export const columnCode = {
  path: "code",
  align: "right",
  render: (record) => <Code>{record.code}</Code>,
};

export const columnPartner = {
  path: "partner",
  title: "Partner",
  render: (record) =>
    record.partner && record.partner._id ? (
      <Link to={`/partners/${record.partner._id}`}>{record.partner.name}</Link>
    ) : (
      record.details.partner
    ),
};

export const columnAvailableCount = {
  path: "availableCount",
  title: "Available",
  align: "right",
  render: (record) => record.availableCount || "-",
};

export const columnTiersAvailableStatus = {
  path: "tiersAvailableStatus",
  title: "Tiers",
  align: "right",
  render: (record) =>
    ({
      ALL: "All",
      PRO_PREMIUM: "Pro and VIP",
      PREMIUM: "VIP only",
      NONE: "None",
    })[record.tiersAvailableStatus],
};

export const columnCreatedAt = {
  path: "createdAt",
  title: "Created",
  align: "right",
  render: (record) => moment(record.createdAt).format("lll"),
};

export const columnPurchasedAt = {
  path: "purchasedAt",
  title: "Purchased At",
  align: "right",
  render: (record) =>
    record.purchasedAt ? moment(record.purchasedAt).format("lll") : "-",
};

export const columnDelete = {
  path: "delete",
  title: null,
  render: (record, index, props) =>
    deleteAction.render({
      ...props,
      actionParams: { id: record._id },
    }),
};

export const columnPurchasedBy = {
  path: "purchasedBy",
  title: "Purchased By",
  render: (record) =>
    record.purchasedBy && record.purchasedBy.name ? (
      <Link to={`/users/${record.purchasedBy._id}`}>
        {record.purchasedBy.name}
      </Link>
    ) : (
      "-"
    ),
};

export const ADMIN = [
  columnName,
  columnPartner,
  columnAvailableCount,
  columnTiersAvailableStatus,
  columnCreatedAt,
];

export const CODES = [
  columnName,
  columnCode,
  columnPartner,
  columnPurchasedBy,
  columnPurchasedAt,
  columnDelete,
];
