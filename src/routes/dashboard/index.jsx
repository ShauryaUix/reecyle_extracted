/* eslint-disable react-refresh/only-export-components */
/* eslint-disable max-len */

import styled from "styled-components";

import Admin from "hive-admin";

import tests from "../../components/helper/tests";

import pageCustomers from "./customers";

// import Types from '../common/modules/types';

import {
  // fieldCustomerBagsTitle,
  // fieldCustomerBags,
  // fieldCustomerPointsTitle,
  // fieldCustomerPoints,
  fieldDriverRoutesTitle,
  fieldDriverRoutes,
} from "../users/fields";

import PageDashboard from "./pageDashboard";
import SorterReportAction from "../../components/SorterReportAction";

import statsPage from "./stats";
import mapPage from "./map";

const cloneField = (field, config = {}) => [
  field[0],
  { ...field[1], ...config },
];

const HelloWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const HelloTitle = styled.h1`
  font-size: 40px;
  line-height: 1.2;
  font-weight: 700;
  word-break: break-word;
  color: ${({ theme }) => theme.less.textColor};
`;

const HelloSubtitle = styled.h2`
  font-size: 16px;
  opacity: 0.5;
  color: ${({ theme }) => theme.less.textColor};
  padding-right: 50px;
  margin-bottom: 10px;
  max-width: 400px;
`;

export const fieldHello = [
  "FieldReact",
  {
    name: "hello",
    renderContent: (props) => (
      <HelloWrapper>
        <HelloTitle>
          Hello,
          <br />
          {props.data.name}
        </HelloTitle>
        {props.helloSubtitle ? (
          <HelloSubtitle>{props.helloSubtitle}</HelloSubtitle>
        ) : null}
      </HelloWrapper>
    ),
  },
];

export const fieldBottom = [
  "FieldReact",
  {
    name: "bottom",
    renderContent: () => <div style={{ height: "0px" }} />,
  },
];

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  pageCustomers,
  [
    "Group",
    {
      id: "dashboard",
      icon: "dashboard",
      label: "Dashboard",
      skip: [tests.viewerIsNotAdmin],
      pages: [statsPage, mapPage],
    },
  ],
  ...[
    {
      // title: 'Dashboard Customer',
      // serves to redirect to /reecycle, the actual dashboard for the app
      hidden: true,
      skip: [tests.viewerIsNotCustomer],
      redirect: [["redirect.unauthorized"], ["redirect.always", "/reecycle"]],
    },
    {
      // title: 'Dashboard Driver',
      hidden: [tests.viewerIsNotDriver],
      skip: [tests.viewerIsNotDriver],
      fields: [
        cloneField(fieldHello, {
          helloSubtitle: (
            <>
              <p>
                Below you&apos;ll find a quick access to your recent and
                upcoming routes.
              </p>
              <p>
                Press the button in the bottom right corner to scan a bag during
                a pickup.
              </p>
            </>
          ),
        }),
        ...[
          cloneField(fieldDriverRoutesTitle, { title: "My Routes" }),
          fieldDriverRoutes,
        ].map((field) => cloneField(field, { skip: [] })),
      ],
    },
    {
      // title: 'Dashboard Sorter',
      hidden: [tests.viewerIsNotSorter],
      skip: [tests.viewerIsNotSorter],
      fields: [
        fieldHello,
        [
          "FieldReact",
          {
            label: null,
            renderContent: (props) => (
              <SorterReportAction
                sorter={props.viewer._id}
                client={props.client}
                block={false}
              />
            ),
          },
        ],
      ],
    },
  ].map(({ PageComponent = PageDashboard, ...extras }) =>
    Admin.compileFromLibrary([
      (config) => PageComponent.create(config),
      {
        icon: "dashboard",
        title: "Dashboard",
        path: "/",
        exact: true,
        hidden: false,
        activity: "edit",
        redirect: [["redirect.unauthorized"]],
        renderHeaderTitle: (props) => null,
        loadExtractData: PageDashboard.config.loadExtractData,
        loadUrl: "/users/me",
        actions: [],
        ...extras,
      },
    ]),
  ),
];
