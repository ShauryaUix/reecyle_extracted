import moment from "moment";

import React, { useRef, useMemo, useState } from "react";
import styled from "styled-components";

import Table from "antd/lib/table";
import Divider from "antd/lib/divider";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import TimePicker from "antd/lib/time-picker";
import DatePicker from "antd/lib/date-picker";

import Query from "hive-admin/src/components/Query";

import Admin from "../../../components/Admin";
import Types from "../../../common/modules/types";

import getFilterWithCol from "../../../helpers/getFilterWithCol";

import {
  filterSearch,
  filterCustomersSort,
  filterActiveTier,
  filterAreas,
  filterPagination,
  filterNotSignups,
  filterCustomersPopulate,
} from "../../users/filters";

import { IconWithValue, IconPending, IconCustomers } from "../../users/columns";

export {
  filterSearch,
  filterCustomersSort,
  filterActiveTier,
  filterAreas,
  filterPagination,
  filterNotSignups,
  filterCustomersPopulate,
};

export const [filterCustomersInclude, filterCustomersExclude] = [
  ["customers-in", "IN", "Customers (include)"],
  ["customers-out", "NIN", "Customers (exclude)"],
].map(([id, operator, placeholder]) => [
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
        _id: { [operator]: Array.isArray(value) ? value : [value] },
      }),
    field: [
      "FieldConnectionSelect",
      {
        name: "customers",
        url: "/users/customers",
        placeholder,
        mode: "multiple",
        allowClear: true,
        searchPaths: ["name", "email"],
        getExtraQueryConditions: () => [
          {
            active: true,
            tier: Types.CUSTOMER_TIER_CONST.PREMIUM,
          },
        ],
        getChoiceLabel: (choice) => `${choice.data.name}`,
      },
    ],
  },
]);

const RouteWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-bottom: 24px;
  /* border-radius: ${({ theme }) => theme.less.borderRadius}; */
`;

const RouteDivider = styled(Divider)`
  margin-top: 0px;
`;

const RouteTable = styled(Table)`
  width: 100%;
  margin-bottom: 24px;
  .ant-table {
    border-color: ${({ theme }) => theme.less.borderColor};
    overflow: hidden;
  }
  .ant-table-content > .ant-table-body {
    margin: 0px;
  }
  th,
  td {
    padding: 5.5px 10px !important;
  }
  td .anticon {
    color: ${({ theme }) => theme.less.textColor};
  }
`;

RouteTable.defaultProps = {
  columns: [
    {
      dataIndex: "label",
      width: "100%",
    },
    {
      dataIndex: "customersCount",
      render: (text, record) => (
        <IconWithValue empty={!(record.customersCount > 0)}>
          {`${record.customersCount}`}
          &nbsp;
          <IconCustomers />
        </IconWithValue>
      ),
    },
    {
      dataIndex: "bagsCount",
      render: (text, record) => (
        <IconWithValue empty={!(record.bagsCount > 0)}>
          <span>{`${record.bagsCount}`}</span>
          &nbsp;
          <IconPending />
          &nbsp;
          <span style={{ opacity: 0.4 }}>{`x ${Types.BAG_VOLUME}`}</span>
        </IconWithValue>
      ),
    },
    {
      dataIndex: "bagsVolume",
      render: (text, record) => (
        <IconWithValue empty={!(record.bagsVolume > 0)}>
          {`${record.bagsVolume} l`}
        </IconWithValue>
      ),
    },
  ],
};

const RouteDateTimeRow = styled(Row)`
  /* margin-bottom: 24px; */
`;

const RouteDateTimeCol = styled(Col)`
  margin-bottom: 24px;
`;

const RouteDatePicker = styled(DatePicker)`
  width: 100%;
`;

const RouteDatePickerFooter = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 20px;
  justify-content: center;
`;

const RouteDatePickerFooterAction = styled.div`
  color: ${({ theme }) => theme.less.primaryColor};
  cursor: pointer;
`;

const RouteTimePicker = styled(TimePicker)`
  width: 100%;
`;

const RouteDriverRow = styled(Row)`
  margin-bottom: 24px;
`;

