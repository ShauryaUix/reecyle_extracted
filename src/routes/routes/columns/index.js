import moment from "moment";

import React from "react";
import styled from "styled-components";

import { Link } from "react-router-dom";

export const RouteID = styled.code`
  /* font-weight: 200; */
`;

export const columnId = {
  path: "_id",
  render: (record) => (
    <Link to={`/routes/${record._id}`}>
      <RouteID>{`${record._id.toUpperCase().slice(-8)}`}</RouteID>
    </Link>
  ),
};

export const columnStatus = {
  path: "status",
  render: (record) =>
    record.completed ? "Complete" : record.started ? "Started" : "Scheduled",
};

export const columnDriver = {
  path: "driver",
  render: (record) => (
    <Link to={`/users/${record.driver._id}`}>{record.driver.name}</Link>
  ),
};

export const columnStartsAt = {
  path: "startAt",
  title: "Starts",
  render: (record) => moment(record.startsAt).format("lll"),
};

export const columnStartedAt = {
  path: "startedAt",
  title: "Started",
  render: (record) =>
    record.started ? moment(record.startedAt).format("lll") : "-",
};

export const columnCompletedAt = {
  path: "completedAt",
  title: "Completed",
  render: (record) =>
    record.completed ? moment(record.completedAt).format("lll") : "-",
};

export const columnBags = {
  path: "bags",
  title: "Bags",
  render: (record) => `${record.bags.collected} / ${record.bags.expected}`,
};

export const columnStops = {
  path: "stops",
  title: "Stops",
  render: (record) =>
    `${record.stops.filter((stop) => stop.completed).length} / ${
      record.stops.length
    }`,
};

export { ADMIN_NEW } from "./new-route";

export const ADMIN = [
  columnId,
  columnStatus,
  columnDriver,
  columnStartsAt,
  columnStops,
  columnBags,
  columnStartedAt,
  columnCompletedAt,
];
