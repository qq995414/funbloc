import styled from "styled-components";
import { layout, space } from "styled-system";

export const ConfirmOpenWrapper = styled.div`
  padding: 80px 115px;
  width: 100%;
  height: 100%;
  color: #747474;
  font-size: 14px;
  ${space}
  ${layout}
`;

export const Title = styled.div.attrs({
  className: "text-center",
})`
  margin-bottom: 70px;
  font-size: 18px;
  line-height: 45px;
  color: #000;
  ${space}
`;
export const StyledInput = styled.input.attrs({
  className: "form-control border-primary",
})``;

export const ConfirmText = styled.div.attrs({
  className: "text-center",
})`
  margin-top: 50px;
  font-weight: 500;
  font-size: 17px;
  line-height: 45px;
  color: #000;
`;
