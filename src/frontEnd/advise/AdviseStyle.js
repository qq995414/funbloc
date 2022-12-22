import styled from "styled-components";
import { flexbox, layout, space } from "styled-system";

export const Title = styled.div.attrs({
  className: "text-center",
})`
  margin-bottom: 14px;
  font-weight: 700;
  font-size: 24px;
  line-height: 37px;
  color: #515151;
`;

export const Content = styled.div.attrs({})`
  padding: 100px 175px;
  ${space}
`;
export const Text = styled.div.attrs({
  className: "text-primary text-center",
})`
  font-size: 16px;
  line-height: 37px;
`;
export const FormWrapper = styled.form.attrs({
  className: "d-flex",
})`
  margin-top: 41px;
  ${flexbox}
  ${space}
  ${layout}
  .file,
  .img-wrapper {
    /* width: 35%; */
  }
`;

export const UploadContent = styled.div.attrs({
  className: "border-primary text-primary text-center p-4",
})`
  width: 100%;
  border-width: 2px;
  border-style: dashed;
  background-color: #f7fefd;
  cursor: pointer;
  font-size: 14px;
  ${layout}
`;

export const InnerContent = styled.div.attrs({
  className: "h-100 w-100 text-primary text-center mx-auto p-4",
})`
  border-width: 2px;
  border-style: dashed;
  border-color: #cceff0;
`;

export const StyledTextarea = styled.textarea.attrs({
  className: "form-control border-primary",
})`
  margin-left: 1rem;
  padding: 10px 20px;
  width: calc(65% - 1rem);
  resize: none;
  font-size: 14px;
  color: #747474;
  ${layout}
  ${space}
`;
