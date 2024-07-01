import React from "react";
import styled from "styled-components";
import { AnimateSharedLayout } from "framer-motion";

import Item from "./Item";

import Button from "../Button";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  flex: 1 0 auto;
  padding-bottom: calc(env(safe-area-inset-bottom) / 2);
  z-index: 1;
`;

const CenterContent = styled.div`
  display: flex;
  align-items: center;
  margin: auto;
`;

const StyledButton = styled(Button)`
  margin: 0 20px;
`;

const Navigation = ({ items, active, onClick }) => (
  <Wrapper>
    <CenterContent>
      <AnimateSharedLayout>
        {items.map((item) =>
          item.type === "link" ? (
            <Item
              key={item.action}
              active={active === item.action}
              onClick={() => onClick(item.action)}
              name={item.name}
            />
          ) : (
            <StyledButton
              color="transparent"
              key={item.action}
              onClick={() => onClick(item.action)}
            >
              <img src={item.icon} width={50} height={50} alt={item.name} />
            </StyledButton>
          ),
        )}
      </AnimateSharedLayout>
    </CenterContent>
  </Wrapper>
);

export default Navigation;
