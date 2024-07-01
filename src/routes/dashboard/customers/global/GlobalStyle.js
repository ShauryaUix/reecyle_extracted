import { createGlobalStyle } from "styled-components";
import reset from "styled-reset-advanced";

export default createGlobalStyle`
  ${reset};
  img { pointer-events: none; }

  body {
    font-family: 'Avenir Next', 'Inter', 'Helvetica Neue', 'Helvetica',
      sans-serif;
    font-weight: 500;
  }

  body, html {
    position: relative;
    width: 100%;
    overflow-x: hidden;
  }

  *, *:before, *:after {
    user-select: none !important;
  }

  strong {
    font-weight: 700;
    /* text-decoration: underline; */
    /* font-style: italic; */
  }
`;
