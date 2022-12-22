import styled from "styled-components"

export const ButtonWrapper = styled.div.attrs({
    className: 'd-flex justify-content-end'
})``

export const BlockButton = styled.button.attrs({
    className: "btn btn-danger text-white"
})`
  width: 176px;
`
export const ActivateButton = styled.button.attrs({
    className: "btn btn-primary text-white"
})`
  width: 176px;
`

export const HawkerDetailTitle = styled.div.attrs({
    className: 'text-primary'
})`
  font-weight: bold;
  font-size: 19px;
  font-family: 'Noto Sans', sans-serif;
  margin-bottom: 35px;
`

export const StyledRow = styled.div.attrs({
    className: 'row'
})`
  margin-bottom: 25px;
`

export const StyledCol = styled.div.attrs({
    className: 'col d-flex'
})``

export const Label = styled.div.attrs({})`
  width: 100px;
  font-weight: bolder;
  font-size: 14px;
  font-family: 'Century Gothic', sans-serif;
`

export const Field = styled.div`
  font-weight: bold;
  font-size: 14px;
  font-family: 'Century Gothic', sans-serif;
`

export const StyledSelect = styled.select.attrs({
    className: 'form-select border-primary'
})`
  min-width: 156px;
  font-size: 14px;
`
export const StyledTextarea = styled.textarea.attrs({
    className: 'form-control border-primary'
})`
  width: calc(100% - 156px);
  resize: none;
  font-size: 12px;
  color: #747474;
`


export const BlockContent = styled.div.attrs({
    className: 'text-center'
})`
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 18px;
  margin-bottom: 25px;
`
export const BlockTextarea = styled(StyledTextarea).attrs({})`
  width: 100%;
  font-size: 1rem;
`

export const ActivateTitle = styled.div`
  font-weight: bold;
  font-size: 20px;
  color: #000;
  line-height: 56px;
  font-family: 'Roboto', sans-serif;
`
export const BlockedReason = styled.div`
  color: #AEAEAE;
  font-weight: 400;
  font-size: 16px;
  font-family: 'Roboto', sans-serif;
`
export const ActivateDivider = styled.div`
  margin: 60px 0;
  width: 100%;
  height: 1px;
  background-color: #747474;
`