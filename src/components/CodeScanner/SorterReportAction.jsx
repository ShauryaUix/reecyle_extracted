import moment from "moment";

import React, { useState } from "react";
import styled from "styled-components";

import Button from "antd/lib/button";
import DatePicker from "antd/lib/date-picker";

import { Tooltip } from "../common/components/Popover";
import clickAnchor from "../helpers/clickAnchor";

import Types from "../common/modules/types";

const { SERVER_URL } = Types;
const { REACT_APP_API_PATH } = process.env;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DatePickerWrapper = styled.div`
  span.ant-calendar-picker {
    width: 100%;
  }
`;

const filterDatesConfigGetThis = (now, id, span) =>
  id === "from"
    ? now.startOf(span).startOf("day")
    : now.endOf(span).endOf("day");

const filterDatesConfig = [
  [
    "this",
    [
      ["Day", filterDatesConfigGetThis, "day"],
      ["Week", filterDatesConfigGetThis, "week"],
      ["Month", filterDatesConfigGetThis, "month"],
      ["Year", filterDatesConfigGetThis, "year"],
    ],
    // ], [
    //   'last',
    //   [
    //     ['Billing Period', (now, id) => {
    //       now = moment(now);
    //       const ms = now.valueOf();
    //       const dates = [10, 25].map(d => moment(now).date(d));
    //       let de = dates.length - 1;
    //       // eslint-disable-next-line no-constant-condition
    //       while (true) {
    //         const dateEnd = (
    //           moment(dates[de])
    //           .subtract(1, 'day')
    //           .endOf('day')
    //         );
    //         const dateEndMs = dateEnd.valueOf();
    //         const ds = ((dates.length + de) - 1) % dates.length;
    //         if (dateEndMs < ms) {
    //           const dateStart = (
    //             moment(dates[ds])
    //             .startOf('day')
    //           );
    //           while (dateStart.valueOf() >= dateEndMs) {
    //             dateStart.subtract(1, 'month');
    //           }
    //           return (
    //               id === 'from'
    //             ? dateStart
    //             : dateEnd
    //           );
    //         }
    //         dates[de].subtract(1, 'month');
    //         de = ds;
    //       }
    //     }],
    //   ],
  ],
];

const InputDatePicker = ({ type, placeholder, value, onChange }) => (
  <DatePickerWrapper>
    <DatePicker
      value={value}
      onChange={(date) =>
        onChange(
          !date
            ? date
            : type === "from"
              ? date.startOf("day")
              : date.endOf("day"),
        )
      }
      placeholder={placeholder}
      format="ll"
      showToday={false}
      showTime={false}
      renderExtraFooter={() => {
        const now = moment();
        return filterDatesConfig.map(([period, options]) => (
          <div key={period}>
            <span>
              {`${
                type === "from" ? `Start of ${period}: ` : `End of ${period}: `
              }`}
            </span>
            {options.reduce((agr, [label, getter, ...args], i, array) => {
              agr.push(
                <span key={label}>
                  <a
                    href="#"
                    onClick={(ev) => {
                      ev.preventDefault();
                      const newValue = getter(moment(now), type, ...args);
                      if (type === "from") {
                        newValue.startOf("day");
                      } else {
                        newValue.endOf("day");
                      }
                      onChange(newValue);
                    }}
                  >
                    {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
                    <span
                      onClick={() => {
                        if (document.activeElement) {
                          document.activeElement.blur();
                        }
                      }}
                    >
                      {label}
                    </span>
                  </a>
                </span>,
              );
              if (i < array.length - 1) {
                agr.push(<span key={`sep${label}`}> / </span>);
              }
              return agr;
            }, [])}
          </div>
        ));
      }}
    />
  </DatePickerWrapper>
);

export default function SorterReportAction({ sorter, client, ...props }) {
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  return (
    <Tooltip
      // title="Export Period"
      title={
        <Wrapper>
          <InputDatePicker
            type="from"
            placeholder="After this date"
            value={dateFrom}
            onChange={(value) => setDateFrom(value)}
          />
          <InputDatePicker
            type="to"
            placeholder="Before this date"
            value={dateTo}
            onChange={(value) => setDateTo(value)}
          />
          <Button
            type="primary"
            block
            ghost
            onClick={() =>
              clickAnchor({
                url: `${SERVER_URL}${
                  REACT_APP_API_PATH
                }/logentries/sort/report`,
                query: {
                  access_token: client.getAccessToken(),
                  query: JSON.stringify({
                    users: false,
                    where: {
                      AND: [
                        sorter ? { author: sorter } : null,
                        dateFrom
                          ? { createdAt: { GTE: dateFrom.toJSON() } }
                          : null,
                        dateTo ? { createdAt: { LTE: dateTo.toJSON() } } : null,
                      ].filter((condition) => !!condition),
                    },
                  }),
                },
              })
            }
          >
            Export
          </Button>
        </Wrapper>
      }
    >
      <Button type="primary" block ghost {...props}>
        Export Sorting Log
      </Button>
    </Tooltip>
  );
}
