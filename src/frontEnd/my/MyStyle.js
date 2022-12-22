import styled from "styled-components";
import { layout, space, typography } from "styled-system";

export const Title = styled.div.attrs({
  className: "text-primary text-center",
})`
  margin-bottom: 16px;
  font-weight: 700;
  font-size: 25px;
  line-height: 35px;
`;
export const FormContainer = styled.div.attrs({
  className: "container d-flex flex-column bg-white",
})`
  padding: 55px 5% 100px 5%;
  margin-top: 19px;
  min-height: 550px;
  border: 1px solid #26b7bc;
  border-radius: 26px;
  color: #747474;
  font-size: 14px;
  ${space}
  ${typography}
  ${layout}
`;
export const StyledRow = styled.div.attrs({
  className: "row align-items-center",
})`
  margin-bottom: 20px;
`;
export const CancelButton = styled.button.attrs({
  className: "btn btn-danger text-white",
})`
  width: 123px;
`;
export const SaveButton = styled.button.attrs({
  className: "btn btn-primary text-white",
})`
  width: 123px;
`;