export const filterRoute = [
  "Filter",
  {
    id: "route",
    label: null,
    section: "top",
    buildQuery: () => {},
    propsFromPage: ({ history, loading, reload, client, queryBuilder }) => ({
      history,
      loading,
      reload,
      client,
      queryBuilder,
    }),
    FilterClass: (props) => {
      const dataSourceDefaults = useMemo(
        () => [
          {
            label: "New Route",
            customersCount: 0,
            bagsCount: 0,
            bagsVolume: 0,
          },
          {
            label: "Available",
            customersCount: 0,
            bagsCount: 0,
            bagsVolume: 0,
          },
        ],
        [],
      );
      const dataSourceRef = useRef(dataSourceDefaults);
      const startsAtDefault = useMemo(() => {
        const date = moment().tz(Types.TIMEZONE).hour(9).startOf("hour");
        if (new Date().getHours() > 8) {
          date.add(1, "day");
        }
        return date;
      }, []);
      const [startsAt, setStartsAt] = useState(null);
      const driverField = useMemo(
        () =>
          Admin.compileFromLibrary([
            "FieldConnectionSelect",
            {
              name: "driver",
              label: null,
              // prefix: 'User:',
              placeholder: "Assign to driver",
              allowClear: true,
              searchPaths: ["name"],
              url: "/users/drivers",
              getExtraQueryConditions: () => [{ active: true }],
              getChoiceLabel: (item) => `${item.name}`,
            },
          ]),
        [],
      );
      const [driver, setDriver] = useState();
      const actionCreate = useMemo(
        () =>
          Admin.compileFromLibrary([
            "ActionWithRequest",
            {
              name: "create",
              title: "Create",
              // ghost: true,
              getRequestConfig: (actionProps) => ({
                url: "routes",
                method: "POST",
                data: actionProps.actionData,
              }),
              handleSuccess: (data, actionProps) =>
                actionProps.history.replace(`/routes/${data._id}`),
            },
          ]),
        [],
      );
      return (
        <Query
          url={`users/customers/route?loading=${!!props.loading}&query=${props.queryBuilder.compile()}`}
          client={props.client}
          extractData={(response) =>
            response && response.data
              ? [response.data.route, response.data.available]
              : null
          }
        >
          {({ loading, data }) => {
            if (!loading) {
              if (data) {
                dataSourceRef.current = data;
              } else {
                dataSourceRef.current = dataSourceDefaults;
              }
            }
            return (
              <RouteWrapper>
                <RouteDivider />
                <RouteTable
                  size="small"
                  rowKey="label"
                  pagination={false}
                  showHeader={false}
                  dataSource={dataSourceRef.current}
                />
                <RouteDateTimeRow gutter={20}>
                  <RouteDateTimeCol md={12}>
                    <RouteDatePicker
                      value={startsAt}
                      format="ll"
                      showToday={false}
                      placeholder="Pickup Date"
                      onChange={(date) =>
                        setStartsAt(
                          date
                            ? (startsAt || startsAtDefault)
                                .clone()
                                .tz(Types.TIMEZONE)
                                .year(date.year())
                                .month(date.month())
                                .date(date.date())
                            : null,
                        )
                      }
                      renderExtraFooter={() => (
                        <RouteDatePickerFooter>
                          <RouteDatePickerFooterAction
                            onClick={() =>
                              setStartsAt(
                                (startsAt || startsAtDefault)
                                  .clone()
                                  .date(new Date().getDate()),
                              )
                            }
                          >
                            Today
                          </RouteDatePickerFooterAction>
                          <RouteDatePickerFooterAction
                            onClick={() =>
                              setStartsAt(
                                (startsAt || startsAtDefault)
                                  .clone()
                                  .tz(Types.TIMEZONE)
                                  .date(new Date().getDate())
                                  .add(1, "day"),
                              )
                            }
                          >
                            Tomorrow
                          </RouteDatePickerFooterAction>
                        </RouteDatePickerFooter>
                      )}
                    />
                  </RouteDateTimeCol>
                  <RouteDateTimeCol md={12}>
                    <RouteTimePicker
                      value={startsAt}
                      format="HH:mm"
                      placeholder="Pickup Time"
                      minuteStep={30}
                      onChange={(date) =>
                        setStartsAt(
                          (startsAt || startsAtDefault)
                            .clone()
                            .hour(date.hour())
                            .minute(date.minute())
                            .startOf("minute"),
                        )
                      }
                    />
                  </RouteDateTimeCol>
                </RouteDateTimeRow>
                <RouteDriverRow>
                  {driverField.render({
                    client: props.client,
                    value: driver,
                    onChange: (driverId) => setDriver(driverId),
                  })}
                </RouteDriverRow>
                {actionCreate.render({
                  ...props,
                  disabled:
                    !driver ||
                    !dataSourceRef.current ||
                    !(dataSourceRef.current[0].customersCount > 0),
                  actionData: {
                    customers: dataSourceRef.current[0].customers,
                    startsAt,
                    driver,
                  },
                })}
              </RouteWrapper>
            );
          }}
        </Query>
      );
    },
  },
];

export const filterAvailable = [
  "FilterHidden",
  {
    id: "available",
    section: "bottom",
    build: (builder) => {
      builder.add("where", {
        active: true,
        nextRoute: { EQ: null },
        "bags.pending": { GT: 0 },
        tier: Types.CUSTOMER_TIER_CONST.PREMIUM,
      });
      return builder;
    },
  },
];

export const filterCustomersChecklist = [
  "FilterHidden",
  {
    id: "list",
    section: "bottom",
    build: (builder, filter, value, params) => {
      const ids = value && value.length ? value.split(",") : [];
      const all = `${params.all}` !== "false";
      if (all) {
        builder.add("custom", { customersNin: ids });
      } else {
        builder.add("custom", { customersIn: ids });
      }
    },
  },
];

export const ADMIN_NEW = [
  ...[
    [filterSearch, 12],
    [filterCustomersSort, 12],
    [filterAreas, 24],
    [filterActiveTier, 24],
    [filterCustomersInclude, 12],
    [filterCustomersExclude, 12],
    [filterRoute, 24],
  ].map(([filter, col]) => getFilterWithCol(filter, col)),

  filterPagination,
  filterNotSignups,
  filterAvailable,
  filterCustomersPopulate,
  filterCustomersChecklist,
];
