import styled from "styled-components"

export const EditTitle = styled.div`
  margin-bottom: 28px;
  color: #26B7BC;
  font-family: 'Noto Sans', sans-serif;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 25px;
  letter-spacing: 0.06em;
`

export const SubTitle = styled(EditTitle).attrs({
    className: 'd-flex justify-content-between align-items-center'
})`
  margin-top: 83px;
  margin-bottom: 8px;
`

export const Label = styled.div.attrs({
    className: 'text-end'
})`
  font-family: 'Century Gothic';
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 15px;
`

export const StyledInput = styled.input.attrs(({ error }) => ({
    className: `form-control  ${error ? 'border-danger' : 'border-primary'}`
}))`
  font-size: 12px;
  color: #747474;
`

export const StyledSelect = styled.select.attrs(({ error }) => ({
    className: `form-select ${error ? 'border-danger' : 'border-primary'}`
}))`
  font-size: 12px;
  color: #747474;
`

export const Divider = styled.div.attrs({})`
  height: 1px;
  background-color: #C0C0C0CC;
`

export const FormWrapper = styled.div`
  padding: 84px 65px 74px;
`
export const ProductWrapper = styled.div`
  padding: 43px 37px 38px;

`

export const ProductTitle = styled.div.attrs({
    className: 'col'
})`
  font-size: 13px;
`

export const ProductRow = styled.div.attrs({
    className: 'row'
})`
  border: 1px solid #CCEFF0;
  margin-bottom: 11px;
`

export const ProductCol = styled.div.attrs({
    className: 'col d-flex align-items-center justify-content-center'
})`
  padding: 23px;
  background-color: #F5FEFF;
  color: #747474;
  font-size: 12px;
`

export const SaveButton = styled.button.attrs({
    className: 'btn btn-info text-white mx-2'
})`
  width: 126px;
  background-color: #44B6F6;
`

export const ClearButton = styled.button.attrs({
    className: 'btn btn-danger text-white mx-2'
})`
  width: 126px;
`

export const ActivateButton = styled.button.attrs({
    className: 'btn btn-primary text-white mx-2'
})`
  width: 126px;
`