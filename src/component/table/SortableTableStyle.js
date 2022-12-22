import styled from "styled-components"
import { TableWrapper } from "./TableStyle"

export const SortableTableWrapper = styled(TableWrapper).attrs({})``


export const HeadRow = styled.div.attrs({
    className: 'row'
})`
  background-color: #E6E6E6;
`

export const HeadCol = styled.div.attrs({
    className: 'col text-primary text-center'
})`
  padding: 7px 0;
  line-height: 38px;
`

export const StyledUl = styled.ul.attrs({
    className: 'ps-0 mb-0'
})`
  list-style: none;
`
export const StyledLi = styled.li.attrs({
    className: 'text-center'
})`

`

export const SortedItemRow = styled.div.attrs({
    className: 'row'
})`
  div {
    padding: 12px 0;
  }

  &.active {
    background-color:rgba(38, 183, 188, 0.1);;
  }
`