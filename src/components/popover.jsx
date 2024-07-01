import isString from "lodash/isString";

import React from "react";
import styled, { css } from "styled-components";

import AntdPopover from "antd/lib/popover";

export const Title = styled.div`
  font-size: 16px;
  line-height: 1;
  text-align: left;
`;

export const Header = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

export const ContentWrapperHTML = ({
  width,
  minWidth,
  maxWidth,
  spaceout,
  ...props
}) => <div {...props} />;

export const ContentWrapper = styled(ContentWrapperHTML)`
  display: flex;
  flex-direction: column;
  ${({ width }) =>
    width &&
    css`
      width: ${width}px;
    `}
  ${({ minWidth }) =>
    minWidth &&
    css`
      min-width: ${minWidth}px;
    `}
  ${({ maxWidth }) =>
    maxWidth &&
    css`
      max-width: ${maxWidth}px;
    `}
  ${({ spaceout }) =>
    spaceout !== false &&
    css`
      > *:not(:first-child) {
        margin-top: 10px;
      }
    `}
`;

export function Content({
  width,
  minWidth,
  maxWidth,
  spaceout,
  title,
  actions,
  children,
  className,
}) {
  return (
    <ContentWrapper
      width={width}
      minWidth={minWidth}
      maxWidth={maxWidth}
      spaceout={spaceout}
      className={className}
    >
      <Header>
        {isString(title) ? <Title>{title}</Title> : title}
        {actions}
      </Header>
      {children}
    </ContentWrapper>
  );
}

Content.defaultProps = {
  title: null,
  actions: null,
  children: null,
};

export function PopoverComponent({ className, ...props }) {
  return <AntdPopover overlayClassName={className} {...props} />;
}

const Popover = styled(PopoverComponent)`
  .ant-popover-inner-content {
    padding: 14px 14px;
  }
`;

export function Tooltip({ title, content = null, ...props }) {
  return (
    <Popover
      content={<Content title={title}>{content}</Content>}
      trigger="hover"
      {...props}
    />
  );
}

export default Popover;
