/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import styled, { css } from "styled-components";

// import Admin from "hive-admin";
// import Input from "hive-admin/src/components/Input/Input";
// import Query from "hive-admin/src/components/Query";
// import PageSmallForm from "hive-admin/src/components/PageSmallForm";

import { Link } from "react-router-dom";

// import AntdIcon from "antd/lib/icon";
// import AntdUserOutlined from "@ant-design/icons/UserOutlined";
// import AntdStarOutlined from "@ant-design/icons/StarOutlined";

import { fieldAddress, fieldAreaCheck } from "./users/fields";

import Button from "../components/Button";

import Types from "../components/types";

export class PageSignup extends PageSmallForm {
  static config = {
    ...PageSmallForm.config,
    ClassName: "PageSignup",
  };
}

Admin.addToLibrary("PageSignup", (config) => PageSignup.create(config));

const TierWrapper = styled.div`
  display: flex;
  flex-direction: column;
  /* padding-bottom: 20px; */
`;

const TierSwitcherWrapper = styled.div`
  display: flex;
  gap: 20px;
`;

const TierIcon = styled(AntdUserOutlined)`
  font-size: 80px;
`;

const TierStar = styled(AntdStarOutlined)`
  font-size: 30px;
  position: absolute;
  top: 10px;
  right: 10px;
`;

const TierLabel = styled.div``;

const TierOption = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  border-radius: ${({ theme }) => theme.less.borderRadius};
  padding-top: 34px;
  padding-bottom: 5px;
  flex: 1;
  cursor: pointer;
  ${({ active }) =>
    active
      ? css`
          color: #fff;
          background-color: ${({ theme }) => theme.less.primaryColor};
        `
      : css`
          border: 1px solid ${({ theme }) => theme.less.borderColor};
          ${TierIcon}, ${TierLabel}, ${TierStar} {
            opacity: 0.7;
          }
        `}
`;

const TierFeaturesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 35px;
`;

const TierFeaturesItem = styled.div`
  width: 100%;
  text-align: center;
  /* font-size: 16px; */
  line-height: 100%;
  &:not(:first-child) {
    margin-top: 8px;
  }
`;

const DiscountCodeInputWrapper = styled.div`
  width: 100%;
  margin-top: 40px;
`;

const DiscountCodeInput = styled(Input)`
  input {
    text-transform: uppercase;
    &::placeholder {
      text-transform: none;
    }
  }
`;

function TiersInputContent(props) {
  const { client, form, value, onChange } = props;
  const tiers = Types.CUSTOMER_TIER_LIST.filter(({ hidden }) => !hidden);
  const [discountCodeInput, setDiscountCodeInput] = useState("");
  // useEffect(
  //   () => {
  //     form.setFieldsValue({ discountcode: discountCodeInput });
  //   },
  //   [discountCodeInput, form],
  // );
  return (
    <TierWrapper>
      <div style={{ fontSize: "150%", marginBottom: "20px" }}>
        Choose your plan:
      </div>
      <TierSwitcherWrapper>
        {tiers.map(({ label, id, star }) => (
          <TierOption
            key={id}
            active={value === id}
            onClick={() => onChange(id)}
          >
            <TierIcon />
            <TierLabel>{label}</TierLabel>
            {star ? <TierStar /> : null}
          </TierOption>
        ))}
      </TierSwitcherWrapper>
      <TierFeaturesWrapper>
        <Query
          client={client}
          url={`users/tiers?selected=${encodeURIComponent(
            value,
          )}&discountcode=${encodeURIComponent(discountCodeInput)}`}
          extractData={(response) => (!response ? {} : response.data)}
        >
          {({ data }) => {
            const { data: tiersMap, discountCode } = data || {};
            const { price, features = [] } = tiersMap?.[value] || {};
            const {
              error: discountCodeError,
              description: discountCodeDescription,
            } = discountCode || {};
            return (
              <>
                {features.map(({ _id: featureId, name }) => (
                  <TierFeaturesItem key={featureId}>{name}</TierFeaturesItem>
                ))}
                <TierFeaturesItem
                  key="price"
                  style={{
                    fontWeight: 600,
                    marginTop: "25px",
                  }}
                >
                  {!price ? (
                    <div style={{ fontSize: "150%" }}>FREE</div>
                  ) : (
                    <div>
                      <div style={{ fontSize: "150%" }}>
                        {`${Types.CURRENCY} ${price.toFixed(2)} / Month`}
                      </div>
                      {/* <div
                            style={{
                              fontSize: 12,
                              opacity: 0.9,
                              fontWeight: 200,
                              marginTop: '5px',
                            }}
                          >
                            starting from 2022
                          </div> */}
                    </div>
                  )}
                </TierFeaturesItem>
                <DiscountCodeInputWrapper
                  className={discountCodeError ? "has-error" : undefined}
                >
                  <DiscountCodeInput
                    value={discountCodeInput}
                    onChange={(event) => {
                      form.setFieldsValue({ discountCode: event.target.value });
                      setDiscountCodeInput(event.target.value);
                    }}
                    placeholder="Discount Code"
                    size="large"
                    prefix={<AntdIcon type="tag" />}
                  />
                  {discountCodeDescription ? (
                    <TierFeaturesItem
                      key="_discount_code_"
                      style={{ marginTop: "10px" }}
                    >
                      {discountCodeDescription}
                    </TierFeaturesItem>
                  ) : null}
                </DiscountCodeInputWrapper>
              </>
            );
          }}
        </Query>
      </TierFeaturesWrapper>
    </TierWrapper>
  );
}

