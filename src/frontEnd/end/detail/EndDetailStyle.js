import styled from "styled-components";
import { display, space } from "styled-system";

export const CancelledReasonWrapper = styled.div.attrs({})`
  padding: 127px 147px;
  color: #747474;

  .title {
    font-weight: 700;
    font-size: 23px;
  }

  .content {
    min-height: 230px;
  }
`;

export const ConfirmButton = styled.button.attrs({
  className: "btn btn-primary text-white",
})`
  padding-left: 50px;
  padding-right: 50px;
  ${space}
  ${display}
`;
