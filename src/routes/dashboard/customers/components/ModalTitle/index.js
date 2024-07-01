import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { Title, Paragraph } from "../Text";
import Space from "../Space";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const HeaderWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: flex-start;
`;

const Flex = styled.div`
  display: flex;
`;

const ModalTitle = ({ title, icon, customColor, points, unit, label }) => (
  <Wrapper>
    <HeaderWrapper>
      <Title>{title}</Title>
      {icon || null}
    </HeaderWrapper>
    <Space h={1} />
    <Flex>
      {label ? (
        <>
          <Paragraph
            customColor={customColor ? customColor : null}
            color={!customColor ? "brand" : null}
          >
            {label}
          </Paragraph>
          <Paragraph opacity={0.4}>&nbsp;/&nbsp;</Paragraph>
        </>
      ) : null}
      {points ? (
        <Paragraph color={label ? null : "brand"} opacity={label ? 0.4 : 1}>
          {`${points} points`}
        </Paragraph>
      ) : null}
      {unit && unit !== "POINT" ? (
        <>
          <Paragraph opacity={0.4}>&nbsp;/&nbsp;</Paragraph>
          <Paragraph opacity={0.4}>{unit}</Paragraph>
        </>
      ) : null}
    </Flex>
  </Wrapper>
);

ModalTitle.propTypes = {
  title: PropTypes.string.isRequired,
  customColor: PropTypes.string,
  points: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  unit: PropTypes.string,
};

ModalTitle.defaultProps = {
  customColor: "",
  points: "",
  unit: "",
};

export default ModalTitle;
