import styled from "styled-components";

export const AdminContentWrapper = styled.div`
  padding: 62px 90px;
  font-family: "Noto Sans", sans-serif;
  .ck-content {
    min-height: 160px;
  }
`;

export const MessageWrapper = styled.div.attrs({
  className: "container w-50 mx-auto",
})``;

export const MessageTitle = styled.div`
  margin-bottom: 30px;
  color: #26b7bc;
  font-style: normal;
  font-weight: 600;
  font-size: 15px;
  line-height: 20px;
`;

export const Label = styled.div`
  color: #000000;
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
`;
export const StyledSelect = styled.select.attrs({
  className: "form-select border-primary",
})`
  font-size: 13px;
  color: #747474;
`;
export const NoteMessage = styled.div.attrs({
  className: "mt-2",
})`
  font-size: 13px;
  color: #747474;
`;
export const MessageSendButton = styled.button.attrs({
  className: "btn btn-primary text-white mx-auto d-block",
})`
  margin-top: 40px;
  width: 126px;
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
    font-size: 13px;

    &:focus-visible,
    &:focus {
      outline: none;
      border: none;
    }
  }
`;

export const RecordWrapper = styled.div.attrs({
  className: "container w-100",
})`
  height: 250px;
  margin-top: 57px;
  font-size: 14px;
  color: #747474;
  overflow-y: auto;
`;

export const RecordTitle = styled.div.attrs({
  className: "text-primary",
})``;
