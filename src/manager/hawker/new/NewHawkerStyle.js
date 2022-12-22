import styled from "styled-components";
import { Container } from "react-bootstrap";
import { layout, space } from "styled-system";

export const CreateHawkerContainer = styled(Container)`
  padding: 118px 0;
`;
export const StyledRow = styled.div.attrs({
  className: "row align-items-center mx-auto mb-4 w-50",
})``;

export const Label = styled.div.attrs({
  className: "text-end",
})`
  color: #000000;
  font-weight: 600;
  line-height: 17px;
  font-family: "Noto Sans", sans-serif;
`;

export const StyledInput = styled.input.attrs({
  className: "form-control border-primary",
})`
  font-size: 12px;
  color: #747474;

  &.w-60 {
    width: 60%;
  }
`;

export const ErrorMessage = styled.div.attrs({
  className: "text-danger",
})`
  font-size: 12px;
`;

export const StyledDate = styled.div.attrs({
  className: "form-control border-primary d-flex align-items-center",
})`
  i {
    margin-right: 1rem;
  }

  input {
    border: none;
    width: 100%;
    color: #747474;

    &:focus-visible,
    &:focus {
      outline: none;
      border: none;
    }
  }
`;

export const StyledTextarea = styled.textarea.attrs(({ error }) => ({
  className: `form-control ${error ? "border-danger" : "border-primary"}`,
}))`
  resize: none;
  font-size: 12px;
  color: #747474;
  ${layout}
  ${space}
`;
export const StyledSelect = styled.select.attrs({})`
  width: 60%;
  font-size: 12px;
  color: #747474;
`;

export const ClearButton = styled.button.attrs({
  className: "btn btn-danger text-white mx-3",
})`
  font-size: 12px;
  width: 126px;
  height: 33px;
`;
export const SaveButton = styled.button.attrs({
  className: "btn btn-primary text-white mx-3",
})`
  font-size: 12px;
  width: 126px;
  height: 33px;
`;
