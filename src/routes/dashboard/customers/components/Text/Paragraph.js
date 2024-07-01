import styled from "styled-components";
import PropTypes from "prop-types";

const Paragraph = styled.p`
  line-height: 1.25;
  color: ${({ theme, color, customColor }) =>
    customColor ? customColor : theme.colors.text[color]};
  font-size: ${({ fontSize }) => fontSize}px;
  font-weight: ${({ fontWeight }) => fontWeight};
  opacity: ${({ opacity }) => opacity};
  white-space: pre-wrap;
`;

Paragraph.propTypes = {
  color: PropTypes.oneOf(["brand", "dark", "light"]),
  customColor: PropTypes.string,
  fontWeight: PropTypes.number,
  fontSize: PropTypes.number,
  opacity: PropTypes.number,
};

Paragraph.defaultProps = {
  color: "dark",
  customColor: "",
  fontWeight: 500,
  fontSize: 14,
  opacity: 1,
};

export default Paragraph;
