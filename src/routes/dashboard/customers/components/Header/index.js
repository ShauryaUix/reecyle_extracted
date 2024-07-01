import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
// import PropTypes from 'prop-types';

import { Link } from "react-router-dom";

import { Title, Paragraph } from "../Text";
import Space from "../Space";
import Spinner from "../Spinner";

import Types from "../../../../../common/modules/types";

// import ribbonSrc from '../../assets/icons/ribbon.svg';

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 20px;

  &:after {
    content: "";
    position: absolute;
    top: 100%;
    left: 0;
    right: 0%;
    height: 30px;
    z-index: 1;
    background: linear-gradient(
      to bottom,
      hsla(0, 0%, 100%, 1),
      hsla(0, 0%, 100%, 0)
    );
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const ImageContainer = styled(Link)`
  position: relative;
  display: flex;
  width: 60px;
  height: 60px;
`;

const ImageAvatar = styled.div`
  display: flex;
  flex: 1;
  border-radius: 100%;
  background-color: transparent;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: ${({ src }) => `url("${src}")`};
`;

const ImageShade = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: hsla(0, 0%, 0%, 0.03);
  border-radius: 1000px;
`;

// const LevelWrapper = styled.div`
//   position: absolute;
//   right: 0;
//   bottom: -5px;
//   width: 22px;
//   height: 22px;

//   img {
//     position: absolute;
//     left: 50%;
//     top: 100%;
//     transform: translate(-50%, -50%);
//   }
// `;

// const Level = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   position: absolute;
//   width: 22px;
//   height: 22px;
//   border-radius: 22px;

//   background: ${({ theme }) => theme.colors.brandDark};
//   border: 2px solid ${({ theme }) => theme.colors.light};
// `;

const Flex = styled.div`
  display: flex;
`;

const Header = ({ name, message, points, image, level, loading }) => (
  <Wrapper>
    <Content>
      <Title fontSize={28}>{name}</Title>
      <Space h={1} />
      <Flex>
        {points ? (
          <Flex>
            <Paragraph color="brand">
              {`${Types.decimalizeInt(points.balance)} points`}
            </Paragraph>
            <Paragraph opacity={0.4}>&nbsp;/&nbsp;</Paragraph>
            <Paragraph color="dark" opacity={0.4}>
              {`${Types.decimalizeInt(points.total)} total`}
            </Paragraph>
          </Flex>
        ) : (
          <Paragraph>{message}</Paragraph>
        )}
        {loading ? (
          <>
            <Space w={8} />
            <Spinner />
          </>
        ) : null}
      </Flex>
    </Content>
    <motion.div whileTap={{ scale: 0.9 }}>
      <ImageContainer to="/users/me">
        <ImageAvatar src={image} />
        <ImageShade />
        {/* <LevelWrapper>
          <img src={ribbonSrc} alt="ribbon" />
          <Level>
            <Paragraph
              color="light"
              fontSize={12}
            >
              {level}
            </Paragraph>
          </Level>
        </LevelWrapper> */}
      </ImageContainer>
    </motion.div>
  </Wrapper>
);

// Header.propTypes = {
//   name: PropTypes.string.isRequired,
//   message: PropTypes.string.isRequired,
//   points: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number])).isRequired,
//   image: PropTypes.string.isRequired,
//   level: PropTypes.number.isRequired,
//   loading: PropTypes.boo.isRequiredl
// };

export default Header;
