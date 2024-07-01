import React, { cloneElement } from "react";
import styled from "styled-components";

import PageSingle from "hive-admin/src/components/PageSingle";

const PageDashboardContentHTML = ({ className, style, children }) =>
  cloneElement(children, { className, style });

const PageDashboardContent = styled(PageDashboardContentHTML)`
  > .ant-form.ant-form-vertical {
    justify-content: center;
  }
`;

export default class PageDashboard extends PageSingle {
  renderContent() {
    return this.props.renderContent ? (
      this.props.renderContent(this.props)
    ) : (
      <PageDashboardContent>{super.renderContent()}</PageDashboardContent>
    );
  }
}
