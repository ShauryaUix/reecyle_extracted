import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

import { Title, Paragraph } from "../Text";
import Space from "../Space";

import Types from "../../../../../common/modules/types";

const CONFIG = {
  horizontal: {
    flexDirection: "row",
    maxWidth: "auto",
    padding: 0,
    image: {
      width: "100px",
      height: "80px",
    },
  },
  vertical: {
    flexDirection: "column",
    maxWidth: "140px",
    padding: "13px",
    image: {
      width: "100%",
      height: "150px",
    },
  },
};

const Wrapper = styled(motion.div)`
  display: flex;
  flex-direction: ${({ type }) => CONFIG[type].flexDirection};
  align-items: center;
  width: 100%;
  flex: 1 0 auto;
  max-width: ${({ type }) => CONFIG[type].maxWidth};
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.11);
  border-radius: 12px;

  background: ${({ theme }) => theme.colors.light};
  opacity: ${({ points }) => (points === 0 ? 0.3 : 1)};
  pointer-events: ${({ points }) => (points === 0 ? "none" : "all")};
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding: ${({ type }) => CONFIG[type].padding};
`;

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  width: ${({ type }) => CONFIG[type].image.width};
  height: ${({ type }) => CONFIG[type].image.height};

  img {
    position: absolute;
    width: ${({ type }) => CONFIG[type].image.height};
    height: ${({ type }) => CONFIG[type].image.height};
    object-fit: contain;
    z-index: 1;
    transform: ${({ type }) =>
      type === "vertical"
        ? "translate(40px, -5px) scale(1.4)"
        : "translate(0px)"};
  }
`;

const Flex = styled.div`
  display: flex;
`;

const Category = ({
  type,
  image,
  title,
  description,
  points,
  unit,
  quantity,
  onClick,
}) => (
  <Wrapper
    type={type}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    points={points}
  >
    <ImageContainer type={type}>
      {image ? <img src={image} alt={title} /> : null}
    </ImageContainer>
    <Content type={type}>
      <Title fontSize={16} fontWeight={700}>
        {title}
      </Title>
      <Space h={2} />
      {type === "horizontal" ? (
        <Paragraph fontSize={12} opacity={0.4}>
          {description}
        </Paragraph>
      ) : null}
      <Space h={2} />
      <Flex>
        <Paragraph color="brand" fontSize={12}>
          {Types.decimalizeInt(points)}
          {" points"}
        </Paragraph>
        {type === "horizontal" ? (
          <>
            <Paragraph color="brand" fontSize={12}>
              &nbsp;/&nbsp;
            </Paragraph>
            <Paragraph color="brand" fontSize={12}>
              {unit}
            </Paragraph>
          </>
        ) : null}
      </Flex>
      {type === "vertical" ? (
        <Flex>
          <Space h={2} />
          <Paragraph fontSize={12} opacity={0.4}>
            {Types.decimalizeInt(quantity)}
          </Paragraph>
          <Paragraph fontSize={12} opacity={0.4}>
            {` ${unit}`}
          </Paragraph>
        </Flex>
      ) : null}
    </Content>
  </Wrapper>
);

Category.propTypes = {
  type: PropTypes.oneOf(["horizontal", "vertical"]),
  title: PropTypes.string.isRequired,
  image: PropTypes.string,
  description: PropTypes.string.isRequired,
  points: PropTypes.number,
  unit: PropTypes.string.isRequired,
  quantity: PropTypes.number,
};

Category.defaultProps = {
  type: "horizontal",
  image: null,
  quantity: 0,
  points: 0,
};

export default Category;

export const HorizontalScrollWrapper = styled.div`
  display: flex;
  flex-wrap: nowrap;
  overflow-x: scroll;
  overflow-y: auto;
  gap: 15px;
  width: calc(100% + 40px);
  padding: 20px;
  margin: -20px;
  flex: 1 0 auto;

  &::-webkit-scrollbar {
    display: none;
  }
`;
