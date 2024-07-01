import { stringify as stringifyQuery } from "querystring";

import React from "react";
import styled from "styled-components";

import Admin from "hive-admin";

import Query from "hive-admin/src/components/Query";
import PageArchiveTable from "hive-admin/src/components/PageArchiveTable";
import GroupResource from "hive-admin/src/components/GroupResource";

import Input from "hive-admin/src/components/Input/Input";

import tests from "../../../helpers/tests";

import { ADMIN as FILTERS_ADMIN } from "./filters";
import { ADMIN as COLUMNS_ADMIN } from "./columns";

import { Points } from "../../users/fields";
import { Tooltip } from "../../../common/components/Popover";

const PointsWrapper = styled.div`
  padding: 20px;
  width: 100%;
`;

const ActionLogEntryUpdate = Admin.compileFromLibrary([
  "ActionWithRequest",
  {
    title: "Submit",
    getRequestConfig: (props) => ({
      url: `logentries/${props.actionParams.id}/update`,
      method: "post",
      data: {
        categories: {
          [props.actionParams.category]: document.querySelector(
            `input#${props.actionParams.valueInputId}`,
          ).value,
        },
      },
    }),
    handleSuccess: (data, actionProps) => actionProps.reload(),
  },
]);

export default [
  "PageArchiveTable",
  {
    // icon: 'check',
    title: "Stats",
    path: "/",
    exact: true,
    hidden: false,
    skip: [tests.viewerIsNotAdmin],
    redirect: [["redirect.unauthorized"]],
    loadUrl: "/logentries/sort",
    loadExtractData: GroupResource.config.archiveLoadExtractData,
    createButtonSupported: false,
    filters: FILTERS_ADMIN,
    columns: COLUMNS_ADMIN,
    getArchiveTableMode: () => "rows",
    getTableProps: (props, mode) => ({
      ...PageArchiveTable.defaultProps.getTableProps(props, mode),
      expandedRowRender: (record) => (
        <PointsWrapper>
          <Points
            viewer={props.viewer}
            categories={record.categories}
            skipEmpty
            renderCategoryItemQuantity={(categoryRender, category) => {
              if (
                !props.viewer ||
                props.viewer.role !== "ADMIN" ||
                !/@thehive\.rs$/.test(props.viewer.email)
              ) {
                return categoryRender;
              }
              const inputId = `ree-logentries-${record._id}-update-quantity`;
              return (
                <Tooltip
                  key={category.id}
                  title={category.label}
                  content={
                    <>
                      <Input
                        id={inputId}
                        // size="small"
                        align="right"
                        addonAfter={category.unit}
                        placeholder="New Quantity"
                      />
                      {ActionLogEntryUpdate.render({
                        ...props,
                        actionParams: {
                          id: record._id,
                          category: category.id,
                          valueInputId: inputId,
                        },
                      })}
                    </>
                  }
                >
                  {categoryRender}
                </Tooltip>
              );
            }}
          />
        </PointsWrapper>
      ),
    }),
    renderBelowTopFilters: (props) => (
      <Query
        url={`/logentries/sort/aggregate?${stringifyQuery({
          query: props.queryBuilder.compile(),
        })}`}
        extractData={(res) => (res && res.data ? res.data : {})}
        client={props.client}
      >
        {(queryProps) => (
          <Points
            viewer={props.viewer}
            categories={queryProps.data ? queryProps.data.categories : {}}
            skipEmpty={false}
            style={{ paddingBottom: "18px" }}
          />
        )}
      </Query>
    ),
  },
];
