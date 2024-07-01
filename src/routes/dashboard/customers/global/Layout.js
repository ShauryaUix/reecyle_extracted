import React from "react";
import { ThemeProvider } from "styled-components";

import GlobalStyle from "./GlobalStyle";
import theme from "../theme";

const Layout = ({ children }) => (
  <>
    <GlobalStyle />
    <ThemeProvider theme={theme}>{children}</ThemeProvider>
  </>
);

export default Layout;
