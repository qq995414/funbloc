import styled,{css} from "styled-components"
import { border, display, layout } from "styled-system"

export const TableWrapper = styled.div`
  border-radius: 10px;
  overflow: hidden;
  ${layout}
  .table {
    --bs-table-hover-bg: rgba(38, 183, 188, 0.1);
    margin-bottom: 0;

    > :not(:first-child) {
      border-top: none;
    }

    &.table-striped > tbody > tr:nth-of-type(odd) > * {
      background-color: transparent;
      box-shadow: none;
    }



    tbody {
      background-color: #fff;

      tr.active, tr:hover {
        background-color: rgba(38, 183, 188, 0.35);
      }

      td {
        vertical-align: middle;
        padding: 15px 10px;
        border-bottom: none;
      }

      tr:last-child {
        td:first-child {
          border-bottom-left-radius: 0.7rem;
        }

        td:last-child {
          border-bottom-right-radius: 0.7rem;
        }
      }

    }
  }

`
export const TheadTr = styled.tr`
  background-color: ${({ bgColor }) => bgColor || '#E6E6E6'};
  white-space: nowrap;
`
export const Th = styled.th`
  color: #26B7BC;
  border-bottom: none;
  padding: 15px 10px !important;
  ${display}
  &:first-child {
    border-top-left-radius: .75rem;
  }

  &:last-child {
    border-top-right-radius: .75rem;
  }
  ${border}
`

export const Tr = styled.tr`

  td {
    color: #747474;
    font-size: 12px;
    font-family: 'Noto Sans', sans-serif;
  }
  .flex{
    display: flex;
    justify-content:center;
    align-items:center;
  }
  td.icon {
    color: ${({ color }) => color ? color : '#747474'};
  }

  &:hover td.icon {
    color: ${({ color }) => color ? color : '#747474'};
  }


`
export const Notice = styled.div`
  width: 8px;
  height: 8px;
  margin-left:2rem ;
  margin-right:2rem;
  border-radius:100%;
  
  ${props => props.show === 0 && css`
    background: #DB5F5F;
  `}
`
