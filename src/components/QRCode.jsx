// import ms from 'ms';
import ms from "ms";

import React, { useState, useEffect } from "react";
import styled, { css } from "styled-components";

import {
  PlusOutlined,
  QrcodeOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

import Notification from "antd/lib/notification";
import "antd/lib/notification/style";

import QRCodeRender from "react-qr-code";
import QRCodeReader from "qr-scanner";
// eslint-disable-next-line max-len, import/no-webpack-loader-syntax, import/no-unresolved, import/extensions
import QRCodeReaderWorkerPath from "!!file-loader!qr-scanner/qr-scanner-worker.min.js";

import { Tooltip } from "./popover";

export const CloseIcon = styled(PlusOutlined)`
  margin-top: env(safe-area-inset-top);
  transform: rotate(45deg);
  font-size: 140%;
`;

QRCodeReader.WORKER_PATH = QRCodeReaderWorkerPath;

Notification.config({
  className: "scanner-notification",
});

export const QRCodeIcon = styled(QrcodeOutlined)`
  opacity: 0.8;
  padding: 0px 5px;
  font-size: 15px;
  &[data-disabled="true"] {
    opacity: 0.2;
    pointer-events: none;
  }
`;

export const QRCodeLoadingIcon = styled(LoadingOutlined)`
  font-size: 26px;
`;

export const QRCodePreviewWrapperHTML = ({
  size,
  ghost,
  resolution,
  ...props
}) => <div {...props} />;
export const QRCodePreviewWrapper = styled(QRCodePreviewWrapperHTML)`
  position: relative;
  overflow: hidden;
  top: 0px;
  left: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ size, resolution, ghost }) => css`
    width: ${size}px;
    height: ${size}px;
    > svg {
      position: absolute;
      transform-origin: center;
      &:nth-child(1) {
        opacity: ${ghost ? 0.1 : 1};
        transform: scale(${1 / resolution});
      }
      &:nth-child(2) {
        transform: scale(${(1 / resolution) * (1 - ghost * 2)});
      }
    }
  `}
`;

export const QRCodePreview = ({
  data,
  value,
  loading,
  size = 150,
  ghost = 0,
  color = "#333",
  background = "transparent",
  resolution = 4,
  renderBeforePreview,
  renderAfterPreview,
  ...props
}) => {
  ghost = ghost === true ? 0.13 : ghost;
  return (
    <>
      {renderBeforePreview(value, data)}
      <QRCodePreviewWrapper
        size={size}
        ghost={ghost}
        resolution={resolution}
        {...props}
      >
        {loading || !value ? (
          <QRCodeLoadingIcon />
        ) : (
          <>
            {ghost ? (
              <QRCodeRender
                key="ghost"
                value={value}
                size={size * resolution}
                fgColor={color}
                bgColor={background}
              />
            ) : null}
            <QRCodeRender
              key="qrcode"
              value={value}
              size={size * resolution}
              fgColor={color}
              bgColor={background}
            />
          </>
        )}
      </QRCodePreviewWrapper>
      {renderAfterPreview(value, data)}
    </>
  );
};

QRCodePreview.defaultProps = {
  renderBeforePreview: () => null,
  renderAfterPreview: () => null,
};

export const QRCodePreviewWithQuery = ({
  url,
  getUrl,
  method,
  client,
  skip,
  throttle,
  stall,
  config,
  initialData,
  extractData,
  extractError,
  refresh,
  Query: QueryComponent,
  ...props
}) => {
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    const timeout = setTimeout(() => setCounter(counter + 1), refresh);
    return () => {
      clearTimeout(timeout);
    };
  }, [counter, url, refresh, setCounter]);
  return (
    <QueryComponent
      url={getUrl ? getUrl(url, counter) : `${url}?c=${counter}`}
      method={method}
      client={client}
      skip={skip}
      throttle={throttle}
      stall={stall}
      config={config}
      extractData={extractData}
      extractError={extractError}
      autoload
      autoreload
    >
      {({ loading, data }) => (
        <QRCodePreview
          {...props}
          value={data && data.data && data.data.link ? data.data.link : null}
          data={data ? data.data : null}
          loading={loading || !data || !data.data || !data.data.link}
        />
      )}
    </QueryComponent>
  );
};

QRCodePreviewWithQuery.defaultProps = {
  Query: function QueryComponent({ children }) {
    return children ? children({ loading: true, data: null }) : null;
  },
  refresh: ms("5m"),
};

export const QRCodePreviewPopoverWrapper = styled(Tooltip)``;

export const QRCodePreviewPopover = ({
  mode = "value",
  value,
  url,
  getUrl,
  method,
  client,
  skip,
  throttle,
  stall,
  config,
  extractData,
  extractError,
  refresh,
  loading,
  size,
  ghost,
  color,
  background,
  resolution,
  renderBeforePreview,
  renderAfterPreview,
  ...props
}) => (
  <QRCodePreviewPopoverWrapper
    destroyTooltipOnHide
    spaceout={false}
    content={
      mode === "query" ? (
        <QRCodePreviewWithQuery
          url={url}
          getUrl={getUrl}
          method={method}
          client={client}
          skip={skip}
          throttle={throttle}
          stall={stall}
          config={config}
          extractData={extractData}
          extractError={extractError}
          refresh={refresh}
          size={size}
          ghost={ghost}
          color={color}
          background={background}
          resolution={resolution}
          renderBeforePreview={renderBeforePreview}
          renderAfterPreview={renderAfterPreview}
        />
      ) : (
        <QRCodePreview
          value={value}
          loading={loading}
          size={size}
          ghost={ghost}
          color={color}
          background={background}
          resolution={resolution}
          renderBeforePreview={renderBeforePreview}
          renderAfterPreview={renderAfterPreview}
        />
      )
    }
    {...props}
  />
);
