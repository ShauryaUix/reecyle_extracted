import "./components/helper/fixInfiniteScroller";

import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "styled-components/macro";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/core";

// import Admin from 'hive-admin';

import { Link } from "react-router-dom";

import "./components/helper/library";

// import 'hive-admin/src/components/FieldGoogleAddress';
// import 'hive-admin/src/components/FieldGooglePolygon';

// import './antd.less';
// import './admin.less';

import "./components//CodeScanner/FieldTitle";
import "./components//CodeScanner/FieldCheckoutCard";
import "./components//CodeScanner/FieldColorPicker";
import "./components//CodeScanner/FieldTagsCount";
import "./components//CodeScanner/FilterActionLink";
import CheckoutPage from "./routes/checkout";
import DashboardPages from "./routes/dashboard";
import UserPages from "./routes/users";
import OrganizationPages from "./routes/organizations";
import AreaPages from "./routes/areas";
import CategoryPages from "./routes/categories";
import CagePages from "./routes/cages";
import CouponPages from "./routes/coupons";
import PartnerPages from "./routes/partners";
import RoutePages from "./routes/routes";
import DiscountCodePages from "./routes/discountcodes";
import SettingsPage from "./routes/settings";
import SignupPage from "./routes/signup";

import theme from "./theme";
import themeCustomer from "./routes/dashboard/customers/theme";

import Inter from "./routes/dashboard/customers/components/Inter";

import { renderLogo, renderSidebarLogo } from "./components/CodeScanner/Logo";

import Admin from "./components/CodeScanner/Admin";

import Types from "./components/types";

const {
  REACT_APP_NODE_ENV,
  REACT_APP_API_PATH,
  REACT_APP_PUBLIC_URL = "",
  // eslint-disable-next-line no-undef
} = process.env;

const { SERVER_URL } = Types;

const base = (window.ADMIN_BASE = `${REACT_APP_PUBLIC_URL}/`);
const restBase =
  REACT_APP_NODE_ENV !== "production"
    ? `${REACT_APP_API_PATH}`
    : `${SERVER_URL}${REACT_APP_API_PATH}`;
// const restBase = `https://platform.reecycle.app${REACT_APP_API_PATH}`;
// const restBase = `http://192.168.0.101:8000${REACT_APP_API_PATH}`;
// const restBase = `https://thrs-ree-api.tunnelto.dev${REACT_APP_API_PATH}`;

const admin = Admin.create({
  base,
  restBase,
  restBaseRoot: `${SERVER_URL}${REACT_APP_API_PATH}`,
  titlePrefix: "Ree | ",
  sidebarProps: { renderLogo: renderSidebarLogo },
  passwordSetSuccessRedirectPath: "/login",
  accountActivationSuccessRedirectPath: "/login",
  viewerUrl: "/users/me",
  checkoutCardInputRef: React.createRef(),
  validateViewer: async (viewer, props) => {
    if (["ADMIN", "CUSTOMER", "DRIVER", "SORTER"].indexOf(viewer.role) === -1) {
      throw new Error("Invalid credentials");
    }
    const { client } = props;
    const {
      data: { data: categoriesArray },
    } = await props.client.request({
      url: "/categories",
    });
    const { data: tiersMap } = await props.client.request({
      url: "/users/tiers",
    });
    const categoriesMap = categoriesArray.reduce((agr, category) => {
      agr[category._id] = category;
      agr[category._id].label = category.name;
      return agr;
    }, {});
    viewer._ = {
      categories: Types.CATEGORIES_LIST.map((category) => ({
        ...category,
        ...(categoriesMap[category.id] || {}),
      })),
      tiersMap,
    };
    if (Capacitor.getPlatform() !== "web") {
      PushNotifications.removeAllListeners();
      PushNotifications.addListener("registration", async (token) => {
        try {
          await client.request("users/actions/push-register", {
            method: "POST",
            data: {
              platform: Capacitor.getPlatform().toUpperCase(),
              token: token.value,
            },
          });
          // eslint-disable-next-line no-console
          console.log("push token registration success");
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(
            `push token registration setting error: ${JSON.stringify(error)}`,
          );
        }
      });
      PushNotifications.addListener("registrationError", (error) => {
        // eslint-disable-next-line no-console
        console.log(`push token registration error: ${JSON.stringify(error)}`);
      });
      PushNotifications.requestPermissions().then((permissions) => {
        if (permissions.receive === "granted") {
          // Register with Apple / Google to receive push via APNS/FCM
          PushNotifications.register();
        } else {
          // No permission for push granted
        }
      });
    }
    return viewer;
  },
  structure: [
    [
      "PageLogin",
      {
        renderBeforeForm: renderLogo,
        redirect: [["redirect.authorized", "/"]],
        renderAfterForm: (props) => (
          <>
            <p className="after-form" style={{ marginBottom: "0.3em" }}>
              Lost your password? Click{" "}
              <Link to={props.passwordResetPath}>here</Link> to set a new one.
            </p>
            <p className="after-form">
              If you dont yet have an account, click{" "}
              <Link to="/signup">here</Link> to sign up instead.
            </p>
          </>
        ),
      },
    ],
    [
      SignupPage[0],
      {
        renderBeforeForm: renderLogo,
        ...SignupPage[1],
      },
    ],
    CheckoutPage,
    ...DashboardPages,
    [
      "PagePasswordReset",
      {
        renderBeforeForm: renderLogo,
        redirect: [["redirect.authorized"]],
      },
    ],
    ["PagePasswordSet", { renderBeforeForm: renderLogo }],
    [
      "PageAccountActivation",
      {
        renderBeforeForm: renderLogo,
        accountActivationSuccessRedirectPath: "/",
      },
    ],
    ...UserPages,
    ...RoutePages,
    ...CategoryPages,
    ...AreaPages,
    ...OrganizationPages,
    ...CagePages,
    ...PartnerPages,
    ...CouponPages,
    ...DiscountCodePages,
    SettingsPage,
    [
      "Page404",
      {
        redirect: [["redirect.unauthorized"], ["redirect.always", "/"]],
      },
    ],
  ],
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={{ ...theme, ...themeCustomer }}>
    <Inter weights={[500, 600, 700, 900]} />
    {admin}
  </ThemeProvider>,
  document.getElementById("root"),
);
