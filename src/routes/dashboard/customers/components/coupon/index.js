import React, { useMemo } from "react";
import styled, { css } from "styled-components";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

import AntdStarOutlined from "@ant-design/icons/StarOutlined";

import Color from "color";

import { Title, Paragraph } from "../Text";
import Space from "../Space";

import linkSrc from "../../assets/icons/link.svg";
import dashSrc from "../../assets/icons/dash.svg";

const CONFIG = {
  horizontal: {
    flexDirection: "row",
    padding: 0,
    width: "100%",
    image: {
      width: "65px",
      height: "65px",
    },
  },
  vertical: {
    flexDirection: "column",
    padding: "13px",
    width: "calc(50% - 7.5px)",
    widthLarge: "calc(33% - 7.5px)",
    image: {
      width: "100%",
      height: "150px",
    },
  },
};

export const getCouponColors = (color, colorStyle) => {
  const [color1, color2, colorAngle] =
    colorStyle === 0
      ? [color, color, 0]
      : colorStyle === 1
        ? [color, Color(color).darken(0.2).hex(), 135]
        : colorStyle === 2
          ? [color, Color(color).darken(0.4).hex(), 135]
          : colorStyle === 3
            ? [
                // Color(color).rotate(-45).hex(),
                // Color(color).rotate(45).hex(),
                color,
                Color(color).rotate(90).hex(),
                135,
              ]
            : colorStyle === 4
              ? [
                  // Color(color).rotate(-45).hex(),
                  // Color(color).rotate(45).hex(),
                  color,
                  Color(color).rotate(-90).hex(),
                  135,
                ]
              : colorStyle === 5
                ? [
                    // Color(color).rotate(-90).hex(),
                    // Color(color).rotate(90).hex(),
                    color,
                    Color(color).rotate(180).hex(),
                    135,
                  ]
                : [color, color, 0];
  const isDark = Color(color1).mix(Color(color2)).isDark();
  const colorText = Color(isDark ? "#fff" : "#484848").hex();
  const colorCode = Color(isDark ? "#484848" : "#fff")
    .alpha(0.6)
    .rgb();
  return [color1, color2, colorAngle, colorText, colorCode];
};

export const useCouponColors = (color, colorStyle) =>
  // [color1, color2, colorAngle, colorText, colorCode]
  useMemo(() => getCouponColors(color, colorStyle), [color, colorStyle]);

export const StandaloneWrapper = styled.div`
  margin: 30px auto;
  width: 100%;
  max-width: 250px;
  > div {
    width: 100%;
  }
`;

const Wrapper = styled(motion.div)`
  display: flex;
  flex-direction: ${({ type }) => CONFIG[type].flexDirection};
  align-items: center;
  width: ${({ type }) => CONFIG[type].width};
  ${({ type }) =>
    CONFIG[type].widthLarge &&
    css`
      @media (min-width: 1024px) {
        width: ${CONFIG[type].widthLarge};
      }
    `}
  box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;

  background: ${({ theme }) => theme.colors.light};
  opacity: ${({ dimmed, disabled }) => (dimmed || disabled ? 0.4 : 1)};
  ${({ disabled }) =>
    disabled &&
    css`
      pointer-events: none;
    `}
`;

const Flex = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;

  img {
    margin: 10px;
  }
`;

const Content = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: ${({ type }) => CONFIG[type].padding};
  position: relative;
`;

const ImageContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ color }) => color};
  width: ${({ type }) => CONFIG[type].image.width};
  height: ${({ type }) => CONFIG[type].image.height};

  > img {
    object-fit: contain;
    width: 100%;
    height: 100%;
    transform: scale(0.9);
  }
`;

const Decoration = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: url(${dashSrc}) no-repeat bottom center / contain;
  box-shadow: 0 -20px 20px -10px inset hsla(0, 0%, 0%, 0.1);

  &:before,
  &:after {
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    bottom: -10px;
    border-radius: 100%;
    background: white;
  }

  &:before {
    left: -10px;
    box-shadow:
      4px 2px 15px inset hsla(0, 0%, 0%, 0.1),
      -4px 0 4px -4px inset hsla(0, 0%, 0%, 0.15);
  }

  &:after {
    right: -10px;
    box-shadow:
      -4px 2px 15px inset hsla(0, 0%, 0%, 0.1),
      4px 0 4px -4px inset hsla(0, 0%, 0%, 0.15);
  }
`;

export const TierStar = styled(AntdStarOutlined)`
  font-size: 18px;
  position: absolute;
  right: 8px;
  bottom: 8px;
  opacity: 0.7;
`;

const Coupon = ({
  disabled,
  type,
  image,
  color,
  colorStyle,
  title,
  description,
  points,
  onClick,
  dimmed,
  tiersAvailableStatus,
  // eslint-disable-next-line arrow-body-style
}) => {
  const [c1, c2, cA] = useCouponColors(color, colorStyle || 0);
  return (
    <Wrapper
      type={type}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      dimmed={!!dimmed}
      disabled={!!disabled}
    >
      <ImageContainer
        type={type}
        color={`linear-gradient(${cA}deg, ${c1} 0%, ${c2} 100%)`}
      >
        {image ? <img src={image} alt={title} /> : null}
        {type === "vertical" ? <Decoration /> : null}
      </ImageContainer>
      <Space w={10} />
      <Flex>
        <Content type={type}>
          <Title fontSize={16} fontWeight={700}>
            {title}
          </Title>
          <Space h={1} />
          <Paragraph fontSize={12} customColor={color}>
            {description}
          </Paragraph>
          {points ? (
            <>
              <Space h={1} />
              <div style={{ display: "flex" }}>
                <Paragraph fontSize={12} opacity={0.4}>
                  {points}
                </Paragraph>
                <Paragraph fontSize={12} opacity={0.4}>
                  &nbsp;points
                </Paragraph>
              </div>
            </>
          ) : null}
          {["PRO_PREMIUM", "PREMIUM"].includes(tiersAvailableStatus) ? (
            <TierStar style={{ color }} />
          ) : null}
        </Content>
        {type === "horizontal" ? (
          <img src={linkSrc} width={18} alt="coupon link" />
        ) : null}
      </Flex>
    </Wrapper>
  );
};

Coupon.propTypes = {
  type: PropTypes.oneOf(["horizontal", "vertical"]),
  // image: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  // stats: PropTypes.objectOf(PropTypes.number),
};

Coupon.defaultProps = {
  type: "horizontal",
  // stats: null,
};

export default Coupon;
