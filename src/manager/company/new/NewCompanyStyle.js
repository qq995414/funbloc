import styled from "styled-components"
import { Container } from "react-bootstrap"

export const EditWrapper = styled(Container)`
  padding: 118px 0;
`
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

export const EditRow = styled.div.attrs({
    className: 'row align-items-center mb-3 mx-auto'
})`
  width: 50%;
  font-size: 13px;
`

export const Label = styled.div.attrs({
    className: 'text-end'
})`
  color: #000000;
  font-weight: 600;
  line-height: 17px;
  font-family: 'Noto Sans', sans-serif;
`
export const ClearButton = styled.button.attrs({
    className: "btn btn-danger text-white mx-3"
})`
  font-size: 12px;
  width: 126px;
  height: 33px;
`
export const SaveButton = styled.button.attrs({
    className: "btn btn-primary text-white mx-3"
})`
  font-size: 12px;
  width: 126px;
  height: 33px;
`

export const StyledInput = styled.input.attrs({
    className: 'form-control border-primary'
})`
  font-size: 12px;
  color: #747474;
`


export const StyledSelect = styled.select.attrs({
    className: 'form-select border-primary'
})`
  font-size: 12px;
  color: #747474;
`