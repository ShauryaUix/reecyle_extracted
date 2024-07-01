import styled from "styled-components";
import PropTypes from "prop-types";

const Title = styled.h2`
  line-height: 1.2;
  color: ${({ theme, color, customColor }) =>
    customColor ? customColor : theme.colors.text[color]};
  font-size: ${({ fontSize }) => fontSize}px;
  font-weight: ${({ fontWeight }) => fontWeight};
  opacity: ${({ opacity }) => opacity};
`;

Title.propTypes = {
  color: PropTypes.oneOf(["brand", "dark", "light"]),
  customColor: PropTypes.string,
  fontWeight: PropTypes.number,
  fontSize: PropTypes.number,
  opacity: PropTypes.number,
};

Title.defaultProps = {
  color: "dark",
  customColor: "",
  fontWeight: 900,
  fontSize: 28,
  opacity: 1,
};

export default Title;
