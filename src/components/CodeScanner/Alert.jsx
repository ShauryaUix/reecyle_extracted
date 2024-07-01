import AntdAlert from "antd/lib/alert";
import styled, { css } from "styled-components";

const Alert = styled(AntdAlert)`
  .ant-alert-message {
    ${({ type }) =>
      type === "success"
        ? css`
            color: #52c41a !important;
          `
        : type === "error"
          ? css`
              color: #f5222d !important;
            `
          : type === "warning"
            ? css`
                color: #faad14 !important;
              `
            : null}
  }
`;

export default Alert;
