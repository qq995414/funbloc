import styled from "styled-components"

export const EditTitle = styled.div.attrs({
    className: 'text-primary text-center mt-4'
})`
  font-weight: 600;
  font-size: 19px;
  line-height: 38px;
  margin-bottom: 50px;
`

export const EditForm = styled.div.attrs({
    className: 'container-fluid p-5'
})`

  .label {
    font-family: 'Century Gothic';
    font-weight: bold;
    font-size: 15px;
    line-height: 15px;
    letter-spacing: 0.06em;
    color: #000000;
  }

  .name {
    font-family: 'Century Gothic';
    font-weight: 400;
    font-size: 15px;
    line-height: 15px;
    color: #C0C0C0;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type="number"] {
    -moz-appearance: textfield;

    &:read-only {
      background-color: transparent;
    }
  }

  textarea {
    resize: none;
  }

  button {
    width: 176px;
  }
`

export const SubTitle = styled.div.attrs({
    className: 'text-primary mb-3'
})`
  font-family: 'Noto Sans';
  font-style: normal;
  font-weight: 600;
  font-size: 19px;
  line-height: 25px;
  letter-spacing: 0.05em;
`

export const HistoryLabelRow = styled.div`
  padding: 12px 0;
  border-bottom: 1px dashed #26B7BC;
`

export const PillBadge = styled.span.attrs({
    className: 'badge rounded-pill me-2'
})`
  width: 97px;

  + span {
    color: #747474;
    font-size: 12px;
  }
`
 