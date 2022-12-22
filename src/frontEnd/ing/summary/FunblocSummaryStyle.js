import styled from "styled-components"
import { typography } from "styled-system"

export const SummaryName = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: #747474;
  ${typography}
`

export const SummaryTable = styled.table.attrs({
    className: 'table text-center table-hover'
})`
  color: #747474;

  th {
    padding: 1.2rem 1rem;
    font-size: 13px;
    vertical-align: middle;
  }

  th.border-left {
    border-left: 1px solid #26B7BC;
  }

  td {
    padding: 1.2rem 1rem;

    &.summary {
      background-color: rgba(248, 249, 249, 1);
    }
  }
`

export const BackButton = styled.button.attrs({
    className: 'btn btn-danger text-white d-block mx-auto mt-5'
})`
  width: 168px;
`

export const CloseButton = styled.button.attrs({
  className: "btn-close position-absolute"
})`
  top: 0px;
  right: 12px;
`