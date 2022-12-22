import styled from "styled-components"

export const NewAdminWrapper = styled.div.attrs({
    className: 'w-50 mx-auto container'
})`
  padding: 120px 0;
`

export const Label = styled.div.attrs({
    className: "text-end"
})`
  font-size: 13px;
  color: #000;
  font-weight: bold;
`
export const StyledInput = styled.input.attrs(({ error }) => ({
    className: `form-control ${error ? 'border-danger' : 'border-primary'}`
}))`
  font-size: 12px;
  color: #747474;
`
export const StyledTextarea = styled.textarea.attrs({
    className: 'form-control border-primary'
})`
  width: 100%;
  resize: none;
  font-size: 12px;
  color: #747474;
`

export const SaveButton = styled.button.attrs({
    className: "btn btn-primary text-white mx-2"
})`
  font-size: 12px;
  width: 126px;
  height: 33px;
`

export const ActivateButton = styled.button.attrs({
    className: "btn btn-info text-white mx-2"
})`
  font-size: 12px;
  width: 126px;
  height: 33px;
`
export const InactivateButton = styled.button.attrs({
    className: "btn btn-danger text-white mx-2"
})`
  font-size: 12px;
  width: 126px;
  height: 33px;
`