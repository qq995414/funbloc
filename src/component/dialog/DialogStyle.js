import styled, { css } from "styled-components";
import { layout } from "styled-system";

export const DialogWrapper = styled.div.attrs({
  className: "position-fixed",
})`
  padding: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: rgba(196, 196, 196, 0.5);
  top: 0;
  left: 0;
  z-index: 10;
  overflow-y: auto;
  @media (max-width: 40em) {
    padding: 20px;
  }
  ${({ extend }) => {
    if (extend) {
      return css`
        display: block;
      `;
    }
  }}
`;

export const DialogContentWrapper = styled.div.attrs({
  className: "d-flex flex-column align-items-center mx-auto",
})`
  position: relative;
  justify-content: center;
  background: #ffffff;
  border: 0.5px solid #26b7bc;
  box-shadow: 0 4px 6px rgba(137, 137, 137, 0.25);
  border-radius: 20px;
  width: ${({ width }) => (width ? width + "px" : "488px")};
  min-height: ${({ height }) => (height ? height + "px" : "297px")};
  ${layout};
`;

export const DialogConfirmContentWrapper = styled(DialogContentWrapper).attrs(
  {}
)`
  width: 369px;
  min-height: 181px;
`;

export const DialogTitle = styled.div.attrs({
  className: "",
})`
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 45px;
  color: #000000;
  text-align: center;
`;

export const DialogButton = styled.button.attrs({
  className: "btn border-0 text-white mx-2",
})`
  width: 140px;
  height: 47px;

  &.cancel {
    background-color: #d2d2d2;
  }
`;