export default [
  "PageSignup",
  {
    title: "Signup",
    path: "/signup",
    exact: true,
    hidden: true,
    hideHeader: true,
    hideSidebar: true,
    redirect: [["redirect.authorized"]],
    fields: [
      [
        "FieldHidden",
        {
          name: "discountCode",
        },
      ],
      [
        "FieldText",
        {
          name: "name",
          label: null,
          placeholder: "Full Name",
          size: "large",
          prefix: <AntdIcon type="user" />,
          rules: [["validation.isRequired"]],
        },
      ],
      [
        "FieldText",
        {
          name: "email",
          label: null,
          placeholder: "Email Address",
          size: "large",
          autoComplete: "email",
          prefix: <AntdIcon type="mail" />,
          rules: [["validation.isRequired"], ["validation.isEmail"]],
        },
      ],
      [
        "FieldText",
        {
          name: "phoneNumber",
          label: null,
          placeholder: "Phone Number",
          size: "large",
          autoComplete: "phone-number",
          prefix: <AntdIcon type="phone" />,
          rules: [["validation.isRequired"]],
        },
      ],
      [
        fieldAddress[0],
        {
          ...fieldAddress[1],
          skip: [],
          size: "large",
          drawAllAreas: true,
          line2Props: {
            size: "large",
          },
        },
      ],
      [
        fieldAreaCheck[0],
        {
          ...fieldAreaCheck[1],
          formItemConfig: { style: { marginTop: "-10px" } },
          textProps: {
            style: {
              paddingLeft: "60px",
              paddingRight: "60px",
              paddingTop: "10px",
            },
          },
        },
      ],
      [
        "FieldReact",
        {
          name: "tier",
          initialValue: Types.CUSTOMER_TIER[2],
          virtual: [],
          // eslint-disable-next-line arrow-body-style
          renderContent: (props) => {
            return <TiersInputContent {...props} />;
          },
        },
      ],
      ["FieldTitle", { title: null, icon: null }],
      // [config => FieldWrapper.create(config), {
      //   name: 'toc',
      //   label: null,
      //   formItemConfig: { help: null },
      //   renderContent: ({ value, onChange }) => (
      //     <TOCContainer>
      //       <TOCCheckbox
      //         checked={!!value}
      //         onChange={ev => onChange(ev.target.checked)}
      //       />
      //       <span>
      //         {'I accept the '}
      //         <Link to="#">Terms of Service</Link>
      //       </span>
      //     </TOCContainer>
      //   ),
      //   rules: [
      //     {
      //       validator: (rule, value, cb) => cb(
      //         value === true
      //         ? undefined
      //         : 'Please accept the TOC first'
      //       ),
      //     },
      //   ],
      // }],
    ],
    renderAfterForm: (props) => (
      <p className="after-form">
        Already have an account? Click <Link to={props.loginPath}>here</Link> to
        login.
      </p>
    ),
    actions: [
      [
        "ActionWithFormBasedRequest",
        {
          name: "signup",
          title: "Sign Up",
          messageWorking: "Signing up...",
          messageSuccess: "Check your inbox for the Account Activation email!",
          handleSuccess: (_, props) => props.history.push("/login"),
          method: "post",
          type: "primary",
          size: "large",
          style: { width: "100%" },
          getRequestConfig: (props, data) => ({
            url: "/users/signup",
            method: "POST",
            data,
          }),
          renderAction: (actionProps, instance) => {
            const action = instance.renderAction(actionProps);
            return (
              <Button
                {...action.props}
                color="brand"
                style={action.props.disabled ? { opacity: 0.4 } : undefined}
              />
            );
          },
        },
      ],
    ],
  },
];
