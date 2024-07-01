/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unused-state */

import React, { useContext } from "react";

// import DefaultAdmin from 'hive-admin';
import CodeScanner, { ScannerContext, ScannerProvider } from "./ScannerContext";

function AdminContent({ adminProps, extraProps, renderContent }) {
  const { isVisible, setIsVisible } = useContext(ScannerContext);
  const content = renderContent(extraProps);
  // eslint-disable-next-line react/prop-types
  if (content && adminProps.viewer) {
    return (
      <>
        {content}
        <CodeScanner
          {...adminProps}
          {...extraProps}
          isVisible={isVisible}
          setIsVisible={setIsVisible}
        />
      </>
    );
  }
  return content;
}

export default class Admin extends DefaultAdmin {
  renderContent(extraProps = {}) {
    return (
      <ScannerProvider>
        <AdminContent
          adminProps={this.props}
          extraProps={extraProps}
          renderContent={(...args) => super.renderContent(...args)}
        />
      </ScannerProvider>
    );
  }
}
