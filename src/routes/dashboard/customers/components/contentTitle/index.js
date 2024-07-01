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

const ContentTitle = ({ title, description }) => (
  <Wrapper>
    <Title fontSize={22}>{title}</Title>
    <Space h={1} />
    <Paragraph opacity={0.4}>{description}</Paragraph>
  </Wrapper>
);

ContentTitle.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default ContentTitle;
