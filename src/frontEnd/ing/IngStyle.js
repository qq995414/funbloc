import styled from "styled-components"
import { layout, space } from "styled-system"
import { TdButton } from "../../component/StyledComponent"

export const EnterButton = styled(TdButton).attrs({
    className: 'btn btn-info-dark rounded-pill border-0 px-4 text-white'
})`
  background-color: #53BBC1;
`
export const PaymentStatusButton = styled(TdButton).attrs({
    className: 'btn btn-success rounded-pill border-0 px-4 text-white'
})`
  background-color: #48C97C;
`
export const CheckDetailButton = styled(TdButton).attrs({
    className: 'btn btn-warning rounded-pill border-0 px-4 text-white'
})`
  background-color: #FF9A3D;
`

export const PaymentModal = styled.div.attrs({
    className: 'w-100 h-100 position-relative'
})`
  padding: 42px 100px;
  ${space}
  .title {
    margin-bottom: 33px;
    font-size: 18px;
    font-weight: 400;
    line-height: 44px;
  }

  .head {
    font-weight: 600;
    font-size: 12px;
    line-height: 27px;
  }

  .container.h-300 {
    width: 100%;
    height: 300px;
    overflow: auto;
  }

  .text, select {
    font-size: 12px;
    color: #747474;
  }

`

export const CloseButton = styled.button.attrs({
    className: "btn-close position-absolute"
})`
  top: 26px;
  right: 23px;
`

export const StyledSelect = styled.select.attrs({
    className: 'form-select border-primary'
})`
  @media (max-width: 40em) {
    padding: 0.375rem 1rem 0.375rem 0.15rem;
    font-size: 10px;
  }
`

export const StyledTd = styled.td`
  white-space: nowrap;
  ${layout}
  ${space}
  font-size: 12px;
`