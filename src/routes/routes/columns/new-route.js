import React, { useMemo } from "react";
import styled from "styled-components";

import queryString from "querystring";
import omit from "lodash/omit";

import { Link, useLocation, useHistory } from "react-router-dom";

import Checkbox from "antd/lib/checkbox";

import {
  columnBags,
  columnArea,
  columnTierStatus,
  columnLastRoute,
} from "../../users/columns";

export { columnBags, columnArea, columnLastRoute };

const ColumnWrapper = styled.div`
  .ant-checkbox-wrapper {
    display: inline;
    margin-right: 20px;
    vertical-align: middle;
    .ant-checkbox {
      transform: translateY(-1px);
    }
  }
  @media (min-width: 769px) {
    white-space: nowrap;
    .ant-checkbox-wrapper {
      margin-right: 10px;
    }
  }
  a,
  span.label {
    vertical-align: middle;
    display: inline;
  }
`;

function ColumnNameTitle() {
  const history = useHistory();
  const location = useLocation();
  const params = useMemo(
    () => queryString.parse(location.search.slice(1)),
    [location.search],
  );
  return (
    <ColumnWrapper>
      <Checkbox
        checked={`${params.all}` !== "false"}
        onChange={(event) =>
          history.replace(
            `${location.pathname}?${queryString.stringify({
              ...omit(params, "all", "list"),
              all: event.target.checked,
            })}`,
          )
        }
      />
      <span className="label">Customer</span>
    </ColumnWrapper>
  );
}

function ColumnNameValue({ record, location, history, params }) {
  const all = `${params.all}` !== "false";
  const inList = params.list && params.list.includes(record._id);
  const checked = all ? (inList ? false : true) : inList ? true : false;
  return (
    <ColumnWrapper>
      <Checkbox
        checked={checked}
        onChange={(event) => {
          let list;
          if (inList) {
            list = (params.list ? params.list.split(",") : []).filter(
              (id) => id !== record._id,
            );
          } else {
            list = params.list ? params.list.split(",") : [];
            list.push(record._id);
          }
          const newParams = { ...omit(params, "list") };
          if (list && list.length) {
            newParams.list = list.join(",");
          }
          history.replace(
            `${location.pathname}?${queryString.stringify(newParams)}`,
          );
        }}
      />
      <Link to={`/users/${record._id}`}>{record.name}</Link>
    </ColumnWrapper>
  );
}

export const columnName = {
  path: "name",
  title: <ColumnNameTitle />,
  width: "100%",
  render: (record, index, props) => (
    <ColumnNameValue
      record={record}
      location={props.location}
      history={props.history}
      params={props.searchParams}
    />
  ),
};

// eslint-disable-next-line import/prefer-default-export
export const ADMIN_NEW = [
  columnName,
  columnTierStatus,
  columnArea,
  columnBags,
  columnLastRoute,
];
