/* eslint-disable react/prop-types */
/* eslint-disable no-undef */

import styled from "styled-components/macro";

// import logoSrc from '../common/assets/logo.png';
// import logoFullSrc from '../common/assets/logo-full.svg';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 40px 0 40px;
  align-items: center;
  justify-content: center;
  #admin[data-is-tablet="true"] #sidebar & {
    display: none;
  }
`;

const Image = styled.div`
  background-image: url(${({ src }) => src || logoSrc});
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  height: 85px;
  width: 100%;
  max-width: 250px;

  [data-component="PageLogin"] & {
    max-width: 280px;
  }
`;

export function Logo({ src, ...props }) {
  return (
    <Wrapper {...props}>
      <Image src={src || logoSrc} />
    </Wrapper>
  );
}

export function LogoFull({ src, ...props }) {
  return (
    <Wrapper {...props}>
      {/* <Image src={src || logoFullSrc} /> */}
      <Image src={src || logoSrc} />
    </Wrapper>
  );
}

export function renderLogo() {
  return <LogoFull />;
}

export function renderSidebarLogo() {
  return <Logo />;
}
