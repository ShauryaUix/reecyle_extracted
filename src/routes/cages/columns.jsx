import { Link } from "react-router-dom";

import { QRCodePreviewPopover, QRCodeIcon } from "../../components/CodeScanner";

export const columnRecycleTag = {
  path: "recycleTags",
  title: null,
  render: (record, column, props) => (
    <span>
      <QRCodePreviewPopover
        mode="query"
        client={props.client}
        url={`/recycletags/cage/${record._id}`}
      >
        <QRCodeIcon />
      </QRCodePreviewPopover>
    </span>
  ),
};

export const columnName = {
  path: "name",
  width: "100%",
  link: "/cages/:_id",
};

export const columnHidden = {
  path: "hidden",
  label: "Hidden",
  render: (record) => (record.hidden ? "Hidden" : "-"),
};

export const columnOrganization = {
  path: "organization",
  title: "Organization",
  render: (record) =>
    record.organization && record.organization._id ? (
      <Link to={`/organizations/${record.organization._id}`}>
        {record.organization.name}
      </Link>
    ) : (
      "-"
    ),
};

export const ADMIN = [
  columnRecycleTag,
  columnName,
  columnHidden,
  columnOrganization,
];
