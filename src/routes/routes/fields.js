import moment from "moment-timezone";

import React, { useMemo } from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";

import Descriptions from "antd/lib/descriptions";
import List from "antd/lib/list";
import Button from "antd/lib/button";

import { CheckCircleOutlined } from "@ant-design/icons";

import Admin from "hive-admin";

import clickAnchor from "../../helpers/clickAnchor";

import Types from "../../common/modules/types";

export const fieldInfoTitle = [
  "FieldTitle",
  {
    title: "Info",
    style: { marginTop: "20px" },
  },
];

const Info = styled(Descriptions)`
  .ant-descriptions-item {
    padding-bottom: 10px;
    .ant-descriptions-item-label {
      color: ${({ theme }) => theme.less.textColor};
      opacity: 0.5;
    }
  }
`;

export const fieldInfo = [
  "FieldReact",
  {
    name: "info",
    renderContent: (props) => {
      const { data } = props;
      return (
        <Info column={1}>
          <Descriptions.Item label="Created">
            {moment(data.createdAt).format("lll")}
          </Descriptions.Item>
          <Descriptions.Item label="Starts">
            {moment(data.startsAt).format("lll")}
          </Descriptions.Item>
          <Descriptions.Item label="Started">
            {data.started ? moment(data.startedAt).format("lll") : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Completed">
            {data.completed ? moment(data.startsAt).format("lll") : "-"}
          </Descriptions.Item>
          <Descriptions.Item label="Bags">
            {`${data.bags.collected} / ${data.bags.expected}`}
          </Descriptions.Item>
          <Descriptions.Item label="Driver">
            <Link to={`/users/${data.driver._id}`}>{data.driver.name}</Link>
          </Descriptions.Item>
        </Info>
      );
    },
  },
];

export const fieldStopsTitle = [
  "FieldTitle",
  {
    title: "Stops",
  },
];

const StopsItem = styled(List.Item)`
  .ant-list-item-meta-title {
    font-size: 18px;
    font-weight: 600;
  }
  .ant-descriptions-item {
    padding-bottom: 0px;
    .ant-descriptions-item-label {
      color: ${({ theme }) => theme.less.textColor};
      opacity: 0.5;
    }
    .ant-btn {
      margin-top: 8px;
      margin-right: 10px;
      transform: translateY(-2px);
      > i {
        transform: translateY(1px);
      }
      > span {
        margin-left: 3px;
      }
    }
  }
  /* &[data-disabled="true"] {
    opacity: 0.3;
    pointer-events: none;
    filter: grayscale();
  } */
  &[data-disabled="true"] {
    .ant-list-item-meta-title {
      text-decoration: line-through;
    }
  }
`;

const StopsItemIconCompleted = styled(CheckCircleOutlined)`
  color: ${({ theme }) => theme.less.primaryColor};
  margin-right: 10px;
`;

function FieldStops(props) {
  const [actionComplete] = useMemo(
    () => [
      Admin.compileFromLibrary([
        "ActionWithRequest",
        {
          name: "completeStop",
          title: "Complete",
          icon: "check",
          type: "primary",
          size: "small",
          ghost: true,
          getRequestConfig: ({ data, stopId }) => ({
            url: `routes/${data._id}/actions/complete`,
            method: "POST",
            data: { stop: stopId },
          }),
          handleSuccess: (data, actionProps) => actionProps.reload(),
        },
      ]),
    ],
    [],
  );
  const { data, viewer } = props;
  return (
    <List
      dataSource={data.stops}
      renderItem={(item, i) => (
        <StopsItem data-disabled={!!item.completed}>
          <List.Item.Meta
            title={
              <>
                {item.completed ? <StopsItemIconCompleted /> : null}
                {viewer.role === Types.USER_ROLE_CONST.ADMIN &&
                item.customer ? (
                  <Link to={`/users/${item.customer._id || item.customer}`}>
                    {`#${i + 1} ${
                      item.customer && item.customer.name
                        ? item.customer.name
                        : "Customer"
                    }`}
                  </Link>
                ) : (
                  `#${i + 1} ${
                    item.customer && item.customer.name
                      ? item.customer.name
                      : "Customer"
                  }`
                )}
              </>
            }
            description={
              <Descriptions column={1}>
                <Descriptions.Item label="Address">
                  {item.address.lines}
                </Descriptions.Item>
                {item.customer?.phoneNumber ? (
                  <Descriptions.Item label="Phone Number">
                    <a href={`tel://${item.customer.phoneNumber}`}>
                      {item.customer.phoneNumber}
                    </a>
                  </Descriptions.Item>
                ) : null}
                <Descriptions.Item label="Bags">
                  {`${item.bags.collected} / ${item.bags.expected}`}
                </Descriptions.Item>
                {item.completed ? null : (
                  <Descriptions.Item>
                    {actionComplete.render({
                      ...props,
                      stopId: item._id,
                    })}
                    <Button
                      icon="environment"
                      type="primary"
                      size="small"
                      ghost
                      onClick={() =>
                        clickAnchor(
                          // eslint-disable-next-line max-len
                          `https://www.google.com/maps/dir/?api=1&destination=${
                            item.address.coordinates[1]
                          },${item.address.coordinates[0]}`,
                          { target: "_blank", ref: "noopener noreferrer" },
                        )
                      }
                    >
                      Start Navigation
                    </Button>
                  </Descriptions.Item>
                )}
              </Descriptions>
            }
          />
        </StopsItem>
      )}
    />
  );
}

export const fieldStops = [
  "FieldReact",
  {
    name: "stops",
    renderContent: (props) => <FieldStops {...props} />,
  },
];

export const ADMIN = [fieldInfoTitle, fieldInfo, fieldStopsTitle, fieldStops];
