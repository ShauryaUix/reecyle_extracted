import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";

import { Paragraph } from "../Text";

const spring = {
  type: "spring",
  stiffness: 100,
  damping: 13,
  mass: 1,
};

const Wrapper = styled(motion.div)`
  position: relative;
`;

const Circle = styled(motion.div)`
  position: absolute;
  top: 10px;
  left: calc(50% - 3px);
  width: 5px;
  height: 5px;
  border-radius: 5px;
  background: ${({ theme }) => theme.colors.light};
`;

const StyledParagraph = styled(Paragraph)`
  letter-spacing: 3px;
  text-transform: uppercase;
  padding: 20px 0;
`;

const variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
};

const Item = ({ name, active, onClick }) => (
  <Wrapper onClick={onClick} whileTap={{ scale: 0.9 }}>
    <StyledParagraph color="light" fontWeight={600} fontSize={13}>
      {name}
    </StyledParagraph>
    {active && (
      <motion.div variants={variants} initial="hidden" animate="visible">
        <Circle layoutId="circle" initial={false} transition={spring} />
      </motion.div>
    )}
  </Wrapper>
);

export default Item;
