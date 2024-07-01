import { createRef } from "react";
import styled from "styled-components";

// import Admin from "hive-admin";
// import Input from "hive-admin/src/components/Input/Input";
// import GroupResource from "hive-admin/src/components/GroupResource";

import Types from "../../components/types";

import { ADMIN as FIELDS_ADMIN } from "./fields";
import { ADMIN as FILTERS_ADMIN, CODES as FILTERS_CODES } from "./filters";
import { ADMIN as COLUMNS_ADMIN, CODES as COLUMNS_CODES } from "./columns";

import tests from "../../components/helper/tests";

const CouponCodesPopconfirmWrapper = styled.div`
  display: flex;
  width: 200px;
  margin-left: -22px;
`;

function getArchiveTableMode(props) {
  return props.isMobile ||
    props.isTablet ||
    (props.viewer && props.viewer.role === Types.USER_ROLE_CONST.CUSTOMER)
    ? "cards"
    : props.archiveTableMode;
}

export default Admin.compileFromLibrary([
  "GroupResource",
  {
    title: "Coupons",
    icon: "credit-card",
    path: "/coupons",
    redirect: [["redirect.unauthorized"]],
    headerTitleKey: "name",
    filters: FILTERS_ADMIN,
    columns: COLUMNS_ADMIN,
    fields: FIELDS_ADMIN,
    archiveConfig: {
      path: "/coupons",
      title: "Coupons",
      label: "Coupons",
      icon: "credit-card",
      titleColumnPath: "details.name",
      createButtonPath: "/coupons/create",
      getArchiveTableMode,
      getCreateButtonSupported: (props) =>
        props.viewer && props.viewer.role === Types.USER_ROLE_CONST.ADMIN,
    },
    afterArchivePages: [
      [
        "PageArchiveTable",
        {
          path: "/coupons/codes",
          exact: true,
          title: "Purchased Coupons",
          label: "Purchased Coupons",
          icon: "wallet",
          loadUrl: "/couponcodes",
          getArchiveTableMode,
          loadExtractData: GroupResource.config.archiveLoadExtractData,
          renderHeaderDescription: (props) =>
            `${props.searchParams.used}` === "true"
              ? "List of coupons already used"
              : "List of newly purchased coupons",
          createButtonSupported: false,
          titleColumnPath: "details.name",
          filters: FILTERS_CODES,
          columns: COLUMNS_CODES,
          skip: [tests.viewerIsNotAdmin],
        },
      ],
    ],
    singleConfig: {
      hidden: true,
      alias: "/coupons",
      duplicateLoadUrl: "/coupons/:duplicate",
      headerTitle: "New Coupon",
      headerTitleKey: "details.name",
      backButtonPaths: ["/coupons"],
      skip: [tests.viewerIsNotAdmin],
    },
    singleEditConfig: {
      couponCodesQueryRef: createRef(),
      actions: [
        ["ActionSave"],
        [
          "ActionWithRequest",
          {
            name: "addCode",
            title: "Add Code",
            ghost: true,
            getRequestConfig: (props) => ({
              url: "couponcodes",
              method: "post",
              data: {
                coupon: props.data._id,
                code: document.querySelector('input[data-action-input="code"]')
                  .value,
              },
            }),
            popconfirm: {
              icon: null,
              okText: "Confirm",
              title: (
                <CouponCodesPopconfirmWrapper>
                  <Input
                    data-action-input="code"
                    align="right"
                    prefix="Code:"
                    placeholder="Coupon Code"
                    style={{ opacity: 1 }}
                  />
                </CouponCodesPopconfirmWrapper>
              ),
            },
            handleSuccess: (data, props) => {
              if (props.couponCodesQueryRef.current) {
                props.couponCodesQueryRef.current.reload();
              }
            },
          },
        ],
        [
          "ActionWithRequest",
          {
            name: "generateCodes",
            title: "Generate Codes",
            ghost: true,
            getRequestConfig: (props) => ({
              url: "couponcodes/generate",
              method: "post",
              data: {
                coupon: props.data._id,
                count: parseInt(
                  document.querySelector('input[data-action-input="count"]')
                    .value,
                  10,
                ),
              },
            }),
            popconfirm: {
              icon: null,
              okText: "Confirm",
              title: (
                <CouponCodesPopconfirmWrapper>
                  <Input
                    data-action-input="count"
                    align="right"
                    prefix="Count:"
                    placeholder="0"
                    style={{ opacity: 1 }}
                  />
                </CouponCodesPopconfirmWrapper>
              ),
            },
            handleSuccess: (data, props) => {
              if (props.couponCodesQueryRef.current) {
                props.couponCodesQueryRef.current.reload();
              }
            },
          },
        ],
        [
          "Action",
          {
            name: "duplicate",
            title: "Duplicate",
            ghost: true,
            onClick: (props) =>
              props.history.push(
                `/coupons/create?duplicate=${
                  props.data ? props.data._id : null
                }`,
              ),
          },
        ],
        ["ActionDelete"],
      ],
      skip: [tests.viewerIsNotAdmin],
    },
    skip: [tests.viewerIsNotAdmin],
  },
]).pages;
